/**
 * API Routes para Resolución específica
 * Endpoints: GET (obtener por ID), PUT (actualizar - solo antes de firma), DELETE (eliminar borrador)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/resoluciones/[id]
 * Obtener una resolución específica
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const resolucion = await prisma.resolucion.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            juzgado: true,
            abogadoActor: true,
            abogadoDemandado: true,
          },
        },
      },
    });

    if (!resolucion) {
      return NextResponse.json(
        { error: "Resolución no encontrada" },
        { status: 404 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Control de acceso
    const isJuez = hasRole(profile.role, UserRole.JUEZ);
    const isAbogadoActor = profile.id === resolucion.proceso.abogadoActorId;
    const isAbogadoDemandado =
      profile.id === resolucion.proceso.abogadoDemandadoId;

    if (!isJuez && !isAbogadoActor && !isAbogadoDemandado) {
      return NextResponse.json(
        { error: "No tienes acceso a esta resolución" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: resolucion,
    });
  } catch (error) {
    console.error("Error al obtener resolución:", error);
    return NextResponse.json(
      { error: "Error al obtener resolución" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resoluciones/[id]
 * Actualizar una resolución (solo JUEZ que la creó, solo si no está firmada)
 * NOTA: Las resoluciones se consideran firmadas automáticamente al crearse
 * Este endpoint es principalmente para actualizar metadata como fechaNotificacion
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const resolucion = await prisma.resolucion.findUnique({
      where: { id },
      include: {
        proceso: true,
      },
    });

    if (!resolucion) {
      return NextResponse.json(
        { error: "Resolución no encontrada" },
        { status: 404 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Solo el juez que la firmó puede actualizarla
    if (!hasRole(profile.role, UserRole.JUEZ) || resolucion.firmadoPor !== profile.id) {
      return NextResponse.json(
        { error: "No tienes permiso para modificar esta resolución" },
        { status: 403 }
      );
    }

    // Solo permitir actualizar fechaNotificacion y metadata, no el contenido
    const allowedUpdates: any = {};

    if (body.fechaNotificacion !== undefined) {
      allowedUpdates.fechaNotificacion = body.fechaNotificacion
        ? new Date(body.fechaNotificacion)
        : null;
    }

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: "No hay campos válidos para actualizar" },
        { status: 400 }
      );
    }

    const resolucionActualizada = await prisma.resolucion.update({
      where: { id },
      data: allowedUpdates,
    });

    return NextResponse.json({
      success: true,
      data: resolucionActualizada,
      message: "Resolución actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar resolución:", error);
    return NextResponse.json(
      { error: "Error al actualizar resolución" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resoluciones/[id]
 * Eliminar una resolución (solo JUEZ que la creó, con restricciones)
 * NOTA: Generalmente las resoluciones NO deben eliminarse por razones de auditoría
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const resolucion = await prisma.resolucion.findUnique({
      where: { id },
      include: {
        proceso: true,
      },
    });

    if (!resolucion) {
      return NextResponse.json(
        { error: "Resolución no encontrada" },
        { status: 404 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Solo el juez que la firmó puede eliminarla
    if (!hasRole(profile.role, UserRole.JUEZ) || resolucion.firmadoPor !== profile.id) {
      return NextResponse.json(
        { error: "No tienes permiso para eliminar esta resolución" },
        { status: 403 }
      );
    }

    // Verificar que no haya sido notificada (solo se pueden eliminar borradores)
    if (resolucion.fechaNotificacion) {
      return NextResponse.json(
        {
          error:
            "No se puede eliminar una resolución que ya fue notificada. Por razones de auditoría, las resoluciones notificadas son inmutables.",
        },
        { status: 400 }
      );
    }

    // Verificar que fue creada recientemente (menos de 1 hora)
    const horaCreacion = resolucion.createdAt.getTime();
    const ahora = Date.now();
    const unAHora = 60 * 60 * 1000;

    if (ahora - horaCreacion > unAHora) {
      return NextResponse.json(
        {
          error:
            "Solo se pueden eliminar resoluciones creadas hace menos de 1 hora",
        },
        { status: 400 }
      );
    }

    await prisma.resolucion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Resolución eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar resolución:", error);
    return NextResponse.json(
      { error: "Error al eliminar resolución" },
      { status: 500 }
    );
  }
}

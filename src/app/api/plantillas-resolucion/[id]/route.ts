/**
 * API Routes para Plantilla de Resolución específica
 * Endpoints: GET (obtener por ID), PUT (actualizar), DELETE (eliminar)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePlantillaResolucionSchema } from "@/lib/validations/resolucion";
import { UserRole } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/plantillas-resolucion/[id]
 * Obtener una plantilla específica
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const plantilla = await prisma.plantillaResolucion.findUnique({
      where: { id },
    });

    if (!plantilla) {
      return NextResponse.json(
        { error: "Plantilla no encontrada" },
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

    // Solo JUEZ puede acceder
    if (!hasRole(profile.role, UserRole.JUEZ)) {
      return NextResponse.json(
        { error: "Solo los jueces pueden acceder a las plantillas" },
        { status: 403 }
      );
    }

    // Verificar acceso
    const tieneAcceso =
      plantilla.creadoPor === profile.id ||
      (plantilla.compartida && plantilla.juzgadoId === profile.juzgadoId) ||
      (plantilla.compartida && plantilla.juzgadoId === null);

    if (!tieneAcceso) {
      return NextResponse.json(
        { error: "No tienes acceso a esta plantilla" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: plantilla,
    });
  } catch (error) {
    console.error("Error al obtener plantilla:", error);
    return NextResponse.json(
      { error: "Error al obtener plantilla" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/plantillas-resolucion/[id]
 * Actualizar una plantilla (solo el creador)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const plantilla = await prisma.plantillaResolucion.findUnique({
      where: { id },
    });

    if (!plantilla) {
      return NextResponse.json(
        { error: "Plantilla no encontrada" },
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

    // Solo el creador puede modificarla
    if (plantilla.creadoPor !== profile.id) {
      return NextResponse.json(
        { error: "Solo el creador puede modificar esta plantilla" },
        { status: 403 }
      );
    }

    // Validar con Zod
    const validatedData = updatePlantillaResolucionSchema.parse({
      id,
      ...body,
    });

    // Construir datos de actualización
    const updateData: any = {};

    if (validatedData.tipo) updateData.tipo = validatedData.tipo;
    if (validatedData.titulo) updateData.titulo = validatedData.titulo;
    if (validatedData.vistos !== undefined)
      updateData.vistos = validatedData.vistos || null;
    if (validatedData.considerando !== undefined)
      updateData.considerando = validatedData.considerando || null;
    if (validatedData.porTanto) updateData.porTanto = validatedData.porTanto;
    if (validatedData.descripcion !== undefined)
      updateData.descripcion = validatedData.descripcion || null;
    if (validatedData.compartida !== undefined)
      updateData.compartida = validatedData.compartida;
    if (validatedData.activa !== undefined)
      updateData.activa = validatedData.activa;

    // Si se activa como compartida, asignar juzgado
    if (updateData.compartida && !plantilla.compartida) {
      updateData.juzgadoId = profile.juzgadoId;
    } else if (updateData.compartida === false) {
      updateData.juzgadoId = null;
    }

    const plantillaActualizada = await prisma.plantillaResolucion.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: plantillaActualizada,
      message: "Plantilla actualizada exitosamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar plantilla:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de plantilla inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar plantilla" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/plantillas-resolucion/[id]
 * Eliminar una plantilla (solo el creador)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const plantilla = await prisma.plantillaResolucion.findUnique({
      where: { id },
    });

    if (!plantilla) {
      return NextResponse.json(
        { error: "Plantilla no encontrada" },
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

    // Solo el creador puede eliminarla
    if (plantilla.creadoPor !== profile.id) {
      return NextResponse.json(
        { error: "Solo el creador puede eliminar esta plantilla" },
        { status: 403 }
      );
    }

    await prisma.plantillaResolucion.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Plantilla eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar plantilla:", error);
    return NextResponse.json(
      { error: "Error al eliminar plantilla" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/plantillas-resolucion/[id]
 * Incrementar el contador de usos de una plantilla
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const plantilla = await prisma.plantillaResolucion.findUnique({
      where: { id },
    });

    if (!plantilla) {
      return NextResponse.json(
        { error: "Plantilla no encontrada" },
        { status: 404 }
      );
    }

    const plantillaActualizada = await prisma.plantillaResolucion.update({
      where: { id },
      data: {
        usosCantidad: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: plantillaActualizada,
    });
  } catch (error) {
    console.error("Error al actualizar contador de usos:", error);
    return NextResponse.json(
      { error: "Error al actualizar contador de usos" },
      { status: 500 }
    );
  }
}

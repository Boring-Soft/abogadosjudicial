import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createDemandaSchema } from "@/lib/validations/demanda";
import { EstadoProceso, TipoNotificacion } from "@prisma/client";
import crypto from "crypto";

/**
 * PUT /api/demandas/[id]
 * Actualizar demanda observada (solo ABOGADO)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación y rol
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const hasPermission = await requireRole(user.id, ["ABOGADO"]);
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Solo los abogados pueden actualizar demandas" },
        { status: 403 }
      );
    }

    // Obtener perfil del abogado
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Parsear y validar datos
    const body = await req.json();
    const validatedData = createDemandaSchema.parse(body);

    // Verificar que la demanda existe
    const demandaExistente = await prisma.demanda.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            juzgado: true,
            juez: true,
          },
        },
      },
    });

    if (!demandaExistente) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el abogado es el propietario del proceso
    if (demandaExistente.proceso.abogadoActorId !== profile.id) {
      return NextResponse.json(
        { error: "No tiene permisos para actualizar esta demanda" },
        { status: 403 }
      );
    }

    // Verificar que el proceso está en estado OBSERVADO
    if (demandaExistente.proceso.estado !== EstadoProceso.OBSERVADO) {
      return NextResponse.json(
        { error: "Solo se pueden actualizar demandas observadas" },
        { status: 400 }
      );
    }

    // Generar nuevo hash del contenido
    const contenido = JSON.stringify({
      designacionJuez: validatedData.designacionJuez,
      objeto: validatedData.objeto,
      hechos: validatedData.hechos,
      derecho: validatedData.derecho,
      petitorio: validatedData.petitorio,
      valorDemanda: validatedData.valorDemanda,
      pruebaOfrecida: validatedData.pruebaOfrecida,
    });
    const hash = crypto.createHash("sha256").update(contenido).digest("hex");

    const nuevaVersion = demandaExistente.version + 1;
    const documentoUrl = `/storage/procesos/${demandaExistente.proceso.nurej}/demandas/demanda_v${nuevaVersion}.pdf`;

    // Actualizar demanda y proceso en una transacción
    const demandaActualizada = await prisma.$transaction(async (tx) => {
      // Actualizar demanda
      const demanda = await tx.demanda.update({
        where: { id },
        data: {
          designacionJuez: validatedData.designacionJuez,
          objeto: validatedData.objeto,
          hechos: validatedData.hechos,
          derecho: validatedData.derecho,
          petitorio: validatedData.petitorio,
          valorDemanda: validatedData.valorDemanda,
          pruebaOfrecida: validatedData.pruebaOfrecida,
          documentoUrl,
          documentoHash: hash,
          version: nuevaVersion,
          observaciones: null, // Limpiar observaciones previas
        },
      });

      // Cambiar estado del proceso a PRESENTADO
      await tx.proceso.update({
        where: { id: demandaExistente.procesoId },
        data: {
          estado: EstadoProceso.PRESENTADO,
        },
      });

      return demanda;
    });

    // Notificar al JUEZ
    if (demandaExistente.proceso.juezId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: demandaExistente.proceso.juezId,
          procesoId: demandaExistente.procesoId,
          tipo: TipoNotificacion.DEMANDA_PRESENTADA,
          titulo: "Demanda corregida y re-presentada",
          mensaje: `El abogado ha corregido y re-presentado la demanda en el proceso ${
            demandaExistente.proceso.nurej || demandaExistente.procesoId
          }. Versión: ${nuevaVersion}`,
          accionUrl: `/dashboard/juez/demandas/${demandaActualizada.id}`,
          leida: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: demandaActualizada,
      message: "Demanda actualizada y re-presentada exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar demanda:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar la demanda" },
      { status: 500 }
    );
  }
}

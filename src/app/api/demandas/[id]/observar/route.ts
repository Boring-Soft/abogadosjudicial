import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { observarDemandaSchema } from "@/lib/validations/demanda";
import {
  EstadoProceso,
  TipoNotificacion,
  TipoResolucion,
  TipoPlazo,
  EstadoPlazo,
} from "@prisma/client";
import crypto from "crypto";

/**
 * POST /api/demandas/[id]/observar
 * Observar demanda (solo JUEZ)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const hasPermission = await requireRole(user.id, ["JUEZ"]);
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Solo los jueces pueden observar demandas" },
        { status: 403 }
      );
    }

    // Obtener demanda
    const demanda = await prisma.demanda.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            juzgado: true,
            abogadoActor: true,
          },
        },
      },
    });

    if (!demanda) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (
      !profile ||
      profile.juzgadoId !== demanda.proceso.juzgadoId ||
      demanda.proceso.juezId !== profile.id
    ) {
      return NextResponse.json(
        { error: "No tiene permisos para observar esta demanda" },
        { status: 403 }
      );
    }

    // Verificar estado
    if (demanda.proceso.estado !== EstadoProceso.PRESENTADO) {
      return NextResponse.json(
        { error: "La demanda no está en estado PRESENTADO" },
        { status: 400 }
      );
    }

    // Parsear datos
    const body = await req.json();
    const validatedData = observarDemandaSchema.parse({
      ...body,
      demandaId: id,
    });

    // Generar hash del decreto
    const decretoHash = crypto
      .createHash("sha256")
      .update(validatedData.observaciones)
      .digest("hex");

    const decretoUrl = `/storage/procesos/${demanda.proceso.nurej || demanda.procesoId}/decretos/observacion.pdf`;

    // Calcular fecha de vencimiento del plazo (días hábiles)
    const fechaInicio = new Date();
    const fechaVencimiento = new Date(fechaInicio);
    // Simplificado: agregar días corridos (TODO: implementar cálculo de días hábiles)
    fechaVencimiento.setDate(
      fechaVencimiento.getDate() + validatedData.plazoCorreccion
    );

    // Ejecutar transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar demanda con observaciones
      const demandaActualizada = await tx.demanda.update({
        where: { id },
        data: {
          observaciones: validatedData.observaciones,
        },
      });

      // Actualizar proceso a OBSERVADO
      await tx.proceso.update({
        where: { id: demanda.procesoId },
        data: { estado: EstadoProceso.OBSERVADO },
      });

      // Crear resolución (decreto de observación)
      const resolucion = await tx.resolucion.create({
        data: {
          procesoId: demanda.procesoId,
          tipo: TipoResolucion.PROVIDENCIA,
          titulo: "Decreto de Observación de Demanda",
          porTanto: validatedData.observaciones,
          documentoUrl: decretoUrl,
          documentoHash: decretoHash,
          firmadoPor: profile.id,
          fechaEmision: new Date(),
          fechaNotificacion: new Date(),
        },
      });

      // Crear plazo de corrección
      const plazo = await tx.plazo.create({
        data: {
          procesoId: demanda.procesoId,
          tipo: TipoPlazo.CONTESTACION, // Reutilizamos este tipo para la corrección
          estado: EstadoPlazo.ACTIVO,
          fechaInicio,
          fechaVencimiento,
          diasHabiles: validatedData.plazoCorreccion,
          destinatario: demanda.proceso.abogadoActorId,
          alertasEnviadas: [],
        },
      });

      // Notificar al abogado
      await tx.notificacion.create({
        data: {
          usuarioId: demanda.proceso.abogadoActorId,
          procesoId: demanda.procesoId,
          tipo: TipoNotificacion.DEMANDA_OBSERVADA,
          titulo: "Demanda observada",
          mensaje: `Su demanda tiene observaciones. Plazo de corrección: ${validatedData.plazoCorreccion} días`,
          accionUrl: `/dashboard/procesos/${demanda.procesoId}`,
          leida: false,
        },
      });

      return { demanda: demandaActualizada, resolucion, plazo };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Demanda observada exitosamente",
    });
  } catch (error) {
    console.error("Error al observar demanda:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al observar la demanda" },
      { status: 500 }
    );
  }
}

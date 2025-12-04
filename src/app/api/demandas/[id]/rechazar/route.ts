import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rechazarDemandaSchema } from "@/lib/validations/demanda";
import { EstadoProceso, TipoNotificacion, TipoResolucion } from "@prisma/client";
import crypto from "crypto";

/**
 * POST /api/demandas/[id]/rechazar
 * Rechazar demanda (solo JUEZ)
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
        { error: "Solo los jueces pueden rechazar demandas" },
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
        { error: "No tiene permisos para rechazar esta demanda" },
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
    const validatedData = rechazarDemandaSchema.parse({
      ...body,
      demandaId: id,
    });

    // Preparar texto del auto de rechazo
    const autoRechazo = `AUTO DE RECHAZO DE DEMANDA

MOTIVO: ${validatedData.motivo}

FUNDAMENTACIÓN:
${validatedData.fundamentacion}

Por tanto, SE RECHAZA la demanda presentada en el proceso ${demanda.proceso.nurej || demanda.procesoId}.

Regístrese, notifíquese y cúmplase.`;

    // Generar hash
    const autoHash = crypto.createHash("sha256").update(autoRechazo).digest("hex");

    const autoUrl = `/storage/procesos/${demanda.proceso.nurej || demanda.procesoId}/decretos/rechazo.pdf`;

    // Ejecutar transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar proceso a RECHAZADO
      const procesoActualizado = await tx.proceso.update({
        where: { id: demanda.procesoId },
        data: { estado: EstadoProceso.RECHAZADO },
      });

      // Crear resolución (auto de rechazo)
      const resolucion = await tx.resolucion.create({
        data: {
          procesoId: demanda.procesoId,
          tipo: TipoResolucion.AUTO_DEFINITIVO,
          titulo: "Auto de Rechazo de Demanda",
          vistos: `Demanda presentada en fecha ${demanda.createdAt.toLocaleDateString()}`,
          considerando: validatedData.fundamentacion,
          porTanto: autoRechazo,
          documentoUrl: autoUrl,
          documentoHash: autoHash,
          firmadoPor: profile.id,
          fechaEmision: new Date(),
          fechaNotificacion: new Date(),
        },
      });

      // Notificar al abogado
      await tx.notificacion.create({
        data: {
          usuarioId: demanda.proceso.abogadoActorId,
          procesoId: demanda.procesoId,
          tipo: TipoNotificacion.DEMANDA_RECHAZADA,
          titulo: "Demanda rechazada",
          mensaje: `Su demanda ha sido rechazada. Motivo: ${validatedData.motivo}`,
          accionUrl: `/dashboard/procesos/${demanda.procesoId}`,
          leida: false,
        },
      });

      return { proceso: procesoActualizado, resolucion };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Demanda rechazada exitosamente",
    });
  } catch (error) {
    console.error("Error al rechazar demanda:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al rechazar la demanda" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { admitirDemandaSchema } from "@/lib/validations/demanda";
import { EstadoProceso, TipoNotificacion, TipoResolucion } from "@prisma/client";
import crypto from "crypto";

/**
 * POST /api/demandas/[id]/admitir
 * Admitir demanda (solo JUEZ)
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
        { error: "Solo los jueces pueden admitir demandas" },
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
            clienteActor: true,
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

    // Verificar que el juez pertenece al juzgado del proceso
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (
      !profile ||
      profile.juzgadoId !== demanda.proceso.juzgadoId ||
      demanda.proceso.juezId !== profile.id
    ) {
      return NextResponse.json(
        { error: "No tiene permisos para admitir esta demanda" },
        { status: 403 }
      );
    }

    // Verificar estado del proceso
    if (demanda.proceso.estado !== EstadoProceso.PRESENTADO) {
      return NextResponse.json(
        { error: "La demanda no está en estado PRESENTADO" },
        { status: 400 }
      );
    }

    // Parsear datos
    const body = await req.json();
    const validatedData = admitirDemandaSchema.parse({
      ...body,
      demandaId: id,
    });

    // Generar NUREJ definitivo si no existe
    let nurejDefinitivo = validatedData.nurejDefinitivo || demanda.proceso.nurej;
    if (!nurejDefinitivo) {
      // Formato: JUZG-YEAR-SECUENCIA (ej: LA1CIV-2025-00123)
      const year = new Date().getFullYear();
      const count = await prisma.proceso.count({
        where: {
          juzgadoId: demanda.proceso.juzgadoId,
          nurej: { not: null },
        },
      });
      const secuencia = String(count + 1).padStart(5, "0");
      nurejDefinitivo = `${demanda.proceso.juzgado.nombre.replace(/\s/g, "")}-${year}-${secuencia}`;
    }

    // Generar hash del decreto
    const decretoHash = crypto
      .createHash("sha256")
      .update(validatedData.decretoAdmision)
      .digest("hex");

    // TODO: Generar PDF del decreto con firma digital
    const decretoUrl = `/storage/procesos/${nurejDefinitivo}/decretos/admision.pdf`;

    // Ejecutar transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar proceso
      const procesoActualizado = await tx.proceso.update({
        where: { id: demanda.procesoId },
        data: {
          estado: EstadoProceso.ADMITIDO,
          nurej: nurejDefinitivo,
        },
      });

      // Crear resolución (decreto de admisión)
      const resolucion = await tx.resolucion.create({
        data: {
          procesoId: demanda.procesoId,
          tipo: TipoResolucion.AUTO_INTERLOCUTORIO,
          titulo: "Decreto de Admisión de Demanda",
          porTanto: validatedData.decretoAdmision,
          documentoUrl: decretoUrl,
          documentoHash: decretoHash,
          firmadoPor: profile.id,
          fechaEmision: new Date(),
          fechaNotificacion: new Date(),
        },
      });

      // Crear notificación para el abogado actor
      await tx.notificacion.create({
        data: {
          usuarioId: demanda.proceso.abogadoActorId,
          procesoId: demanda.procesoId,
          tipo: TipoNotificacion.DEMANDA_ADMITIDA,
          titulo: "Demanda admitida",
          mensaje: `Su demanda en el proceso ${nurejDefinitivo} ha sido admitida`,
          accionUrl: `/dashboard/procesos/${demanda.procesoId}`,
          leida: false,
        },
      });

      return { proceso: procesoActualizado, resolucion };
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Demanda admitida exitosamente",
    });
  } catch (error) {
    console.error("Error al admitir demanda:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al admitir la demanda" },
      { status: 500 }
    );
  }
}

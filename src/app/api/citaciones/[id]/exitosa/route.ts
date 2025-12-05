import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { registrarCitacionExitosaSchema } from "@/lib/validations/citacion";
import { EstadoCitacion, TipoNotificacion, TipoCitacion } from "@prisma/client";

/**
 * PUT /api/citaciones/[id]/exitosa
 * Marcar citación como exitosa (solo JUEZ)
 */
export async function PUT(
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
        { error: "Solo los jueces pueden marcar citaciones como exitosas" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = registrarCitacionExitosaSchema.parse({
      ...body,
      citacionId: id,
    });

    // Verificar que la citación existe
    const citacion = await prisma.citacion.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            abogadoActor: true,
            juzgado: true,
          },
        },
      },
    });

    if (!citacion) {
      return NextResponse.json(
        { error: "Citación no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el juez pertenece al juzgado
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.juzgadoId !== citacion.proceso.juzgadoId) {
      return NextResponse.json(
        { error: "No tiene permisos para esta citación" },
        { status: 403 }
      );
    }

    // Verificar que la citación no esté ya exitosa
    if (citacion.estado === EstadoCitacion.EXITOSA) {
      return NextResponse.json(
        { error: "La citación ya está marcada como exitosa" },
        { status: 400 }
      );
    }

    // Calcular plazo según tipo de citación
    const fechaCitacion = new Date(validatedData.fechaCitacion);
    const plazoBase =
      citacion.tipoCitacion === TipoCitacion.EDICTO ? 20 : 30;

    // Calcular fecha de vencimiento (plazoBase días hábiles después)
    // TODO: Implementar cálculo de días hábiles excluyendo feriados
    const fechaVencimiento = new Date(fechaCitacion);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + plazoBase);

    // Actualizar citación
    const citacionActualizada = await prisma.citacion.update({
      where: { id },
      data: {
        estado: EstadoCitacion.EXITOSA,
        fechaCitacion: fechaCitacion,
        observaciones: validatedData.observaciones || null,
      },
    });

    // Crear plazo de contestación
    await prisma.plazo.create({
      data: {
        procesoId: citacion.procesoId,
        tipo: "CONTESTACION",
        fechaInicio: fechaCitacion,
        fechaVencimiento: fechaVencimiento,
        destinatario: citacion.proceso.abogadoActorId,
        estado: "ACTIVO",
        diasHabiles: plazoBase,
      },
    });

    // Notificar al abogado actor
    await prisma.notificacion.create({
      data: {
        usuarioId: citacion.proceso.abogadoActorId,
        procesoId: citacion.procesoId,
        tipo: TipoNotificacion.CITACION_EXITOSA,
        titulo: "Citación exitosa",
        mensaje: `La citación en el proceso ${citacion.proceso.nurej} ha sido exitosa. El demandado tiene ${plazoBase} días hábiles para contestar.`,
        accionUrl: `/dashboard/procesos/${citacion.procesoId}`,
        leida: false,
      },
    });

    return NextResponse.json({
      success: true,
      data: citacionActualizada,
      plazo: {
        fechaInicio: fechaCitacion,
        fechaVencimiento: fechaVencimiento,
        diasHabiles: plazoBase,
      },
      message: "Citación marcada como exitosa",
    });
  } catch (error) {
    console.error("Error al marcar citación como exitosa:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al marcar la citación como exitosa" },
      { status: 500 }
    );
  }
}

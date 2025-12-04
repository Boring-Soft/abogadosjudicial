import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateDemandaSchema } from "@/lib/validations/demanda";
import { EstadoProceso } from "@prisma/client";
import crypto from "crypto";

/**
 * GET /api/demandas/[id]
 * Obtener demanda específica por ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener perfil del usuario
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    const demanda = await prisma.demanda.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            juzgado: true,
            clienteActor: true,
            abogadoActor: true,
            juez: true,
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

    // Verificar permisos de acceso
    const hasAccess =
      demanda.proceso.abogadoActorId === profile.id ||
      demanda.proceso.abogadoDemandadoId === profile.id ||
      demanda.proceso.juezId === profile.id;

    if (!hasAccess) {
      return NextResponse.json(
        { error: "No tiene permisos para ver esta demanda" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: demanda });
  } catch (error) {
    console.error("Error al obtener demanda:", error);
    return NextResponse.json(
      { error: "Error al obtener la demanda" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/demandas/[id]
 * Actualizar/corregir demanda (solo ABOGADO y solo si está OBSERVADA)
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

    // Obtener demanda actual
    const demandaActual = await prisma.demanda.findUnique({
      where: { id },
      include: {
        proceso: true,
      },
    });

    if (!demandaActual) {
      return NextResponse.json(
        { error: "Demanda no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el abogado es el dueño
    if (demandaActual.proceso.abogadoActorId !== profile.id) {
      return NextResponse.json(
        { error: "No tiene permisos para actualizar esta demanda" },
        { status: 403 }
      );
    }

    // Verificar que el proceso está en estado OBSERVADO
    if (demandaActual.proceso.estado !== EstadoProceso.OBSERVADO) {
      return NextResponse.json(
        { error: "Solo se pueden corregir demandas observadas" },
        { status: 400 }
      );
    }

    // Parsear y validar datos
    const body = await req.json();
    const validatedData = updateDemandaSchema.parse({ ...body, id });

    // Preparar datos de actualización
    const updateData: any = {};

    if (validatedData.designacionJuez)
      updateData.designacionJuez = validatedData.designacionJuez;
    if (validatedData.objeto) updateData.objeto = validatedData.objeto;
    if (validatedData.hechos) updateData.hechos = validatedData.hechos;
    if (validatedData.derecho) updateData.derecho = validatedData.derecho;
    if (validatedData.petitorio) updateData.petitorio = validatedData.petitorio;
    if (validatedData.valorDemanda !== undefined)
      updateData.valorDemanda = validatedData.valorDemanda;
    if (validatedData.pruebaOfrecida)
      updateData.pruebaOfrecida = validatedData.pruebaOfrecida;

    // Incrementar versión
    updateData.version = demandaActual.version + 1;

    // Generar nuevo hash
    const contenido = JSON.stringify({
      designacionJuez:
        validatedData.designacionJuez || demandaActual.designacionJuez,
      objeto: validatedData.objeto || demandaActual.objeto,
      hechos: validatedData.hechos || demandaActual.hechos,
      derecho: validatedData.derecho || demandaActual.derecho,
      petitorio: validatedData.petitorio || demandaActual.petitorio,
      valorDemanda: validatedData.valorDemanda ?? demandaActual.valorDemanda,
      pruebaOfrecida:
        validatedData.pruebaOfrecida || demandaActual.pruebaOfrecida,
    });
    updateData.documentoHash = crypto
      .createHash("sha256")
      .update(contenido)
      .digest("hex");

    // TODO: Generar nuevo PDF
    updateData.documentoUrl = `/storage/procesos/${demandaActual.proceso.nurej}/demandas/demanda_v${updateData.version}.pdf`;

    // Limpiar observaciones
    updateData.observaciones = null;

    // Actualizar demanda
    const demandaActualizada = await prisma.$transaction(async (tx) => {
      const updated = await tx.demanda.update({
        where: { id },
        data: updateData,
      });

      // Cambiar estado del proceso de OBSERVADO a PRESENTADO
      await tx.proceso.update({
        where: { id: demandaActual.procesoId },
        data: { estado: EstadoProceso.PRESENTADO },
      });

      return updated;
    });

    // Notificar al juez
    if (demandaActual.proceso.juezId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: demandaActual.proceso.juezId,
          procesoId: demandaActual.procesoId,
          tipo: "DEMANDA_PRESENTADA" as any,
          titulo: "Demanda corregida y re-presentada",
          mensaje: `La demanda del proceso ${demandaActual.proceso.nurej} ha sido corregida`,
          accionUrl: `/dashboard/juez/demandas/${id}`,
          leida: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: demandaActualizada,
      message: "Demanda corregida exitosamente",
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

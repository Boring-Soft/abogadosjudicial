import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ordenarCitacionSchema } from "@/lib/validations/citacion";
import { EstadoCitacion, TipoNotificacion } from "@prisma/client";
import crypto from "crypto";

/**
 * POST /api/citaciones
 * Ordenar citación (solo JUEZ)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const hasPermission = await requireRole(user.id, ["JUEZ"]);
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Solo los jueces pueden ordenar citaciones" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = ordenarCitacionSchema.parse(body);

    // Verificar que el proceso existe y está admitido
    const proceso = await prisma.proceso.findUnique({
      where: { id: validatedData.procesoId },
      include: {
        juzgado: true,
        abogadoActor: true,
        demanda: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    if (proceso.estado !== "ADMITIDO") {
      return NextResponse.json(
        { error: "El proceso debe estar en estado ADMITIDO para ordenar citación" },
        { status: 400 }
      );
    }

    // Verificar que el juez pertenece al juzgado
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.juzgadoId !== proceso.juzgadoId) {
      return NextResponse.json(
        { error: "No tiene permisos para este proceso" },
        { status: 403 }
      );
    }

    // TODO: Generar cédula de citación PDF
    const cedulaUrl = `/storage/procesos/${proceso.nurej}/citaciones/cedula.pdf`;

    // Crear citación
    const citacion = await prisma.citacion.create({
      data: {
        procesoId: validatedData.procesoId,
        tipoCitacion: validatedData.tipoCitacion,
        estado: EstadoCitacion.PENDIENTE,
        cedulaUrl,
        intentos: [],
      },
    });

    // Actualizar estado del proceso a CITADO
    await prisma.proceso.update({
      where: { id: validatedData.procesoId },
      data: { estado: "CITADO" },
    });

    // Notificar al abogado actor
    await prisma.notificacion.create({
      data: {
        usuarioId: proceso.abogadoActorId,
        procesoId: proceso.id,
        tipo: TipoNotificacion.CITACION_EXITOSA,
        titulo: "Citación ordenada",
        mensaje: `Se ha ordenado citación ${validatedData.tipoCitacion} en el proceso ${proceso.nurej}`,
        accionUrl: `/dashboard/procesos/${proceso.id}`,
        leida: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: citacion,
        message: "Citación ordenada exitosamente",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al ordenar citación:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al ordenar la citación" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/citaciones?procesoId=xxx
 * Obtener citaciones de un proceso
 */
export async function GET(req: NextRequest) {
  try {
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

    const { searchParams } = new URL(req.url);
    const procesoId = searchParams.get("procesoId");

    if (!procesoId) {
      return NextResponse.json(
        { error: "procesoId es requerido" },
        { status: 400 }
      );
    }

    // Verificar acceso al proceso
    const proceso = await prisma.proceso.findFirst({
      where: {
        id: procesoId,
        OR: [
          { abogadoActorId: profile.id },
          { abogadoDemandadoId: profile.id },
          { juezId: profile.id },
        ],
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado o no autorizado" },
        { status: 404 }
      );
    }

    const citaciones = await prisma.citacion.findMany({
      where: { procesoId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: citaciones });
  } catch (error) {
    console.error("Error al obtener citaciones:", error);
    return NextResponse.json(
      { error: "Error al obtener las citaciones" },
      { status: 500 }
    );
  }
}

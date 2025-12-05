import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { programarAudienciaSchema } from "@/lib/validations/audiencia";
import { TipoNotificacion } from "@prisma/client";

/**
 * GET /api/audiencias?procesoId=xxx
 * Obtener audiencias de un proceso
 */
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const procesoId = searchParams.get("procesoId");

    if (!procesoId) {
      return NextResponse.json(
        { error: "procesoId es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario tenga acceso al proceso
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

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
        { error: "Proceso no encontrado o no tiene acceso" },
        { status: 404 }
      );
    }

    // Obtener audiencias del proceso
    const audiencias = await prisma.audiencia.findMany({
      where: { procesoId },
      orderBy: { fechaHora: "desc" },
    });

    return NextResponse.json({ success: true, data: audiencias });
  } catch (error) {
    console.error("Error al obtener audiencias:", error);
    return NextResponse.json(
      { error: "Error al obtener audiencias" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/audiencias
 * Programar nueva audiencia (solo JUEZ)
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación y rol
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const hasPermission = await requireRole(user.id, ["JUEZ"]);
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Solo los jueces pueden programar audiencias" },
        { status: 403 }
      );
    }

    // Obtener perfil del juez
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
    const validatedData = programarAudienciaSchema.parse(body);

    // Verificar que el proceso existe y está asignado al juez
    const proceso = await prisma.proceso.findFirst({
      where: {
        id: validatedData.procesoId,
        juezId: profile.id,
      },
      include: {
        abogadoActor: true,
        abogadoDemandado: true,
        clienteActor: true,
        clienteDemandado: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado o no está asignado a este juez" },
        { status: 404 }
      );
    }

    // Verificar que el proceso esté en estado CITADO, CONTESTADO o ADMITIDO
    const estadosPermitidos = ["CITADO", "CONTESTADO", "ADMITIDO"];
    if (!estadosPermitidos.includes(proceso.estado)) {
      return NextResponse.json(
        {
          error: `Solo se pueden programar audiencias para procesos en estado CITADO, CONTESTADO o ADMITIDO. Estado actual: ${proceso.estado}`,
        },
        { status: 400 }
      );
    }

    // Crear asistentes por defecto si no se proporcionaron
    const asistentesDefault = validatedData.asistentes || [
      {
        nombre: `${proceso.clienteActor.nombres} ${proceso.clienteActor.apellidos}`,
        rol: "ACTOR" as const,
        obligatorio: true,
      },
      {
        nombre: proceso.clienteDemandado
          ? `${proceso.clienteDemandado.nombres} ${proceso.clienteDemandado.apellidos}`
          : `${proceso.demandadoNombres} ${proceso.demandadoApellidos}`,
        rol: "DEMANDADO" as const,
        obligatorio: true,
      },
      {
        nombre: `${proceso.abogadoActor.firstName} ${proceso.abogadoActor.lastName}`,
        rol: "ABOGADO_ACTOR" as const,
        obligatorio: true,
      },
    ];

    if (proceso.abogadoDemandado) {
      asistentesDefault.push({
        nombre: `${proceso.abogadoDemandado.firstName} ${proceso.abogadoDemandado.lastName}`,
        rol: "ABOGADO_DEMANDADO" as const,
        obligatorio: true,
      });
    }

    // Generar URL temporal para auto de convocatoria (se generará PDF posteriormente)
    const autoConvocatoriaUrl = `/storage/procesos/${proceso.nurej}/audiencias/auto_convocatoria_${validatedData.tipo.toLowerCase()}.pdf`;

    // Crear audiencia
    const audiencia = await prisma.audiencia.create({
      data: {
        procesoId: validatedData.procesoId,
        tipo: validatedData.tipo,
        modalidad: validatedData.modalidad,
        fechaHora: new Date(validatedData.fechaHora),
        linkGoogleMeet: validatedData.linkGoogleMeet || null,
        autoConvocatoriaUrl,
        asistentes: asistentesDefault,
        estado: "PROGRAMADA",
      },
    });

    // Actualizar estado del proceso si es audiencia preliminar
    if (validatedData.tipo === "PRELIMINAR") {
      await prisma.proceso.update({
        where: { id: validatedData.procesoId },
        data: { estado: "AUDIENCIA_PRELIMINAR" },
      });
    }

    // Notificar a ABOGADO ACTOR
    await prisma.notificacion.create({
      data: {
        usuarioId: proceso.abogadoActorId,
        procesoId: validatedData.procesoId,
        tipo: TipoNotificacion.AUDIENCIA_CONVOCADA,
        titulo: `Audiencia ${validatedData.tipo.toLowerCase()} programada`,
        mensaje: `Se ha programado una audiencia ${validatedData.tipo.toLowerCase()} para el proceso ${
          proceso.nurej || proceso.id
        }. Fecha: ${new Date(validatedData.fechaHora).toLocaleString("es-BO")}. ${
          validatedData.modalidad === "VIRTUAL" && validatedData.linkGoogleMeet
            ? `Link de Google Meet: ${validatedData.linkGoogleMeet}`
            : ""
        }`,
        accionUrl: `/dashboard/procesos/${validatedData.procesoId}/audiencias/${audiencia.id}`,
        leida: false,
      },
    });

    // Notificar a ABOGADO DEMANDADO si existe
    if (proceso.abogadoDemandadoId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: proceso.abogadoDemandadoId,
          procesoId: validatedData.procesoId,
          tipo: TipoNotificacion.AUDIENCIA_CONVOCADA,
          titulo: `Audiencia ${validatedData.tipo.toLowerCase()} programada`,
          mensaje: `Se ha programado una audiencia ${validatedData.tipo.toLowerCase()} para el proceso ${
            proceso.nurej || proceso.id
          }. Fecha: ${new Date(validatedData.fechaHora).toLocaleString("es-BO")}. ${
            validatedData.modalidad === "VIRTUAL" && validatedData.linkGoogleMeet
              ? `Link de Google Meet: ${validatedData.linkGoogleMeet}`
              : ""
          }`,
          accionUrl: `/dashboard/procesos/${validatedData.procesoId}/audiencias/${audiencia.id}`,
          leida: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: audiencia,
      message: "Audiencia programada exitosamente",
    });
  } catch (error) {
    console.error("Error al programar audiencia:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al programar la audiencia" },
      { status: 500 }
    );
  }
}

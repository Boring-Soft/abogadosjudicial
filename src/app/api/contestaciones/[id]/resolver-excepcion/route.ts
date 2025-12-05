import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resolverExcepcionSchema } from "@/lib/validations/contestacion";
import { TipoNotificacion, EstadoProceso } from "@prisma/client";

/**
 * PUT /api/contestaciones/[id]/resolver-excepcion
 * Resolver excepción previa (solo JUEZ)
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
        { error: "Solo los jueces pueden resolver excepciones" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = resolverExcepcionSchema.parse({
      ...body,
      contestacionId: id,
    });

    // Verificar que la contestación existe y tiene excepciones
    const contestacion = await prisma.contestacion.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            abogadoActor: true,
            abogadoDemandado: true,
            juzgado: true,
          },
        },
      },
    });

    if (!contestacion) {
      return NextResponse.json(
        { error: "Contestación no encontrada" },
        { status: 404 }
      );
    }

    if (!contestacion.tieneExcepciones) {
      return NextResponse.json(
        { error: "Esta contestación no tiene excepciones previas" },
        { status: 400 }
      );
    }

    // Verificar que el juez pertenece al juzgado
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.juzgadoId !== contestacion.proceso.juzgadoId) {
      return NextResponse.json(
        { error: "No tiene permisos para resolver esta excepción" },
        { status: 403 }
      );
    }

    // Crear resolución (auto de excepción)
    const resolucion = await prisma.resolucion.create({
      data: {
        procesoId: contestacion.procesoId,
        tipo: "AUTO_INTERLOCUTORIO",
        titulo:
          validatedData.decision === "FUNDAR"
            ? "Auto que Funda Excepción Previa"
            : "Auto que Rechaza Excepción Previa",
        considerando: validatedData.fundamentacion,
        porTanto:
          validatedData.decision === "FUNDAR"
            ? `Se FUNDA la excepción previa de ${contestacion.tipoExcepcion}. ${
                validatedData.conCostas ? "Con costas." : "Sin costas."
              }`
            : `Se RECHAZA la excepción previa de ${contestacion.tipoExcepcion}. ${
                validatedData.conCostas ? "Con costas." : "Sin costas."
              }`,
        documentoUrl: `/resoluciones/auto_excepcion_${contestacion.procesoId}.pdf`,
        documentoHash: "",
        firmadoPor: profile.id,
        fechaEmision: new Date(),
      },
    });

    // Si se funda la excepción, el proceso termina (o se suspende según tipo)
    if (validatedData.decision === "FUNDAR") {
      // Determinar qué hacer según tipo de excepción
      const tiposQueTerminanProceso = [
        "INCOMPETENCIA",
        "COSA_JUZGADA",
        "TRANSACCION",
        "CONCILIACION",
        "DESISTIMIENTO",
        "PRESCRIPCION",
      ];

      if (
        contestacion.tipoExcepcion &&
        tiposQueTerminanProceso.includes(contestacion.tipoExcepcion)
      ) {
        // Terminar el proceso
        await prisma.proceso.update({
          where: { id: contestacion.procesoId },
          data: { estado: EstadoProceso.ARCHIVADO },
        });
      } else {
        // Para otros tipos (ej: demanda defectuosa), dar plazo para subsanar
        // Por ahora, simplemente mantener el estado
      }
    } else {
      // Si se rechaza la excepción, continuar normalmente
      // El proceso ya está en CONTESTADO, se debe programar audiencia preliminar
    }

    // Notificar al ABOGADO ACTOR
    await prisma.notificacion.create({
      data: {
        usuarioId: contestacion.proceso.abogadoActorId,
        procesoId: contestacion.procesoId,
        tipo: TipoNotificacion.RESOLUCION_EMITIDA,
        titulo: `Excepción previa ${
          validatedData.decision === "FUNDAR" ? "fundada" : "rechazada"
        }`,
        mensaje: `El juez ha emitido auto ${
          validatedData.decision === "FUNDAR" ? "fundando" : "rechazando"
        } la excepción previa en el proceso ${contestacion.proceso.nurej}.`,
        accionUrl: `/dashboard/procesos/${contestacion.procesoId}/resoluciones/${resolucion.id}`,
        leida: false,
      },
    });

    // Notificar al ABOGADO DEMANDADO
    if (contestacion.proceso.abogadoDemandadoId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: contestacion.proceso.abogadoDemandadoId,
          procesoId: contestacion.procesoId,
          tipo: TipoNotificacion.RESOLUCION_EMITIDA,
          titulo: `Excepción previa ${
            validatedData.decision === "FUNDAR" ? "fundada" : "rechazada"
          }`,
          mensaje: `El juez ha emitido auto ${
            validatedData.decision === "FUNDAR" ? "fundando" : "rechazando"
          } su excepción previa en el proceso ${contestacion.proceso.nurej}.`,
          accionUrl: `/dashboard/procesos/${contestacion.procesoId}/resoluciones/${resolucion.id}`,
          leida: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        resolucion,
        decision: validatedData.decision,
      },
      message: `Excepción ${
        validatedData.decision === "FUNDAR" ? "fundada" : "rechazada"
      } exitosamente`,
    });
  } catch (error) {
    console.error("Error al resolver excepción:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al resolver la excepción" },
      { status: 500 }
    );
  }
}

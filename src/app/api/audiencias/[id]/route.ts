import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { iniciarAudienciaSchema, cerrarAudienciaSchema } from "@/lib/validations/audiencia";
import { TipoNotificacion } from "@prisma/client";
import crypto from "crypto";

/**
 * GET /api/audiencias/[id]
 * Obtener detalle de una audiencia
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

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Obtener audiencia con proceso
    const audiencia = await prisma.audiencia.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            abogadoActor: true,
            abogadoDemandado: true,
            clienteActor: true,
            clienteDemandado: true,
            juez: true,
            juzgado: true,
          },
        },
      },
    });

    if (!audiencia) {
      return NextResponse.json(
        { error: "Audiencia no encontrada" },
        { status: 404 }
      );
    }

    // Verificar acceso
    const tieneAcceso =
      audiencia.proceso.juezId === profile.id ||
      audiencia.proceso.abogadoActorId === profile.id ||
      audiencia.proceso.abogadoDemandadoId === profile.id;

    if (!tieneAcceso) {
      return NextResponse.json(
        { error: "No tiene acceso a esta audiencia" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: audiencia });
  } catch (error) {
    console.error("Error al obtener audiencia:", error);
    return NextResponse.json(
      { error: "Error al obtener audiencia" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/audiencias/[id]
 * Actualizar audiencia (iniciar, cerrar, etc.)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar autenticación
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

    const body = await req.json();
    const { accion } = body;

    // Obtener audiencia
    const audiencia = await prisma.audiencia.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            abogadoActor: true,
            abogadoDemandado: true,
          },
        },
      },
    });

    if (!audiencia) {
      return NextResponse.json(
        { error: "Audiencia no encontrada" },
        { status: 404 }
      );
    }

    // Solo el juez puede realizar acciones sobre la audiencia
    const hasPermission = await requireRole(user.id, ["JUEZ"]);
    if (!hasPermission || audiencia.proceso.juezId !== profile.id) {
      return NextResponse.json(
        { error: "Solo el juez asignado puede modificar la audiencia" },
        { status: 403 }
      );
    }

    // Manejar diferentes acciones
    if (accion === "iniciar") {
      // Validar datos de inicio
      const validatedData = iniciarAudienciaSchema.parse(body);

      const audienciaActualizada = await prisma.audiencia.update({
        where: { id },
        data: {
          estado: "REALIZADA",
          fechaInicio: new Date(),
          asistentes: validatedData.asistentes,
        },
      });

      return NextResponse.json({
        success: true,
        data: audienciaActualizada,
        message: "Audiencia iniciada exitosamente",
      });
    }

    if (accion === "cerrar") {
      // Validar datos de cierre
      const validatedData = cerrarAudienciaSchema.parse(body);

      // Generar hash del contenido del acta (se generará PDF posteriormente)
      const contenidoActa = JSON.stringify({
        huboConciliacion: validatedData.huboConciliacion,
        acuerdoConciliacion: validatedData.acuerdoConciliacion,
        objetoProceso: validatedData.objetoProceso,
        pruebasAdmitidas: validatedData.pruebasAdmitidas,
      });
      const hash = crypto.createHash("sha256").update(contenidoActa).digest("hex");

      const actaUrl = `/storage/procesos/${audiencia.proceso.nurej}/audiencias/acta_${audiencia.tipo.toLowerCase()}_${Date.now()}.pdf`;

      // Determinar nuevo estado del proceso
      let nuevoEstado = audiencia.proceso.estado;
      if (validatedData.huboConciliacion) {
        nuevoEstado = "CONCILIADO";
      } else if (validatedData.audienciaComplementaria) {
        nuevoEstado = "AUDIENCIA_COMPLEMENTARIA";
      } else if (audiencia.tipo === "COMPLEMENTARIA") {
        nuevoEstado = "PARA_SENTENCIA";
      }

      // Actualizar audiencia en transacción
      const audienciaActualizada = await prisma.$transaction(async (tx) => {
        // Actualizar audiencia
        const aud = await tx.audiencia.update({
          where: { id },
          data: {
            fechaCierre: new Date(),
            huboConciliacion: validatedData.huboConciliacion,
            acuerdoConciliacion: validatedData.acuerdoConciliacion || null,
            objetoProceso: validatedData.objetoProceso || null,
            pruebasAdmitidas: validatedData.pruebasAdmitidas || undefined,
            actaUrl,
            actaHash: hash,
          },
        });

        // Actualizar estado del proceso
        await tx.proceso.update({
          where: { id: audiencia.procesoId },
          data: { estado: nuevoEstado },
        });

        // Si hay audiencia complementaria programada, crearla
        if (validatedData.audienciaComplementaria) {
          await tx.audiencia.create({
            data: {
              procesoId: audiencia.procesoId,
              tipo: "COMPLEMENTARIA",
              modalidad: audiencia.modalidad,
              fechaHora: new Date(validatedData.audienciaComplementaria.fechaHora),
              linkGoogleMeet: validatedData.audienciaComplementaria.linkGoogleMeet || null,
              estado: "PROGRAMADA",
            },
          });
        }

        // Si cambió a PARA_SENTENCIA, crear plazo de 20 días para sentencia
        if (nuevoEstado === "PARA_SENTENCIA") {
          const fechaInicio = new Date();
          const fechaVencimiento = new Date();
          fechaVencimiento.setDate(fechaVencimiento.getDate() + 20);

          await tx.plazo.create({
            data: {
              procesoId: audiencia.procesoId,
              tipo: "SENTENCIA",
              fechaInicio,
              fechaVencimiento,
              diasHabiles: 20,
              destinatario: audiencia.proceso.juezId!,
              estado: "ACTIVO",
            },
          });
        }

        return aud;
      });

      // Notificar a ABOGADO ACTOR
      await prisma.notificacion.create({
        data: {
          usuarioId: audiencia.proceso.abogadoActorId,
          procesoId: audiencia.procesoId,
          tipo: TipoNotificacion.DOCUMENTO_SUBIDO,
          titulo: `Acta de audiencia ${audiencia.tipo.toLowerCase()} disponible`,
          mensaje: `Se ha generado el acta de la audiencia ${audiencia.tipo.toLowerCase()} del proceso ${
            audiencia.proceso.nurej || audiencia.procesoId
          }. ${
            validatedData.huboConciliacion
              ? "El proceso terminó por conciliación."
              : nuevoEstado === "PARA_SENTENCIA"
              ? "El proceso está para sentencia."
              : ""
          }`,
          accionUrl: `/dashboard/procesos/${audiencia.procesoId}/audiencias/${audiencia.id}`,
          leida: false,
        },
      });

      // Notificar a ABOGADO DEMANDADO si existe
      if (audiencia.proceso.abogadoDemandadoId) {
        await prisma.notificacion.create({
          data: {
            usuarioId: audiencia.proceso.abogadoDemandadoId,
            procesoId: audiencia.procesoId,
            tipo: TipoNotificacion.DOCUMENTO_SUBIDO,
            titulo: `Acta de audiencia ${audiencia.tipo.toLowerCase()} disponible`,
            mensaje: `Se ha generado el acta de la audiencia ${audiencia.tipo.toLowerCase()} del proceso ${
              audiencia.proceso.nurej || audiencia.procesoId
            }. ${
              validatedData.huboConciliacion
                ? "El proceso terminó por conciliación."
                : nuevoEstado === "PARA_SENTENCIA"
                ? "El proceso está para sentencia."
                : ""
            }`,
            accionUrl: `/dashboard/procesos/${audiencia.procesoId}/audiencias/${audiencia.id}`,
            leida: false,
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: audienciaActualizada,
        message: "Audiencia cerrada exitosamente",
      });
    }

    if (accion === "suspender") {
      const { motivo } = body;

      const audienciaActualizada = await prisma.audiencia.update({
        where: { id },
        data: {
          estado: "SUSPENDIDA",
        },
      });

      // Notificar a ambos abogados
      await prisma.notificacion.create({
        data: {
          usuarioId: audiencia.proceso.abogadoActorId,
          procesoId: audiencia.procesoId,
          tipo: TipoNotificacion.AUDIENCIA_CONVOCADA,
          titulo: `Audiencia ${audiencia.tipo.toLowerCase()} suspendida`,
          mensaje: `La audiencia programada para el ${new Date(
            audiencia.fechaHora
          ).toLocaleString("es-BO")} ha sido suspendida. Motivo: ${motivo || "No especificado"}`,
          accionUrl: `/dashboard/procesos/${audiencia.procesoId}`,
          leida: false,
        },
      });

      if (audiencia.proceso.abogadoDemandadoId) {
        await prisma.notificacion.create({
          data: {
            usuarioId: audiencia.proceso.abogadoDemandadoId,
            procesoId: audiencia.procesoId,
            tipo: TipoNotificacion.AUDIENCIA_CONVOCADA,
            titulo: `Audiencia ${audiencia.tipo.toLowerCase()} suspendida`,
            mensaje: `La audiencia programada para el ${new Date(
              audiencia.fechaHora
            ).toLocaleString("es-BO")} ha sido suspendida. Motivo: ${motivo || "No especificado"}`,
            accionUrl: `/dashboard/procesos/${audiencia.procesoId}`,
            leida: false,
          },
        });
      }

      return NextResponse.json({
        success: true,
        data: audienciaActualizada,
        message: "Audiencia suspendida exitosamente",
      });
    }

    return NextResponse.json(
      { error: "Acción no válida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error al actualizar audiencia:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al actualizar la audiencia" },
      { status: 500 }
    );
  }
}

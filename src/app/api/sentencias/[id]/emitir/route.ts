/**
 * API Route para Emitir Sentencia Final
 * PUT /api/sentencias/[id]/emitir
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createSentenciaSchema,
  validateSentenciaCompleta,
} from "@/lib/validations/sentencia";
import { generateSHA256Hash } from "@/lib/utils";
import { UserRole, TipoNotificacion, EstadoProceso, TipoPlazo, EstadoPlazo } from "@prisma/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PUT /api/sentencias/[id]/emitir
 * Emitir sentencia final (firmar y notificar)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Solo JUEZ puede emitir sentencias
    if (!hasRole(profile.role, UserRole.JUEZ)) {
      return NextResponse.json(
        { error: "Solo los jueces pueden emitir sentencias" },
        { status: 403 }
      );
    }

    // Validar datos completos
    const validatedData = createSentenciaSchema.parse(body);

    // Validar estructura completa
    const validation = validateSentenciaCompleta({
      resumenDemanda: validatedData.resumenDemanda,
      resumenContestacion: validatedData.resumenContestacion,
      tramitesProceso: validatedData.tramitesProceso,
      pruebasPresentadas: validatedData.pruebasPresentadas,
      analisisPruebas: validatedData.analisisPruebas,
      valoracionPruebas: validatedData.valoracionPruebas,
      aplicacionDerecho: validatedData.aplicacionDerecho,
      razonamientoJuridico: validatedData.razonamientoJuridico,
      decision: validatedData.decision,
      costas: validatedData.costas,
    });

    if (!validation.valid) {
      return NextResponse.json(
        { error: "Sentencia incompleta", details: validation.errors },
        { status: 400 }
      );
    }

    // Obtener sentencia existente
    const sentencia = await prisma.sentencia.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
            juzgado: true,
            clienteActor: true,
            abogadoActor: true,
            abogadoDemandado: true,
            demanda: true,
          },
        },
      },
    });

    if (!sentencia) {
      return NextResponse.json(
        { error: "Sentencia no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que no haya sido emitida
    if (sentencia.fechaNotificacion) {
      return NextResponse.json(
        {
          error:
            "Esta sentencia ya fue emitida y notificada. No se puede modificar.",
        },
        { status: 400 }
      );
    }

    // Generar contenido completo para hash
    const contenidoCompleto = `
SENTENCIA
NUREJ: ${sentencia.proceso.nurej}

ENCABEZAMIENTO
Juzgado: ${sentencia.proceso.juzgado.nombre}
Actor: ${sentencia.proceso.clienteActor.nombres} ${sentencia.proceso.clienteActor.apellidos} (CI: ${sentencia.proceso.clienteActor.ci})
Abogado Actor: ${sentencia.proceso.abogadoActor.firstName} ${sentencia.proceso.abogadoActor.lastName}
Demandado: ${sentencia.proceso.demandadoNombres} ${sentencia.proceso.demandadoApellidos}
Objeto: ${sentencia.proceso.demanda?.objeto || ""}
Fecha: ${new Date().toLocaleDateString("es-BO")}

NARRATIVA (RESULTANDOS)
Resumen de Demanda: ${validatedData.resumenDemanda}
Resumen de Contestación: ${validatedData.resumenContestacion}
Trámites del Proceso: ${validatedData.tramitesProceso}
Pruebas Presentadas: ${validatedData.pruebasPresentadas}

CONSIDERANDOS
Análisis de Pruebas: ${validatedData.analisisPruebas}
Valoración de Pruebas: ${validatedData.valoracionPruebas}
Aplicación del Derecho: ${validatedData.aplicacionDerecho}
Razonamiento Jurídico: ${validatedData.razonamientoJuridico}
${validatedData.jurisprudencia ? `Jurisprudencia: ${validatedData.jurisprudencia}` : ""}

POR TANTO
Decisión: ${validatedData.decision}
${validatedData.condena ? `Condena: ${validatedData.condena}` : ""}
Costas: ${validatedData.costas}

CIERRE
Regístrese, notifíquese y cúmplase.
Fecha: ${new Date().toLocaleDateString("es-BO")}
Lugar: ${sentencia.proceso.juzgado.ciudad}, ${sentencia.proceso.juzgado.departamento}

Firmado por: ${profile.firstName} ${profile.lastName}
Juez del ${sentencia.proceso.juzgado.nombre}
    `.trim();

    // Generar hash SHA-256
    const documentoHash = await generateSHA256Hash(contenidoCompleto);

    // TODO: Generar PDF
    const documentoUrl = `/sentencias/${sentencia.proceso.nurej}-${Date.now()}.pdf`;

    const fechaEmision = new Date();
    const fechaNotificacion = new Date();

    // Calcular fecha de vencimiento para apelación (15 días hábiles)
    // TODO: Implementar cálculo de días hábiles excluyendo fines de semana y feriados
    const diasApelacion = 15;
    const fechaVencimientoApelacion = new Date();
    fechaVencimientoApelacion.setDate(
      fechaVencimientoApelacion.getDate() + diasApelacion
    );

    // Actualizar sentencia con datos finales
    const sentenciaEmitida = await prisma.sentencia.update({
      where: { id },
      data: {
        resumenDemanda: validatedData.resumenDemanda,
        resumenContestacion: validatedData.resumenContestacion,
        tramitesProceso: validatedData.tramitesProceso,
        pruebasPresentadas: validatedData.pruebasPresentadas,
        analisisPruebas: validatedData.analisisPruebas,
        valoracionPruebas: validatedData.valoracionPruebas,
        aplicacionDerecho: validatedData.aplicacionDerecho,
        razonamientoJuridico: validatedData.razonamientoJuridico,
        jurisprudencia: validatedData.jurisprudencia || null,
        decision: validatedData.decision,
        condena: validatedData.condena || null,
        costas: validatedData.costas,
        documentoUrl,
        documentoHash,
        firmadoPor: profile.id,
        fechaEmision,
        fechaNotificacion,
      },
    });

    // Actualizar estado del proceso a SENTENCIADO
    await prisma.proceso.update({
      where: { id: sentencia.procesoId },
      data: {
        estado: EstadoProceso.SENTENCIADO,
      },
    });

    // Crear plazo de apelación (15 días)
    await prisma.plazo.create({
      data: {
        procesoId: sentencia.procesoId,
        tipo: TipoPlazo.APELACION,
        estado: EstadoPlazo.ACTIVO,
        fechaInicio: fechaNotificacion,
        fechaVencimiento: fechaVencimientoApelacion,
        diasHabiles: diasApelacion,
        destinatario: "AMBAS_PARTES",
        alertasEnviadas: {},
      },
    });

    // Crear notificaciones para ambos abogados
    const notificaciones = [];

    if (sentencia.proceso.abogadoActorId) {
      notificaciones.push({
        usuarioId: sentencia.proceso.abogadoActorId,
        procesoId: sentencia.proceso.id,
        tipo: TipoNotificacion.SENTENCIA_EMITIDA,
        titulo: `Sentencia Emitida - ${sentencia.proceso.nurej}`,
        mensaje: `Se ha emitido sentencia en el proceso ${sentencia.proceso.nurej}. Decisión: ${validatedData.decision}. Tiene 15 días hábiles para apelar.`,
        accionUrl: `/dashboard/procesos/${sentencia.proceso.id}?tab=sentencia`,
        leida: false,
      });
    }

    if (sentencia.proceso.abogadoDemandadoId) {
      notificaciones.push({
        usuarioId: sentencia.proceso.abogadoDemandadoId,
        procesoId: sentencia.proceso.id,
        tipo: TipoNotificacion.SENTENCIA_EMITIDA,
        titulo: `Sentencia Emitida - ${sentencia.proceso.nurej}`,
        mensaje: `Se ha emitido sentencia en el proceso ${sentencia.proceso.nurej}. Decisión: ${validatedData.decision}. Tiene 15 días hábiles para apelar.`,
        accionUrl: `/dashboard/procesos/${sentencia.proceso.id}?tab=sentencia`,
        leida: false,
      });
    }

    if (notificaciones.length > 0) {
      await prisma.notificacion.createMany({
        data: notificaciones,
      });
    }

    return NextResponse.json({
      success: true,
      data: sentenciaEmitida,
      message: "Sentencia emitida y notificada exitosamente",
    });
  } catch (error: any) {
    console.error("Error al emitir sentencia:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de sentencia inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al emitir sentencia" },
      { status: 500 }
    );
  }
}

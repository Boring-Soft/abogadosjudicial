/**
 * API Routes para Sentencias
 * Endpoints: GET (obtener sentencia de proceso), POST (crear/guardar borrador), PUT (emitir sentencia)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createSentenciaSchema,
  saveBorradorSentenciaSchema,
  validateSentenciaCompleta,
} from "@/lib/validations/sentencia";
import { generateSHA256Hash } from "@/lib/utils";
import { UserRole, TipoNotificacion, EstadoProceso } from "@prisma/client";

/**
 * GET /api/sentencias?procesoId=xxx
 * Obtener sentencia de un proceso
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const procesoId = searchParams.get("procesoId");

    if (!procesoId) {
      return NextResponse.json(
        { error: "procesoId es requerido" },
        { status: 400 }
      );
    }

    // Verificar acceso al proceso
    const proceso = await prisma.proceso.findUnique({
      where: { id: procesoId },
      select: {
        id: true,
        juzgadoId: true,
        abogadoActorId: true,
        abogadoDemandadoId: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
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

    // Control de acceso
    const isJuez = hasRole(profile.role, UserRole.JUEZ);
    const isAbogadoActor = profile.id === proceso.abogadoActorId;
    const isAbogadoDemandado = profile.id === proceso.abogadoDemandadoId;

    if (!isJuez && !isAbogadoActor && !isAbogadoDemandado) {
      return NextResponse.json(
        { error: "No tienes acceso a este proceso" },
        { status: 403 }
      );
    }

    // Obtener sentencia
    const sentencia = await prisma.sentencia.findUnique({
      where: { procesoId },
    });

    return NextResponse.json({
      success: true,
      data: sentencia,
    });
  } catch (error) {
    console.error("Error al obtener sentencia:", error);
    return NextResponse.json(
      { error: "Error al obtener sentencia" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sentencias
 * Guardar borrador de sentencia (solo JUEZ)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
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

    // Solo JUEZ puede crear/guardar sentencias
    if (!hasRole(profile.role, UserRole.JUEZ)) {
      return NextResponse.json(
        { error: "Solo los jueces pueden crear sentencias" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar con schema de borrador (campos opcionales)
    const validatedData = saveBorradorSentenciaSchema.parse(body);

    // Verificar que el proceso existe y está en estado PARA_SENTENCIA
    const proceso = await prisma.proceso.findUnique({
      where: { id: validatedData.procesoId },
      include: {
        juzgado: true,
        abogadoActor: true,
        abogadoDemandado: true,
        clienteActor: true,
        demanda: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    if (profile.juzgadoId !== proceso.juzgadoId) {
      return NextResponse.json(
        { error: "Este proceso no pertenece a tu juzgado" },
        { status: 403 }
      );
    }

    if (proceso.estado !== EstadoProceso.PARA_SENTENCIA) {
      return NextResponse.json(
        {
          error: `El proceso debe estar en estado PARA_SENTENCIA para emitir sentencia. Estado actual: ${proceso.estado}`,
        },
        { status: 400 }
      );
    }

    // Verificar si ya existe una sentencia (actualizar borrador)
    const sentenciaExistente = await prisma.sentencia.findUnique({
      where: { procesoId: validatedData.procesoId },
    });

    if (sentenciaExistente && sentenciaExistente.fechaNotificacion) {
      return NextResponse.json(
        {
          error:
            "Esta sentencia ya fue emitida y notificada. No se puede modificar.",
        },
        { status: 400 }
      );
    }

    // Preparar datos del borrador
    const borradorData = {
      resumenDemanda: validatedData.resumenDemanda || "",
      resumenContestacion: validatedData.resumenContestacion || "",
      tramitesProceso: validatedData.tramitesProceso || "",
      pruebasPresentadas: validatedData.pruebasPresentadas || "",
      analisisPruebas: validatedData.analisisPruebas || "",
      valoracionPruebas: validatedData.valoracionPruebas || "",
      aplicacionDerecho: validatedData.aplicacionDerecho || "",
      razonamientoJuridico: validatedData.razonamientoJuridico || "",
      jurisprudencia: validatedData.jurisprudencia || null,
      decision: validatedData.decision || "ADMITE",
      condena: validatedData.condena || null,
      costas: validatedData.costas || "",
      documentoUrl: "/borradores/sentencia-temporal.pdf",
      documentoHash: "borrador",
      firmadoPor: profile.id,
      fechaEmision: new Date(),
    };

    let sentencia;

    if (sentenciaExistente) {
      // Actualizar borrador existente
      sentencia = await prisma.sentencia.update({
        where: { id: sentenciaExistente.id },
        data: borradorData,
      });
    } else {
      // Crear nuevo borrador
      sentencia = await prisma.sentencia.create({
        data: {
          ...borradorData,
          procesoId: validatedData.procesoId,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: sentencia,
      message: "Borrador guardado exitosamente",
    });
  } catch (error: any) {
    console.error("Error al guardar borrador:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de sentencia inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al guardar borrador" },
      { status: 500 }
    );
  }
}

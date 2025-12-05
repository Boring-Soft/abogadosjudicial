/**
 * API Routes para Resoluciones
 * Endpoints: GET (listar), POST (crear)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createResolucionSchema,
  validateResolucionByType,
} from "@/lib/validations/resolucion";
import { generateSHA256Hash } from "@/lib/utils";
import { UserRole, TipoNotificacion } from "@prisma/client";

/**
 * GET /api/resoluciones
 * Listar resoluciones con filtros
 * Query params: procesoId (required), tipo (optional), limit (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const procesoId = searchParams.get("procesoId");
    const tipo = searchParams.get("tipo");
    const limit = searchParams.get("limit");

    if (!procesoId) {
      return NextResponse.json(
        { error: "procesoId es requerido" },
        { status: 400 }
      );
    }

    // Verificar que el usuario tiene acceso al proceso
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

    // Control de acceso por rol
    const isJuez = hasRole(profile.role, UserRole.JUEZ);
    const isAbogadoActor = profile.id === proceso.abogadoActorId;
    const isAbogadoDemandado = profile.id === proceso.abogadoDemandadoId;

    if (!isJuez && !isAbogadoActor && !isAbogadoDemandado) {
      return NextResponse.json(
        { error: "No tienes acceso a este proceso" },
        { status: 403 }
      );
    }

    // Construir filtros
    const where: any = {
      procesoId,
    };

    if (tipo) {
      where.tipo = tipo;
    }

    // Obtener resoluciones
    const resoluciones = await prisma.resolucion.findMany({
      where,
      orderBy: {
        fechaEmision: "desc",
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json({
      success: true,
      data: resoluciones,
    });
  } catch (error) {
    console.error("Error al obtener resoluciones:", error);
    return NextResponse.json(
      { error: "Error al obtener resoluciones" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/resoluciones
 * Crear nueva resolución (solo JUEZ)
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

    // Solo JUEZ puede crear resoluciones
    if (!hasRole(profile.role, UserRole.JUEZ)) {
      return NextResponse.json(
        { error: "Solo los jueces pueden crear resoluciones" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar con Zod
    const validatedData = createResolucionSchema.parse(body);

    // Verificar que el proceso existe y pertenece al juzgado del juez
    const proceso = await prisma.proceso.findUnique({
      where: { id: validatedData.procesoId },
      include: {
        juzgado: true,
        abogadoActor: true,
        abogadoDemandado: true,
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

    // Validar estructura según tipo de resolución
    try {
      validateResolucionByType(validatedData.tipo, {
        vistos: validatedData.vistos,
        considerando: validatedData.considerando,
        porTanto: validatedData.porTanto,
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generar contenido completo para hash
    const contenidoCompleto = `
RESOLUCIÓN
Tipo: ${validatedData.tipo}
Título: ${validatedData.titulo}
Proceso: ${proceso.nurej}

${validatedData.vistos ? `VISTOS:\n${validatedData.vistos}\n\n` : ""}
${validatedData.considerando ? `CONSIDERANDO:\n${validatedData.considerando}\n\n` : ""}
POR TANTO:\n${validatedData.porTanto}

Emitido por: ${profile.firstName} ${profile.lastName}
Fecha: ${new Date().toISOString()}
    `.trim();

    // Generar hash SHA-256
    const documentoHash = await generateSHA256Hash(contenidoCompleto);

    // TODO: Generar PDF y subirlo a Supabase Storage
    // Por ahora usamos un placeholder
    const documentoUrl = `/resoluciones/${proceso.nurej}-${Date.now()}.pdf`;

    // Crear resolución en base de datos
    const resolucion = await prisma.resolucion.create({
      data: {
        procesoId: validatedData.procesoId,
        tipo: validatedData.tipo,
        titulo: validatedData.titulo,
        vistos: validatedData.vistos || null,
        considerando: validatedData.considerando || null,
        porTanto: validatedData.porTanto,
        documentoUrl,
        documentoHash,
        firmadoPor: profile.id,
        fechaEmision: new Date(),
        fechaNotificacion: new Date(), // Notificación inmediata
      },
    });

    // Crear notificaciones para ambos abogados
    const notificaciones = [];

    if (proceso.abogadoActorId) {
      notificaciones.push({
        usuarioId: proceso.abogadoActorId,
        procesoId: proceso.id,
        tipo: TipoNotificacion.RESOLUCION,
        titulo: `Nueva Resolución: ${validatedData.titulo}`,
        mensaje: `Se ha emitido una ${validatedData.tipo.toLowerCase().replace("_", " ")} en el proceso ${proceso.nurej}`,
        accionUrl: `/dashboard/procesos/${proceso.id}?tab=resoluciones`,
        leida: false,
      });
    }

    if (proceso.abogadoDemandadoId) {
      notificaciones.push({
        usuarioId: proceso.abogadoDemandadoId,
        procesoId: proceso.id,
        tipo: TipoNotificacion.RESOLUCION,
        titulo: `Nueva Resolución: ${validatedData.titulo}`,
        mensaje: `Se ha emitido una ${validatedData.tipo.toLowerCase().replace("_", " ")} en el proceso ${proceso.nurej}`,
        accionUrl: `/dashboard/procesos/${proceso.id}?tab=resoluciones`,
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
      data: resolucion,
      message: "Resolución creada exitosamente",
    });
  } catch (error: any) {
    console.error("Error al crear resolución:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de resolución inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear resolución" },
      { status: 500 }
    );
  }
}

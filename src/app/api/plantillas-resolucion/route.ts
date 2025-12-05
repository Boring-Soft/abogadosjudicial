/**
 * API Routes para Plantillas de Resolución
 * Endpoints: GET (listar), POST (crear)
 */

import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, hasRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPlantillaResolucionSchema } from "@/lib/validations/resolucion";
import { UserRole } from "@prisma/client";

/**
 * GET /api/plantillas-resolucion
 * Listar plantillas de resolución (solo JUEZ)
 * Query params: tipo (optional), compartida (optional), activa (optional)
 */
export async function GET(request: NextRequest) {
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

    // Solo JUEZ puede acceder a plantillas
    if (!hasRole(profile.role, UserRole.JUEZ)) {
      return NextResponse.json(
        { error: "Solo los jueces pueden acceder a las plantillas" },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const tipo = searchParams.get("tipo");
    const compartida = searchParams.get("compartida");
    const activa = searchParams.get("activa");

    // Construir filtros
    const where: any = {
      OR: [
        { creadoPor: profile.id }, // Plantillas propias
        { compartida: true, juzgadoId: profile.juzgadoId }, // Plantillas compartidas del juzgado
        { compartida: true, juzgadoId: null }, // Plantillas públicas
      ],
    };

    if (tipo) {
      where.tipo = tipo;
    }

    if (compartida !== null && compartida !== undefined) {
      where.compartida = compartida === "true";
    }

    if (activa !== null && activa !== undefined) {
      where.activa = activa === "true";
    }

    const plantillas = await prisma.plantillaResolucion.findMany({
      where,
      orderBy: [{ usosCantidad: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      data: plantillas,
    });
  } catch (error) {
    console.error("Error al obtener plantillas:", error);
    return NextResponse.json(
      { error: "Error al obtener plantillas" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/plantillas-resolucion
 * Crear nueva plantilla de resolución (solo JUEZ)
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

    // Solo JUEZ puede crear plantillas
    if (!hasRole(profile.role, UserRole.JUEZ)) {
      return NextResponse.json(
        { error: "Solo los jueces pueden crear plantillas" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validar con Zod
    const validatedData = createPlantillaResolucionSchema.parse(body);

    // Si la plantilla es compartida, asignarla al juzgado del juez
    const juzgadoId = validatedData.compartida ? profile.juzgadoId : null;

    const plantilla = await prisma.plantillaResolucion.create({
      data: {
        tipo: validatedData.tipo,
        titulo: validatedData.titulo,
        vistos: validatedData.vistos || null,
        considerando: validatedData.considerando || null,
        porTanto: validatedData.porTanto,
        descripcion: validatedData.descripcion || null,
        creadoPor: profile.id,
        compartida: validatedData.compartida || false,
        juzgadoId,
      },
    });

    return NextResponse.json({
      success: true,
      data: plantilla,
      message: "Plantilla creada exitosamente",
    });
  } catch (error: any) {
    console.error("Error al crear plantilla:", error);

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos de plantilla inválidos", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear plantilla" },
      { status: 500 }
    );
  }
}

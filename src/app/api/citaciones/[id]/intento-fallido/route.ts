import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { registrarIntentoFallidoSchema } from "@/lib/validations/citacion";
import { EstadoCitacion } from "@prisma/client";

/**
 * POST /api/citaciones/[id]/intento-fallido
 * Registrar intento fallido de citación (solo JUEZ)
 */
export async function POST(
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
        { error: "Solo los jueces pueden registrar intentos fallidos" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validatedData = registrarIntentoFallidoSchema.parse({
      ...body,
      citacionId: id,
    });

    // Verificar que la citación existe
    const citacion = await prisma.citacion.findUnique({
      where: { id },
      include: {
        proceso: {
          include: {
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

    // Verificar que la citación no esté exitosa
    if (citacion.estado === EstadoCitacion.EXITOSA) {
      return NextResponse.json(
        { error: "No se pueden registrar intentos en una citación exitosa" },
        { status: 400 }
      );
    }

    // Obtener intentos actuales
    const intentosActuales = Array.isArray(citacion.intentos)
      ? citacion.intentos
      : [];

    // Agregar nuevo intento
    const nuevoIntento = {
      fecha: validatedData.fecha,
      hora: validatedData.hora,
      motivo: validatedData.motivo,
      registradoEl: new Date().toISOString(),
    };

    const intentosActualizados = [...intentosActuales, nuevoIntento];

    // Determinar el nuevo estado
    let nuevoEstado = citacion.estado;
    if (intentosActualizados.length >= 3) {
      // Después de 3 intentos fallidos, marcar como FALLIDA
      nuevoEstado = EstadoCitacion.FALLIDA;
    } else if (citacion.estado === EstadoCitacion.PENDIENTE) {
      // Si estaba pendiente, cambiar a EN_PROCESO
      nuevoEstado = EstadoCitacion.EN_PROCESO;
    }

    // Actualizar citación
    const citacionActualizada = await prisma.citacion.update({
      where: { id },
      data: {
        intentos: intentosActualizados,
        estado: nuevoEstado,
      },
    });

    // Preparar recomendación si hay 3 o más intentos
    const recomendacion =
      intentosActualizados.length >= 3
        ? "Se recomienda proceder con citación por edictos"
        : null;

    return NextResponse.json({
      success: true,
      data: citacionActualizada,
      intentoRegistrado: nuevoIntento,
      totalIntentos: intentosActualizados.length,
      recomendacion,
      message: `Intento fallido ${intentosActualizados.length} registrado`,
    });
  } catch (error) {
    console.error("Error al registrar intento fallido:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al registrar intento fallido" },
      { status: 500 }
    );
  }
}

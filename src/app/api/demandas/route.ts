import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createDemandaSchema } from "@/lib/validations/demanda";
import { EstadoProceso, TipoNotificacion } from "@prisma/client";
import crypto from "crypto";

/**
 * POST /api/demandas
 * Crear nueva demanda (solo ABOGADO)
 */
export async function POST(req: NextRequest) {
  try {
    // Verificar autenticación y rol
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const hasPermission = await requireRole(user.id, ["ABOGADO"]);
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Solo los abogados pueden presentar demandas" },
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

    // Parsear y validar datos
    const body = await req.json();
    const validatedData = createDemandaSchema.parse(body);

    // Verificar que el proceso existe y pertenece al abogado
    const proceso = await prisma.proceso.findFirst({
      where: {
        id: validatedData.procesoId,
        abogadoActorId: profile.id,
      },
      include: {
        juzgado: true,
        juez: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado o no autorizado" },
        { status: 404 }
      );
    }

    // Verificar que el proceso está en estado BORRADOR
    if (proceso.estado !== EstadoProceso.BORRADOR) {
      return NextResponse.json(
        { error: "El proceso ya tiene una demanda presentada" },
        { status: 400 }
      );
    }

    // Generar hash del contenido de la demanda
    const contenido = JSON.stringify({
      designacionJuez: validatedData.designacionJuez,
      objeto: validatedData.objeto,
      hechos: validatedData.hechos,
      derecho: validatedData.derecho,
      petitorio: validatedData.petitorio,
      valorDemanda: validatedData.valorDemanda,
      pruebaOfrecida: validatedData.pruebaOfrecida,
    });
    const hash = crypto.createHash("sha256").update(contenido).digest("hex");

    // TODO: Generar PDF de la demanda y subirlo a Supabase Storage
    // Por ahora usamos un placeholder URL
    const documentoUrl = `/storage/procesos/${proceso.nurej}/demandas/demanda_v1.pdf`;

    // Asignar un juez si no tiene uno asignado aún
    let juezAsignadoId = proceso.juezId;
    if (!juezAsignadoId) {
      // Buscar jueces disponibles en el juzgado
      const juecesDisponibles = await prisma.profile.findMany({
        where: {
          role: "JUEZ",
          juzgadoId: proceso.juzgadoId,
        },
      });

      if (juecesDisponibles.length > 0) {
        // Asignación simple: tomar el primer juez disponible
        // TODO: Implementar lógica de asignación más sofisticada (round-robin, carga de trabajo, etc.)
        juezAsignadoId = juecesDisponibles[0].id;
      }
    }

    // Crear demanda y actualizar proceso en una transacción
    const demanda = await prisma.$transaction(async (tx) => {
      // Crear demanda
      const nuevaDemanda = await tx.demanda.create({
        data: {
          procesoId: validatedData.procesoId,
          designacionJuez: validatedData.designacionJuez,
          objeto: validatedData.objeto,
          hechos: validatedData.hechos,
          derecho: validatedData.derecho,
          petitorio: validatedData.petitorio,
          valorDemanda: validatedData.valorDemanda,
          pruebaOfrecida: validatedData.pruebaOfrecida,
          documentoUrl,
          documentoHash: hash,
          version: 1,
        },
      });

      // Actualizar estado del proceso a PRESENTADO y asignar juez
      await tx.proceso.update({
        where: { id: validatedData.procesoId },
        data: {
          estado: EstadoProceso.PRESENTADO,
          juezId: juezAsignadoId,
        },
      });

      return nuevaDemanda;
    });

    // Crear notificación para el JUEZ asignado
    if (juezAsignadoId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: juezAsignadoId,
          procesoId: proceso.id,
          tipo: TipoNotificacion.DEMANDA_PRESENTADA,
          titulo: "Nueva demanda presentada",
          mensaje: `Se ha presentado una nueva demanda en el proceso ${proceso.nurej || proceso.id}`,
          accionUrl: `/dashboard/juez/demandas/${demanda.id}`,
          leida: false,
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: demanda,
        message: "Demanda presentada exitosamente",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error al crear demanda:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al crear la demanda" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/demandas?procesoId=xxx
 * Obtener demanda por proceso (ABOGADO o JUEZ)
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

    const demanda = await prisma.demanda.findUnique({
      where: { procesoId },
      include: {
        proceso: {
          include: {
            juzgado: true,
            clienteActor: true,
            abogadoActor: true,
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

    return NextResponse.json({ success: true, data: demanda });
  } catch (error) {
    console.error("Error al obtener demanda:", error);
    return NextResponse.json(
      { error: "Error al obtener la demanda" },
      { status: 500 }
    );
  }
}

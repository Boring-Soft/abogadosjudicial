import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireRole } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { presentarContestacionSchema } from "@/lib/validations/contestacion";
import { EstadoProceso, TipoNotificacion } from "@prisma/client";
import crypto from "crypto";

/**
 * POST /api/contestaciones
 * Presentar contestación (solo ABOGADO)
 */
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const hasPermission = await requireRole(user.id, ["ABOGADO"]);
    if (!hasPermission) {
      return NextResponse.json(
        { error: "Solo los abogados pueden presentar contestaciones" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { procesoId, ...contestacionData } = body;

    if (!procesoId) {
      return NextResponse.json(
        { error: "El ID del proceso es requerido" },
        { status: 400 }
      );
    }

    // Validar datos de contestación
    const validatedData = presentarContestacionSchema.parse(contestacionData);

    // Verificar que el proceso existe y tiene citación exitosa
    const proceso = await prisma.proceso.findUnique({
      where: { id: procesoId },
      include: {
        citaciones: true,
        abogadoActor: true,
        juzgado: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    // Verificar que hay al menos una citación exitosa
    const citacionExitosa = proceso.citaciones.find(
      (c) => c.estado === "EXITOSA"
    );

    if (!citacionExitosa) {
      return NextResponse.json(
        { error: "No se puede contestar sin citación exitosa" },
        { status: 400 }
      );
    }

    // Verificar autorización
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Si el proceso ya tiene abogado demandado, debe ser el mismo
    if (
      proceso.abogadoDemandadoId &&
      proceso.abogadoDemandadoId !== profile.id
    ) {
      return NextResponse.json(
        { error: "No tiene permisos para contestar este proceso" },
        { status: 403 }
      );
    }

    // Si no tiene abogado demandado, asignarlo automáticamente
    if (!proceso.abogadoDemandadoId) {
      await prisma.proceso.update({
        where: { id: procesoId },
        data: { abogadoDemandadoId: profile.id },
      });
    }

    // Verificar que no exista ya una contestación
    const contestacionExistente = await prisma.contestacion.findUnique({
      where: { procesoId },
    });

    if (contestacionExistente) {
      return NextResponse.json(
        { error: "Ya existe una contestación para este proceso" },
        { status: 400 }
      );
    }

    // Preparar datos según tipo
    let contestacionDB: any = {
      procesoId,
      documentoUrl: "", // TODO: generar PDF y subirlo
      documentoHash: "",
    };

    switch (validatedData.tipo) {
      case "CONTESTACION":
        contestacionDB = {
          ...contestacionDB,
          esAllanamiento: false,
          tieneExcepciones: false,
          tieneReconvencion: false,
          admisionHechos: validatedData.admisionHechos,
          fundamentacion: validatedData.fundamentacion,
          pruebaDescargo: validatedData.pruebasOfrecidas
            ? JSON.stringify(validatedData.pruebasOfrecidas)
            : null,
          petitorio: validatedData.petitorio,
        };
        break;

      case "ALLANAMIENTO":
        contestacionDB = {
          ...contestacionDB,
          esAllanamiento: true,
          tieneExcepciones: false,
          tieneReconvencion: false,
          fundamentacion: validatedData.manifestacion,
          petitorio: validatedData.solicitaCostas
            ? `SOLICITO se me exima del pago de costas. ${validatedData.observacionesCostas || ""}`
            : "Me allano a la demanda.",
        };
        break;

      case "EXCEPCION":
        contestacionDB = {
          ...contestacionDB,
          esAllanamiento: false,
          tieneExcepciones: true,
          tieneReconvencion: false,
          tipoExcepcion: validatedData.tipoExcepcion,
          fundamentacionExcepcion: validatedData.fundamentacion,
          pruebaDescargo: validatedData.pruebasOfrecidas
            ? JSON.stringify(validatedData.pruebasOfrecidas)
            : null,
          petitorio: validatedData.petitorio,
        };
        break;

      case "RECONVENCION":
        contestacionDB = {
          ...contestacionDB,
          esAllanamiento: false,
          tieneExcepciones: false,
          tieneReconvencion: true,
          admisionHechos: validatedData.admisionHechos,
          fundamentacion: validatedData.fundamentacionContestacion,
          objetoReconvencion: validatedData.objetoReconvencion,
          hechosReconvencion: validatedData.hechosReconvencion,
          derechoReconvencion: validatedData.derechoReconvencion,
          petitorioReconvencion: validatedData.petitorioReconvencion,
          pruebaDescargo: validatedData.pruebasOfrecidas
            ? JSON.stringify(validatedData.pruebasOfrecidas)
            : null,
          petitorio: validatedData.petitorioReconvencion,
        };
        break;
    }

    // Calcular hash SHA-256 del contenido
    const contestacionString = JSON.stringify(contestacionDB);
    const hash = crypto
      .createHash("sha256")
      .update(contestacionString)
      .digest("hex");

    contestacionDB.documentoHash = hash;
    contestacionDB.documentoUrl = `/contestaciones/${procesoId}_${hash.substring(0, 8)}.pdf`;

    // Crear contestación en base de datos
    const contestacion = await prisma.contestacion.create({
      data: contestacionDB,
    });

    // Cambiar estado del proceso a CONTESTADO
    await prisma.proceso.update({
      where: { id: procesoId },
      data: { estado: EstadoProceso.CONTESTADO },
    });

    // Cancelar plazo de contestación (marcarlo como cumplido)
    await prisma.plazo.updateMany({
      where: {
        procesoId,
        tipo: "CONTESTACION",
        estado: "ACTIVO",
      },
      data: {
        estado: "CUMPLIDO",
      },
    });

    // Notificar al JUEZ
    if (proceso.juezId) {
      await prisma.notificacion.create({
        data: {
          usuarioId: proceso.juezId,
          procesoId,
          tipo: TipoNotificacion.CONTESTACION_PRESENTADA,
          titulo: "Nueva contestación presentada",
          mensaje: `Se ha presentado ${
            validatedData.tipo === "ALLANAMIENTO"
              ? "un allanamiento"
              : validatedData.tipo === "EXCEPCION"
              ? "una excepción previa"
              : validatedData.tipo === "RECONVENCION"
              ? "una contestación con reconvención"
              : "una contestación"
          } en el proceso ${proceso.nurej || procesoId}.`,
          accionUrl: `/dashboard/juez/procesos/${procesoId}/contestacion`,
          leida: false,
        },
      });
    }

    // Notificar al ABOGADO ACTOR
    await prisma.notificacion.create({
      data: {
        usuarioId: proceso.abogadoActorId,
        procesoId,
        tipo: TipoNotificacion.CONTESTACION_PRESENTADA,
        titulo: "Contestación presentada",
        mensaje: `La parte demandada ha presentado ${
          validatedData.tipo === "ALLANAMIENTO"
            ? "un allanamiento"
            : validatedData.tipo === "EXCEPCION"
            ? "una excepción previa"
            : validatedData.tipo === "RECONVENCION"
            ? "una reconvención"
            : "su contestación"
        } en el proceso ${proceso.nurej || procesoId}.`,
        accionUrl: `/dashboard/procesos/${procesoId}/contestacion`,
        leida: false,
      },
    });

    // Si hay reconvención, crear plazo para que el actor conteste (10 días)
    if (validatedData.tipo === "RECONVENCION") {
      const fechaInicio = new Date();
      const fechaVencimiento = new Date(fechaInicio);
      fechaVencimiento.setDate(fechaVencimiento.getDate() + 10);

      await prisma.plazo.create({
        data: {
          procesoId,
          tipo: "CONTESTACION",
          fechaInicio,
          fechaVencimiento,
          destinatario: proceso.abogadoActorId,
          estado: "ACTIVO",
          diasHabiles: 10,
        },
      });

      // Notificación adicional sobre reconvención
      await prisma.notificacion.create({
        data: {
          usuarioId: proceso.abogadoActorId,
          procesoId,
          tipo: TipoNotificacion.CONTESTACION_PRESENTADA,
          titulo: "Reconvención presentada",
          mensaje: `La parte demandada ha presentado reconvención. Tiene 10 días hábiles para contestarla en el proceso ${
            proceso.nurej || procesoId
          }.`,
          accionUrl: `/dashboard/procesos/${procesoId}/contestacion-reconvencion`,
          leida: false,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: contestacion,
      message: "Contestación presentada exitosamente",
    });
  } catch (error) {
    console.error("Error al presentar contestación:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Datos inválidos", details: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Error al presentar la contestación" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contestaciones?procesoId=xxx
 * Obtener contestación de un proceso
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
        { error: "El ID del proceso es requerido" },
        { status: 400 }
      );
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

    // Verificar que el usuario tenga acceso al proceso
    const proceso = await prisma.proceso.findUnique({
      where: { id: procesoId },
      include: {
        contestacion: true,
        juzgado: true,
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso no encontrado" },
        { status: 404 }
      );
    }

    // Verificar permisos
    const esJuezDelJuzgado = profile.juzgadoId === proceso.juzgadoId;
    const esAbogadoActor = profile.id === proceso.abogadoActorId;
    const esAbogadoDemandado = profile.id === proceso.abogadoDemandadoId;

    if (!esJuezDelJuzgado && !esAbogadoActor && !esAbogadoDemandado) {
      return NextResponse.json(
        { error: "No tiene permisos para ver esta contestación" },
        { status: 403 }
      );
    }

    if (!proceso.contestacion) {
      return NextResponse.json(
        { error: "No hay contestación para este proceso" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: proceso.contestacion,
    });
  } catch (error) {
    console.error("Error al obtener contestación:", error);
    return NextResponse.json(
      { error: "Error al obtener la contestación" },
      { status: 500 }
    );
  }
}

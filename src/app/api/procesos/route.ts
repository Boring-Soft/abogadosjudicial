import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserRole, TipoProceso, MateriaProceso, EstadoProceso } from "@prisma/client";

const createProcesoSchema = z.object({
  tipoProceso: z.nativeEnum(TipoProceso),
  materia: z.nativeEnum(MateriaProceso),
  cuantia: z.number().min(0).optional().nullable(),
  juzgadoId: z.string().min(1, "Debe seleccionar un juzgado"),
  clienteActorId: z.string().min(1, "Debe seleccionar un cliente"),
  // Datos del demandado
  demandadoNombres: z.string().min(2).optional().nullable(),
  demandadoApellidos: z.string().min(2).optional().nullable(),
  demandadoCI: z.string().min(5).optional().nullable(),
  demandadoEdad: z.number().int().min(18).max(120).optional().nullable(),
  demandadoEstadoCivil: z.string().optional().nullable(),
  demandadoProfesion: z.string().optional().nullable(),
  demandadoDomicilioReal: z.string().optional().nullable(),
  demandadoDomicilioProcesal: z.string().optional().nullable(),
});

/**
 * Generate a provisional NUREJ
 * Format: YEAR-JUZGADO-SEQUENTIAL
 */
async function generateNUREJ(juzgadoId: string): Promise<string> {
  const year = new Date().getFullYear();

  // Get juzgado code (first 3 letters of name)
  const juzgado = await prisma.juzgado.findUnique({
    where: { id: juzgadoId },
  });

  if (!juzgado) throw new Error("Juzgado not found");

  const juzgadoCode = juzgado.nombre.substring(0, 3).toUpperCase();

  // Count existing processes for this year and juzgado
  const count = await prisma.proceso.count({
    where: {
      juzgadoId,
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      },
    },
  });

  const sequential = (count + 1).toString().padStart(4, "0");

  return `${year}-${juzgadoCode}-${sequential}`;
}

/**
 * GET /api/procesos - List procesos based on user role
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const estado = searchParams.get("estado") || "";
    const materia = searchParams.get("materia") || "";
    const juzgadoId = searchParams.get("juzgadoId") || "";

    // Build where clause based on role
    const where: any = {};

    if (profile.role === UserRole.ABOGADO) {
      // Abogado sees only their processes (as actor or demandado lawyer)
      where.OR = [
        { abogadoActorId: profile.id },
        { abogadoDemandadoId: profile.id },
      ];
    } else if (profile.role === UserRole.JUEZ) {
      // Juez sees processes from their juzgado
      if (!profile.juzgadoId) {
        return NextResponse.json(
          { error: "Juez must be assigned to a juzgado" },
          { status: 400 }
        );
      }
      where.juzgadoId = profile.juzgadoId;
    }

    // Apply filters
    if (estado) where.estado = estado as EstadoProceso;
    if (materia) where.materia = materia as MateriaProceso;
    if (juzgadoId) where.juzgadoId = juzgadoId;

    if (search) {
      where.OR = [
        { nurej: { contains: search } },
        ...(where.OR || []),
      ];
    }

    // Get total count
    const total = await prisma.proceso.count({ where });

    // Get procesos with relations
    const procesos = await prisma.proceso.findMany({
      where,
      include: {
        juzgado: true,
        clienteActor: true,
        abogadoActor: true,
        clienteDemandado: true,
        abogadoDemandado: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      data: procesos,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("Error fetching procesos:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/procesos - Create a new proceso (ABOGADO only)
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile || profile.role !== UserRole.ABOGADO) {
      return NextResponse.json(
        { error: "Only abogados can create procesos" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = createProcesoSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation error",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify cliente exists and belongs to this abogado
    const cliente = await prisma.cliente.findFirst({
      where: {
        id: data.clienteActorId,
        abogadoId: profile.id,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente not found or doesn't belong to this abogado" },
        { status: 404 }
      );
    }

    // Generate NUREJ
    const nurej = await generateNUREJ(data.juzgadoId);

    // Create proceso
    const proceso = await prisma.proceso.create({
      data: {
        nurej,
        tipoProceso: data.tipoProceso,
        materia: data.materia,
        cuantia: data.cuantia,
        estado: EstadoProceso.BORRADOR,
        juzgadoId: data.juzgadoId,
        clienteActorId: data.clienteActorId,
        abogadoActorId: profile.id,
        demandadoNombres: data.demandadoNombres,
        demandadoApellidos: data.demandadoApellidos,
        demandadoCI: data.demandadoCI,
      },
      include: {
        juzgado: true,
        clienteActor: true,
        abogadoActor: true,
      },
    });

    return NextResponse.json(
      {
        message: "Proceso creado exitosamente",
        proceso,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating proceso:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

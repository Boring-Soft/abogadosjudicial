import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserRole, EstadoProceso } from "@prisma/client";

const updateProcesoSchema = z.object({
  cuantia: z.number().min(0).optional().nullable(),
  estado: z.nativeEnum(EstadoProceso).optional(),
  juezId: z.string().optional().nullable(),
  demandadoNombres: z.string().min(2).optional().nullable(),
  demandadoApellidos: z.string().min(2).optional().nullable(),
  demandadoCI: z.string().min(5).optional().nullable(),
});

/**
 * Check if user has access to proceso
 */
async function hasAccessToProceso(
  procesoId: string,
  userId: string,
  role: UserRole,
  profileId: string,
  juzgadoId: string | null
): Promise<boolean> {
  const proceso = await prisma.proceso.findUnique({
    where: { id: procesoId },
  });

  if (!proceso) return false;

  if (role === UserRole.ABOGADO) {
    // Abogado must be either abogadoActor or abogadoDemandado
    return (
      proceso.abogadoActorId === profileId ||
      proceso.abogadoDemandadoId === profileId
    );
  } else if (role === UserRole.JUEZ) {
    // Juez must be from the same juzgado
    return proceso.juzgadoId === juzgadoId;
  }

  return false;
}

/**
 * GET /api/procesos/[id] - Get a specific proceso
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check access
    const hasAccess = await hasAccessToProceso(
      id,
      user.id,
      profile.role,
      profile.id,
      profile.juzgadoId
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this proceso" },
        { status: 403 }
      );
    }

    // Get proceso with all relations
    const proceso = await prisma.proceso.findUnique({
      where: { id },
      include: {
        juzgado: true,
        clienteActor: true,
        abogadoActor: true,
        clienteDemandado: true,
        abogadoDemandado: true,
        demanda: true,
        citaciones: {
          orderBy: { createdAt: "desc" },
        },
        audiencias: {
          orderBy: { fechaHora: "asc" },
        },
        resoluciones: {
          orderBy: { fechaEmision: "desc" },
        },
        documentos: {
          orderBy: { createdAt: "desc" },
        },
        plazos: {
          orderBy: { fechaVencimiento: "asc" },
        },
      },
    });

    if (!proceso) {
      return NextResponse.json(
        { error: "Proceso not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ proceso });
  } catch (error: any) {
    console.error("Error fetching proceso:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/procesos/[id] - Update a proceso
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Check access
    const hasAccess = await hasAccessToProceso(
      id,
      user.id,
      profile.role,
      profile.id,
      profile.juzgadoId
    );

    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access denied to this proceso" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateProcesoSchema.safeParse(body);

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

    // Only JUEZ can update estado and assign juezId
    if (profile.role !== UserRole.JUEZ) {
      delete data.estado;
      delete data.juezId;
    }

    // Update proceso
    const proceso = await prisma.proceso.update({
      where: { id },
      data,
      include: {
        juzgado: true,
        clienteActor: true,
        abogadoActor: true,
        clienteDemandado: true,
        abogadoDemandado: true,
      },
    });

    return NextResponse.json({
      message: "Proceso actualizado exitosamente",
      proceso,
    });
  } catch (error: any) {
    console.error("Error updating proceso:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

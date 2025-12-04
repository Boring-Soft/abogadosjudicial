import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserRole } from "@prisma/client";

const createClienteSchema = z.object({
  ci: z.string().min(5, "CI debe tener al menos 5 caracteres"),
  nombres: z.string().min(2, "Nombres debe tener al menos 2 caracteres"),
  apellidos: z.string().min(2, "Apellidos debe tener al menos 2 caracteres"),
  edad: z.number().int().min(18).max(120).optional().nullable(),
  estadoCivil: z.string().optional().nullable(),
  profesion: z.string().optional().nullable(),
  domicilioReal: z.string().min(5, "Domicilio real es requerido"),
  domicilioProcesal: z.string().min(5, "Domicilio procesal es requerido"),
  telefono: z.string().min(7).optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable(),
  fotoUrl: z.string().url().optional().nullable(),
});

/**
 * GET /api/clientes - List all clientes for the current abogado
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile to verify ABOGADO role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || profile.role !== UserRole.ABOGADO) {
      return NextResponse.json(
        { error: "Only abogados can access clientes" },
        { status: 403 }
      );
    }

    // Get query parameters for filtering and pagination
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";
    const activo = searchParams.get("activo");

    // Build where clause
    const where: any = {
      abogadoId: profile.id,
    };

    if (activo !== null && activo !== undefined && activo !== "") {
      where.activo = activo === "true";
    }

    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: "insensitive" } },
        { apellidos: { contains: search, mode: "insensitive" } },
        { ci: { contains: search } },
      ];
    }

    // Get total count
    const total = await prisma.cliente.count({ where });

    // Get clientes with pagination
    const clientes = await prisma.cliente.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      data: clientes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: any) {
    console.error("Error fetching clientes:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clientes - Create a new cliente
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile to verify ABOGADO role
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || profile.role !== UserRole.ABOGADO) {
      return NextResponse.json(
        { error: "Only abogados can create clientes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = createClienteSchema.safeParse(body);

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

    // Check if CI already exists for this abogado
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        ci: data.ci,
        abogadoId: profile.id,
      },
    });

    if (existingCliente) {
      return NextResponse.json(
        { error: "Ya existe un cliente con este CI" },
        { status: 409 }
      );
    }

    // Create cliente
    const cliente = await prisma.cliente.create({
      data: {
        ...data,
        abogadoId: profile.id,
        activo: true,
      },
    });

    return NextResponse.json(
      {
        message: "Cliente creado exitosamente",
        cliente,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating cliente:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

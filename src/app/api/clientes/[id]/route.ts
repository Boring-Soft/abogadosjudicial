import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { UserRole } from "@prisma/client";

const updateClienteSchema = z.object({
  ci: z.string().min(5, "CI debe tener al menos 5 caracteres").optional(),
  nombres: z.string().min(2, "Nombres debe tener al menos 2 caracteres").optional(),
  apellidos: z.string().min(2, "Apellidos debe tener al menos 2 caracteres").optional(),
  edad: z.number().int().min(18).max(120).optional().nullable(),
  estadoCivil: z.string().optional().nullable(),
  profesion: z.string().optional().nullable(),
  domicilioReal: z.string().min(5, "Domicilio real es requerido").optional(),
  domicilioProcesal: z.string().min(5, "Domicilio procesal es requerido").optional(),
  telefono: z.string().min(7).optional().nullable(),
  email: z.string().email("Email inválido").optional().nullable(),
  fotoUrl: z.string().url().optional().nullable(),
  activo: z.boolean().optional(),
});

/**
 * GET /api/clientes/[id] - Get a specific cliente
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || profile.role !== UserRole.ABOGADO) {
      return NextResponse.json(
        { error: "Only abogados can access clientes" },
        { status: 403 }
      );
    }

    const cliente = await prisma.cliente.findFirst({
      where: {
        id,
        abogadoId: profile.id,
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ cliente });
  } catch (error: any) {
    console.error("Error fetching cliente:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/clientes/[id] - Update a cliente
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || profile.role !== UserRole.ABOGADO) {
      return NextResponse.json(
        { error: "Only abogados can update clientes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateClienteSchema.safeParse(body);

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

    // Check if cliente exists and belongs to this abogado
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        id,
        abogadoId: profile.id,
      },
    });

    if (!existingCliente) {
      return NextResponse.json(
        { error: "Cliente not found" },
        { status: 404 }
      );
    }

    // If CI is being updated, check for duplicates
    if (data.ci && data.ci !== existingCliente.ci) {
      const duplicateCI = await prisma.cliente.findFirst({
        where: {
          ci: data.ci,
          abogadoId: profile.id,
          id: { not: id },
        },
      });

      if (duplicateCI) {
        return NextResponse.json(
          { error: "Ya existe un cliente con este CI" },
          { status: 409 }
        );
      }
    }

    // Update cliente
    const cliente = await prisma.cliente.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      message: "Cliente actualizado exitosamente",
      cliente,
    });
  } catch (error: any) {
    console.error("Error updating cliente:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/clientes/[id] - Soft delete a cliente
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || profile.role !== UserRole.ABOGADO) {
      return NextResponse.json(
        { error: "Only abogados can delete clientes" },
        { status: 403 }
      );
    }

    // Check if cliente exists and belongs to this abogado
    const existingCliente = await prisma.cliente.findFirst({
      where: {
        id,
        abogadoId: profile.id,
      },
    });

    if (!existingCliente) {
      return NextResponse.json(
        { error: "Cliente not found" },
        { status: 404 }
      );
    }

    // Soft delete by setting activo to false
    const cliente = await prisma.cliente.update({
      where: { id },
      data: { activo: false },
    });

    return NextResponse.json({
      message: "Cliente desactivado exitosamente",
      cliente,
    });
  } catch (error: any) {
    console.error("Error deleting cliente:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

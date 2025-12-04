import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

/**
 * GET /api/juzgados - List all active juzgados
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all active juzgados
    const juzgados = await prisma.juzgado.findMany({
      where: {
        activo: true,
      },
      orderBy: [
        { departamento: "asc" },
        { ciudad: "asc" },
        { nombre: "asc" },
      ],
    });

    return NextResponse.json({ juzgados });
  } catch (error: any) {
    console.error("Error fetching juzgados:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

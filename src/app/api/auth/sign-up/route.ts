import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { dynamicSignUpSchema } from "@/types/auth/sign-up";
import { hashPassword } from "@/lib/auth/password-crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body based on role
    const validation = dynamicSignUpSchema.safeParse(body);

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
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Hash password client-side style (if needed for your implementation)
    // const hashedPassword = await hashPassword(data.password);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          role: data.role,
        },
      },
    });

    if (authError) {
      console.error("Supabase Auth error:", authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Create profile in Prisma based on role
    try {
      const profileData: any = {
        userId: authData.user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role || UserRole.USER,
        active: true,
      };

      // Add role-specific fields
      if (data.role === UserRole.ABOGADO && "registroProfesional" in data) {
        profileData.registroProfesional = data.registroProfesional;
        profileData.telefono = data.telefono || null;
      }

      if (data.role === UserRole.JUEZ && "juzgadoId" in data) {
        profileData.juzgadoId = data.juzgadoId;
        profileData.telefono = data.telefono || null;
      }

      await prisma.profile.create({
        data: profileData,
      });

      return NextResponse.json(
        {
          message: "User created successfully",
          user: {
            id: authData.user.id,
            email: authData.user.email,
            role: data.role,
          },
          requiresVerification: true,
        },
        { status: 201 }
      );
    } catch (prismaError: any) {
      console.error("Prisma error:", prismaError);

      // Rollback: delete the Supabase user if profile creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (rollbackError) {
        console.error("Failed to rollback user creation:", rollbackError);
      }

      return NextResponse.json(
        {
          error: "Failed to create user profile",
          details: prismaError.message,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

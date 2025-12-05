// Authentication utilities for Sistema Judicial
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface User {
  id: string;
  email?: string;
  name?: string;
  role?: UserRole;
  registroProfesional?: string | null;
  juzgadoId?: string | null;
}

export interface Session {
  user: User;
  expires: Date;
}

/**
 * Get the current authenticated user session
 * This function checks Supabase auth and fetches the user's profile from Prisma
 * Uses getUser() instead of getSession() for better security
 */
export async function auth(): Promise<Session | null> {
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
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return null;
    }

    // Fetch user profile from Prisma
    const profile = await prisma.profile.findUnique({
      where: { userId: supabaseUser.id },
      include: {
        juzgado: true,
      },
    });

    if (!profile) {
      return null;
    }

    const user: User = {
      id: profile.userId,
      email: supabaseUser.email,
      name: profile.firstName && profile.lastName
        ? `${profile.firstName} ${profile.lastName}`
        : supabaseUser.email,
      role: profile.role,
      registroProfesional: profile.registroProfesional,
      juzgadoId: profile.juzgadoId,
    };

    return {
      user,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };
  } catch (error) {
    console.error("Error in auth():", error);
    return null;
  }
}

/**
 * Get the current user profile (useful for server components)
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await auth();
  return session?.user || null;
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if the current user is an ABOGADO
 */
export async function isAbogado(): Promise<boolean> {
  return hasRole(UserRole.ABOGADO);
}

/**
 * Check if the current user is a JUEZ
 */
export async function isJuez(): Promise<boolean> {
  return hasRole(UserRole.JUEZ);
}

/**
 * Check if the current user is a SUPERADMIN
 */
export async function isSuperAdmin(): Promise<boolean> {
  return hasRole(UserRole.SUPERADMIN);
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<Session> {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

/**
 * Require a specific role - returns true if user has one of the required roles
 */
export async function requireRole(userId: string, allowedRoles: UserRole[]): Promise<boolean> {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    return false;
  }

  return allowedRoles.includes(profile.role);
}

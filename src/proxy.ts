import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles
const PROTECTED_ROUTES = {
  // Rutas de ABOGADO
  "/dashboard/clientes": ["ABOGADO"],
  "/dashboard/procesos": ["ABOGADO", "JUEZ"],
  "/dashboard/demandas": ["ABOGADO"],
  "/dashboard/audiencias": ["ABOGADO", "JUEZ"],
  "/dashboard/plazos": ["ABOGADO", "JUEZ"],

  // Rutas de JUEZ
  "/dashboard/juez": ["JUEZ"],

  // Rutas comunes (cualquier usuario autenticado)
  "/dashboard": ["USER", "ABOGADO", "JUEZ", "SUPERADMIN"],
  "/settings": ["USER", "ABOGADO", "JUEZ", "SUPERADMIN"],
};

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Create Supabase client with explicit env vars for Next.js 16
  const supabase = createMiddlewareClient({
    req,
    res,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Allow public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/magic-link") ||
    pathname === "/" ||
    pathname === "/pricing"
  ) {
    return res;
  }

  // Redirect to sign-in if not authenticated
  if (!session) {
    const redirectUrl = new URL("/sign-in", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check role-based access
  const userRole = await getUserRole(session.user.id, supabase);

  // Check if the route requires specific roles
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!userRole || !allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const dashboardUrl = getDashboardForRole(userRole);
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
    }
  }

  return res;
}

/**
 * Get user role from Supabase/Prisma
 */
async function getUserRole(userId: string, supabase: any): Promise<string | null> {
  try {
    // Query the profile table to get the user's role
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("userId", userId)
      .single();

    if (error || !data) {
      console.error("Error fetching user role:", error);
      return null;
    }

    return data.role;
  } catch (error) {
    console.error("Error in getUserRole:", error);
    return null;
  }
}

/**
 * Get the appropriate dashboard URL based on user role
 */
function getDashboardForRole(role: string | null): string {
  switch (role) {
    case "JUEZ":
      return "/dashboard/juez";
    case "ABOGADO":
      return "/dashboard";
    case "SUPERADMIN":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

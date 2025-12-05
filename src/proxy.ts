import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and their required roles (order matters - most specific first)
const PROTECTED_ROUTES: Record<string, string[]> = {
  // Rutas de JUEZ (más específicas primero)
  "/dashboard/juez/demandas": ["JUEZ"],
  "/dashboard/juez/perfil": ["JUEZ"],
  "/dashboard/juez": ["JUEZ"],

  // Rutas de ABOGADO (más específicas primero)
  "/dashboard/clientes": ["ABOGADO"],
  "/dashboard/demandas": ["ABOGADO"],
  "/dashboard/procesos": ["ABOGADO", "JUEZ"],
  "/dashboard/audiencias": ["ABOGADO", "JUEZ"],
  "/dashboard/plazos": ["ABOGADO", "JUEZ"],
  "/dashboard/perfil": ["USER", "ABOGADO", "JUEZ", "SUPERADMIN"],

  // Rutas comunes
  "/settings": ["USER", "ABOGADO", "JUEZ", "SUPERADMIN"],
};

export async function proxy(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const { pathname } = req.nextUrl;

  // Allow public routes and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email") ||
    pathname.startsWith("/magic-link") ||
    pathname === "/" ||
    pathname === "/pricing" ||
    pathname === "/test-page"
  ) {
    return response;
  }

  // Create Supabase client for middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            req.cookies.set(name, value)
          );
          response = NextResponse.next({
            request: req,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getUser() instead of getSession() for security
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Redirect to sign-in if not authenticated
  if (error || !user) {
    const redirectUrl = new URL("/sign-in", req.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Get user role
  const userRole = await getUserRole(user.id, supabase);

  if (!userRole) {
    console.error("User role not found for user:", user.id);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Handle /dashboard base route - redirect to role-specific dashboard
  if (pathname === "/dashboard") {
    const dashboardUrl = getDashboardForRole(userRole);
    if (dashboardUrl !== "/dashboard") {
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }
    // If role is USER or ABOGADO, allow access to /dashboard
    return response;
  }

  // Check role-based access for protected routes
  // Check from most specific to least specific
  for (const [route, allowedRoles] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const dashboardUrl = getDashboardForRole(userRole);
        return NextResponse.redirect(new URL(dashboardUrl, req.url));
      }
      // User has access, return response
      return response;
    }
  }

  return response;
}

/**
 * Get user role from Supabase
 */
async function getUserRole(
  userId: string,
  supabase: any
): Promise<string | null> {
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

import { NextResponse } from "next/server";

export async function middleware() {
  // Authentication disabled for frontend design purposes
  // Simply pass through all requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up", "/auth/callback"],
};

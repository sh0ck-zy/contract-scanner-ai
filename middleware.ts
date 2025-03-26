// middleware.ts
import { NextResponse } from "next/server";
import { clerkMiddleware, ClerkMiddleware } from "@clerk/nextjs/server";
import type { NextRequest } from "next/server";

// Initialize Clerk middleware
const clerkAuth = clerkMiddleware();

export default function middleware(request: NextRequest) {
  // Apply Clerk middleware
  const response = NextResponse.next();

  // Let Clerk handle the request first
  const clerkResponse = clerkAuth(request, response);

  // Get the authenticated user (if any)
  // Extract auth info from the request header after Clerk middleware processed it
  const requestHeaders = new Headers(request.headers);
  const userId = requestHeaders.get('x-clerk-user-id');

  // If the user is trying to access a protected route and is not logged in
  if (request.nextUrl.pathname.startsWith('/dashboard') && !userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return clerkResponse;
}

export const config = {
  matcher: [
    // Protect all dashboard routes
    '/dashboard/:path*',
    // Exclude static files and API routes that don't need auth
    '/((?!api/|_next/static|_next/image|favicon.ico).*)',
  ],
};
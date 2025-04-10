// middleware.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/",
  "/api/webhook/clerk", 
  "/api/webhook/stripe",
  "/sign-in",
  "/sign-up",
  "/pricing",
  "/api/auth/(.*)"
];

// Routes to ignore
const IGNORED_ROUTES = [
  "/favicon.ico",
  "/background.js"
];

// Use Clerk in both development and production
export default authMiddleware({
  publicRoutes: PUBLIC_ROUTES,
  ignoredRoutes: IGNORED_ROUTES,
  debug: process.env.NODE_ENV === 'development',
});

// Stop Middleware running on static files
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
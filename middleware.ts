// middleware.ts
import { NextResponse } from "next/server";
import { authMiddleware } from "@clerk/nextjs";

// This middleware handles authentication with Clerk
export default authMiddleware({
  // Routes that can be accessed without authentication
  publicRoutes: [
    "/",
    "/api/webhook/clerk", 
    "/api/webhook/stripe",
    "/sign-in",
    "/sign-up",
    "/pricing",
    "/api/auth/(.*)"
  ],
  
  // Routes that are completely ignored by the middleware
  ignoredRoutes: [
    "/favicon.ico",
    "/background.js"
  ]
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
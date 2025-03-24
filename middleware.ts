// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  // For now, just let all requests through
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
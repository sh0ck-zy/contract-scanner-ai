"use client"

import React from "react"
import { ClerkProvider } from "@clerk/nextjs"

// Use Clerk for authentication
export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          footer: "hidden" // Hide Clerk's footer
        }
      }}
      // Setting this ensures Clerk works in development
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  )
} 
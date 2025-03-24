"use client"

import type React from "react"

import { ClerkProvider } from "./clerk-provider"
import { ThemeProvider } from "./theme-provider"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
        <Toaster />
      </ThemeProvider>
    </ClerkProvider>
  )
}


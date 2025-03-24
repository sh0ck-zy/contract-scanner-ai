"use client"

import type React from "react"

import { ClerkProvider as ClerkProviderOriginal } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useTheme } from "next-themes"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  return (
    <ClerkProviderOriginal
      appearance={{
        baseTheme: isDarkMode ? dark : undefined,
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        },
      }}
    >
      {children}
    </ClerkProviderOriginal>
  )
}


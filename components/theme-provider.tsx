// components/providers/theme-provider.tsx
"use client"

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Using suppressHydrationWarning to prevent hydration mismatches
  return (
    <NextThemesProvider {...props} enableSystem={false} defaultTheme="light">
      <div suppressHydrationWarning>{children}</div>
    </NextThemesProvider>
  )
}
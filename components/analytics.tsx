"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

// Add type definitions for gtag
declare global {
  interface Window {
    gtag: (command: string, target: string, config?: Record<string, any>) => void
  }
}

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (pathname) {
      // Path changed, track page view
      const url = searchParams?.size
        ? `${pathname}?${searchParams.toString()}`
        : pathname
      
      // Here you can add your analytics tracking
      // Example: Google Analytics
      if (window.gtag) {
        window.gtag('config', 'YOUR-TRACKING-ID', {
          page_path: url,
        })
      }
    }
  }, [pathname, searchParams])

  return null
} 
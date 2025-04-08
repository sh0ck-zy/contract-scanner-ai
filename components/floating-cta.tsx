"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'
import Link from 'next/link'

interface FloatingCTAProps {
  message?: string
  buttonText?: string
  buttonLink?: string
  showAfterScroll?: number // pixels scrolled before showing
}

export function FloatingCTA({
  message = "Ready to protect your freelance business?",
  buttonText = "Try Free Analysis",
  buttonLink = "/dashboard/contracts/new",
  showAfterScroll = 400
}: FloatingCTAProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > showAfterScroll) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [showAfterScroll])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg transform transition-transform duration-300 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="font-medium text-foreground">{message}</p>
        <Link href={buttonLink}>
          <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2 w-full sm:w-auto">
            <Shield className="h-4 w-4" />
            {buttonText}
          </Button>
        </Link>
      </div>
    </div>
  )
} 
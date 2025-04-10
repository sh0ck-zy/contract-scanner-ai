"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import Link from "next/link"

interface FloatingCTAProps {
  message?: string
  buttonText?: string
  buttonLink?: string
  scrollThreshold?: number
}

export function FloatingCTA({
  message = "Ready to analyze your first contract?",
  buttonText = "Start Now — It's Free",
  buttonLink = "/dashboard/contracts/new",
  scrollThreshold = 300
}: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollThreshold, isDismissed])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-md flex items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={buttonLink}>
            <Button size="sm" className="whitespace-nowrap">
              {buttonText}
            </Button>
          </Link>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 
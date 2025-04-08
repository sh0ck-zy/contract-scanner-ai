"use client"

import React from "react"

// Simple development user provider that just renders children
export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      {/* Development mode notification */}
      <div className="fixed bottom-0 left-0 right-0 bg-amber-100 border-t border-amber-300 p-2 text-xs text-amber-800 text-center">
        Running in development mode without authentication
      </div>
    </div>
  )
} 
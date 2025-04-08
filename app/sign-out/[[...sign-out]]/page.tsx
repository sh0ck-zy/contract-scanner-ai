"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function SignOutPage() {
    const router = useRouter()

    useEffect(() => {
        // In development, just redirect to home page
        setTimeout(() => {
            router.push("/")
        }, 1000)
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-neutral-600">Signing out...</p>
        </div>
    )
}


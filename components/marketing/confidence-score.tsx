"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConfidenceScoreProps {
    score: number
    issues: number
    recommendations: number
}

export function ConfidenceScore({ score, issues, recommendations }: ConfidenceScoreProps) {
    const { toast } = useToast()
    const [showShareOptions, setShowShareOptions] = useState(false)
    const [copied, setCopied] = useState(false)

    const getScoreColor = () => {
        if (score >= 80) return "text-green-600"
        if (score >= 60) return "text-amber-600"
        return "text-red-600"
    }

    const getScoreText = () => {
        if (score >= 80) return "High Confidence"
        if (score >= 60) return "Medium Confidence"
        return "Low Confidence"
    }

    const getProgressColor = () => {
        if (score >= 80) return "bg-green-600"
        if (score >= 60) return "bg-amber-600"
        return "bg-red-600"
    }

    const shareUrl = `${window.location.origin}/share/contract/${contractId}`

    const shareText = `I just scored ${score}/100 on my "${contractTitle}" contract with ContractScan! #LegalConfidence #Freelancing`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast({
            title: "Link copied",
            description: "Share link has been copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
    }

    const shareOnTwitter = () => {
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
            "_blank",
        )
    }

    const shareOnFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank")
    }

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank")
    }

    return (
        <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contract Confidence Score</h3>
            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Overall Score</span>
                        <span className="text-sm font-medium">{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm font-medium">{issues}</div>
                        <div className="text-xs text-muted-foreground">Issues Found</div>
                    </div>
                    <div>
                        <div className="text-sm font-medium">{recommendations}</div>
                        <div className="text-xs text-muted-foreground">Recommendations</div>
                    </div>
                </div>
            </div>
        </Card>
    )
}


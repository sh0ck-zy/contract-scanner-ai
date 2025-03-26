"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Shield, Share2, Twitter, Facebook, Linkedin, Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ConfidenceScoreProps {
    score: number
    contractId: string
    contractTitle: string
}

export function ConfidenceScore({ score, contractId, contractTitle }: ConfidenceScoreProps) {
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Contract Confidence Score
                </CardTitle>
                <CardDescription>How well your contract protects your freelance business</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full border-8 border-neutral-100 flex items-center justify-center mb-4">
                        <span className={`text-3xl font-bold ${getScoreColor()}`}>{score}</span>
                        <span className="text-sm absolute bottom-1">out of 100</span>
                    </div>
                    <h3 className={`text-lg font-semibold ${getScoreColor()} mb-2`}>{getScoreText()}</h3>
                    <Progress value={score} className={`w-full h-2 ${getProgressColor()}`} />

                    <div className="mt-6 w-full space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Payment Protection</span>
                            <span className="text-sm font-medium">{Math.min(100, score + 5)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Scope Definition</span>
                            <span className="text-sm font-medium">{Math.max(0, score - 10)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Intellectual Property</span>
                            <span className="text-sm font-medium">{Math.min(100, score + 15)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Termination Terms</span>
                            <span className="text-sm font-medium">{Math.max(0, score - 5)}%</span>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col border-t p-4">
                <Button
                    variant="outline"
                    className="w-full flex items-center gap-2"
                    onClick={() => setShowShareOptions(!showShareOptions)}
                >
                    <Share2 className="h-4 w-4" /> Share Your Score
                </Button>

                {showShareOptions && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={shareOnTwitter}>
                            <Twitter className="h-4 w-4" /> Twitter
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={shareOnFacebook}>
                            <Facebook className="h-4 w-4" /> Facebook
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={shareOnLinkedIn}>
                            <Linkedin className="h-4 w-4" /> LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy Link
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}


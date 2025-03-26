"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RegionSelector } from "@/components/region-selector"
import { Loader2, ArrowRight, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const industries = [
    {
        id: "web_development",
        title: "Web Development",
        description: "Websites, web apps, and online services",
        icon: "💻",
    },
    {
        id: "graphic_design",
        title: "Graphic Design",
        description: "Visual design, branding, and illustration",
        icon: "🎨",
    },
    {
        id: "content_creation",
        title: "Content Creation",
        description: "Writing, editing, and content strategy",
        icon: "✍️",
    },
    {
        id: "marketing",
        title: "Marketing",
        description: "Digital marketing, SEO, and advertising",
        icon: "📈",
    },
    {
        id: "consulting",
        title: "Consulting",
        description: "Professional advice and expertise",
        icon: "💼",
    },
]

export function IndustryOnboarding() {
    const router = useRouter()
    const { toast } = useToast()
    const [industry, setIndustry] = useState("")
    const [region, setRegion] = useState("US")
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState(1)

    const handleSubmit = async () => {
        if (!industry) {
            toast({
                title: "Please select an industry",
                description: "Select your industry to continue",
                variant: "destructive",
            })
            return
        }

        try {
            setIsLoading(true)

            // In a real implementation, we would save the user preferences to the database
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

            // Move to next step or complete onboarding
            if (step === 1) {
                setStep(2)
            } else {
                // Save preferences and redirect to dashboard
                await fetch("/api/user/preferences", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ industry, region }),
                })

                router.push("/dashboard")

                toast({
                    title: "Preferences saved",
                    description: "Your industry and region preferences have been saved.",
                })
            }
        } catch (error) {
            console.error("Error saving preferences:", error)
            toast({
                title: "Error",
                description: "Failed to save your preferences. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container max-w-lg mx-auto px-4 py-16">
            <Card className="border-2">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome to ContractScan</CardTitle>
                    <CardDescription>Let's personalize your experience to better protect your freelance business</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                    <span className="text-xl">1</span>
                                </div>
                                <h3 className="text-lg font-medium">What's your industry?</h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    We'll customize your contract analysis based on your industry's specific needs.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {industries.map((ind) => (
                                    <div
                                        key={ind.id}
                                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${industry === ind.id
                                                ? "border-primary bg-primary/5"
                                                : "border-neutral-200 hover:border-primary/50 hover:bg-neutral-50"
                                            }`}
                                        onClick={() => setIndustry(ind.id)}
                                    >
                                        <div className="mr-4 text-2xl">{ind.icon}</div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{ind.title}</h4>
                                            <p className="text-sm text-neutral-500">{ind.description}</p>
                                        </div>
                                        {industry === ind.id && <CheckCircle className="h-5 w-5 text-primary ml-2" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                                    <span className="text-xl">2</span>
                                </div>
                                <h3 className="text-lg font-medium">Where are you based?</h3>
                                <p className="text-sm text-neutral-500 mt-1">
                                    We'll check for region-specific legal requirements that apply to your contracts.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <RegionSelector value={region} onChange={setRegion} />
                                <p className="text-xs text-neutral-500 mt-1">
                                    This helps us ensure your contracts comply with local freelancer protection laws.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-6">
                    {step === 1 ? (
                        <div className="w-full">
                            <Button
                                className="w-full bg-primary hover:bg-primary/90 text-white"
                                onClick={handleSubmit}
                                disabled={isLoading || !industry}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="w-full flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <Button variant="outline" onClick={() => setStep(1)} disabled={isLoading} className="flex-1">
                                Back
                            </Button>
                            <Button
                                className="flex-1 bg-primary hover:bg-primary/90 text-white"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Complete Setup
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}


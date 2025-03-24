"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/hooks/use-toast"

export default function PricingPage() {
  const router = useRouter()
  const { isSignedIn, isLoaded } = useUser()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    if (!isLoaded) return

    if (!isSignedIn) {
      // Redirect to sign up page
      router.push(`/sign-up?plan=${plan}`)
      return
    }

    try {
      setIsLoading(plan)

      // Call the API to create a checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()

      // Redirect to Stripe checkout
      window.location.href = url
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                CS
              </div>
              <span className="ml-2 text-xl font-bold text-primary">ContractScan</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/pricing" className="text-primary font-medium hover:text-primary/90 transition">
              Pricing
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary transition">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isLoaded && !isSignedIn ? (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-primary hover:bg-primary/90 text-white">Try For Free</Button>
                </Link>
              </>
            ) : isLoaded && isSignedIn ? (
              <Link href="/dashboard">
                <Button className="bg-primary hover:bg-primary/90 text-white">Dashboard</Button>
              </Link>
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 bg-neutral-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-neutral-600">
              Start with a free trial, then choose the plan that's right for your freelance business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <Card className="border-2 border-neutral-200">
              <CardHeader>
                <CardTitle className="text-xl">Free Trial</CardTitle>
                <CardDescription>Perfect for trying out ContractScan</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-neutral-500 ml-2">for 3 days</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Analyze up to 3 contracts",
                    "Identify high-risk clauses",
                    "Get suggested alternatives",
                    "Basic contract history",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => router.push("/sign-up")}
                  disabled={isLoading === "trial"}
                >
                  {isLoading === "trial" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Start Free Trial"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Monthly Plan */}
            <Card className="border-2 border-primary relative lg:scale-105 shadow-lg">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-md rounded-tr-md">
                MOST POPULAR
              </div>
              <CardHeader>
                <CardTitle className="text-xl">Monthly</CardTitle>
                <CardDescription>Flexible month-to-month plan</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$15</span>
                  <span className="text-neutral-500 ml-2">per month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "Unlimited contract analysis",
                    "Identify all risk levels",
                    "Get suggested alternatives",
                    "Full contract history",
                    "Export to PDF",
                    "Priority support",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => handleSubscribe("monthly")}
                  disabled={!!isLoading}
                >
                  {isLoading === "monthly" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Annual Plan */}
            <Card className="border-2 border-neutral-200">
              <CardHeader>
                <CardTitle className="text-xl">Annual</CardTitle>
                <CardDescription>Save 20% with annual billing</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$144</span>
                  <span className="text-neutral-500 ml-2">per year</span>
                  <div className="text-sm text-[#10B981] font-medium mt-1">Save $36 compared to monthly</div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {[
                    "All Monthly plan features",
                    "Unlimited contract analysis",
                    "Identify all risk levels",
                    "Get suggested alternatives",
                    "Full contract history",
                    "Export to PDF",
                    "Priority support",
                    "Early access to new features",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[#10B981] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => handleSubscribe("yearly")}
                  disabled={!!isLoading}
                >
                  {isLoading === "yearly" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {[
                {
                  question: "Do I need a credit card to start the free trial?",
                  answer:
                    "No, you can start your free trial without entering any payment information. We'll only ask for payment details if you decide to continue with a paid plan after your trial ends.",
                },
                {
                  question: "Can I cancel my subscription at any time?",
                  answer:
                    "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to ContractScan until the end of your current billing period.",
                },
                {
                  question: "Is there a limit to how many contracts I can analyze?",
                  answer:
                    "Free trial users can analyze up to 3 contracts. Paid plans (both Monthly and Annual) include unlimited contract analysis.",
                },
                {
                  question: "What file formats do you support for contract uploads?",
                  answer:
                    "ContractScan supports PDF, DOCX, DOC, and TXT file formats. You can also paste contract text directly into our analysis tool.",
                },
                {
                  question: "Is my contract data secure?",
                  answer:
                    "Yes, we take security seriously. All contracts are encrypted in transit and at rest. We never share your contract data with third parties, and you can delete your data at any time.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg border border-neutral-200">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-50 border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-neutral-600">&copy; {new Date().getFullYear()} ContractScan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}


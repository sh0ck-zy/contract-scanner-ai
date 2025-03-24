import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle, FileText, Shield, Sparkles } from "lucide-react"

export default function AboutPage() {
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
            <Link href="/pricing" className="text-neutral-700 hover:text-primary transition">
              Pricing
            </Link>
            <Link href="/about" className="text-primary font-medium hover:text-primary/90 transition">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-white">Try For Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl font-bold mb-6">How ContractScan Works</h1>
              <p className="text-xl text-neutral-600">
                Our AI-powered contract analysis helps freelancers identify and fix problematic clauses before signing.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-primary/20 hidden md:block"></div>

                {[
                  {
                    title: "Upload Your Contract",
                    description: "Upload your contract document or paste the text directly into ContractScan.",
                    icon: <FileText className="h-8 w-8 text-white" />,
                  },
                  {
                    title: "AI Analysis",
                    description:
                      "Our advanced AI analyzes your contract for problematic clauses, unfair terms, and potential risks.",
                    icon: <Sparkles className="h-8 w-8 text-white" />,
                  },
                  {
                    title: "Risk Assessment",
                    description:
                      "Each issue is categorized by risk level and explained in plain language so you understand the implications.",
                    icon: <AlertCircle className="h-8 w-8 text-white" />,
                  },
                  {
                    title: "Suggested Alternatives",
                    description:
                      "For each problematic clause, ContractScan provides alternative language you can use in negotiations.",
                    icon: <Shield className="h-8 w-8 text-white" />,
                  },
                  {
                    title: "Sign with Confidence",
                    description: "Review the analysis, make necessary changes, and sign your contract with confidence.",
                    icon: <CheckCircle className="h-8 w-8 text-white" />,
                  },
                ].map((step, index) => (
                  <div key={index} className="flex mb-12 relative">
                    <div className="mr-8 relative">
                      <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center z-10 relative">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1 pt-3">
                      <h2 className="text-2xl font-bold mb-2">{step.title}</h2>
                      <p className="text-neutral-600">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">What ContractScan Looks For</h2>
              <p className="text-xl text-neutral-600">
                Our AI is trained to identify these common contract issues that can harm freelancers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Payment Terms",
                  description:
                    "Identifies unfavorable payment schedules, vague payment conditions, and missing late payment penalties.",
                  example: "Payment will be made within 60 days of invoice submission.",
                  risk: "High",
                },
                {
                  title: "Scope Creep",
                  description: "Flags undefined deliverables, unlimited revisions, and ambiguous project boundaries.",
                  example: "Contractor will make revisions until Client is completely satisfied.",
                  risk: "High",
                },
                {
                  title: "Intellectual Property",
                  description: "Identifies unfair copyright transfers and IP assignments without proper compensation.",
                  example: "All work product, including unused concepts, becomes the exclusive property of Client.",
                  risk: "Medium",
                },
                {
                  title: "Termination Clauses",
                  description:
                    "Highlights one-sided termination rights and missing kill fees for project cancellations.",
                  example: "Client may terminate this agreement at any time without compensation to Contractor.",
                  risk: "High",
                },
                {
                  title: "Liability Issues",
                  description: "Detects unlimited liability clauses and unreasonable indemnification requirements.",
                  example: "Contractor shall indemnify Client against all claims, regardless of fault.",
                  risk: "Medium",
                },
                {
                  title: "Non-Compete Terms",
                  description:
                    "Identifies overly restrictive non-compete clauses that limit your future work opportunities.",
                  example: "Contractor shall not work for any competing business for 2 years after termination.",
                  risk: "Medium",
                },
              ].map((issue, index) => (
                <Card key={index} className="overflow-hidden">
                  <div
                    className={`h-2 ${
                      issue.risk === "High" ? "bg-[#EF4444]" : issue.risk === "Medium" ? "bg-[#F59E0B]" : "bg-[#10B981]"
                    }`}
                  ></div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{issue.title}</h3>
                    <p className="text-neutral-600 mb-4">{issue.description}</p>
                    <div className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
                      <p className="text-sm font-mono text-neutral-700">{issue.example}</p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            issue.risk === "High"
                              ? "bg-[#EF4444]/10 text-[#EF4444]"
                              : issue.risk === "Medium"
                                ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                                : "bg-[#10B981]/10 text-[#10B981]"
                          }`}
                        >
                          {issue.risk} Risk
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Freelance Business?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start analyzing your contracts today and negotiate with confidence.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-primary hover:bg-neutral-100 font-medium py-2 px-6 rounded-md transition duration-200 text-lg">
                Try ContractScan Free
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-neutral-50 border-t border-neutral-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                  CS
                </div>
                <span className="ml-2 text-xl font-bold text-primary">ContractScan</span>
              </div>
              <p className="text-neutral-600 mb-4">
                AI-powered contract analysis for freelancers and small businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-neutral-600 hover:text-primary transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-neutral-600 hover:text-primary transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-neutral-600 hover:text-primary transition">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-neutral-600 hover:text-primary transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-neutral-600 hover:text-primary transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-neutral-600 hover:text-primary transition">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-neutral-600 hover:text-primary transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-neutral-600 hover:text-primary transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-neutral-600">
            <p>&copy; {new Date().getFullYear()} ContractScan. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


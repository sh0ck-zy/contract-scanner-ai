import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertCircle, Edit, ShieldCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
              CS
            </div>
            <span className="ml-2 text-xl font-bold text-primary">ContractScan</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link href="/pricing" className="text-neutral-700 hover:text-primary transition">
              Pricing
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary transition">
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
        <section className="py-20">
          <div className="container mx-auto px-4 md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-700">
                Protect Your Freelance Business with AI Contract Analysis
              </h1>
              <p className="text-xl text-neutral-600 mb-8">
                ContractScan analyzes your client contracts in seconds, highlighting risky clauses and suggesting fair
                alternatives.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup">
                  <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border border-primary text-primary hover:bg-primary/10 font-medium py-2 px-4 rounded-md transition duration-200"
                  >
                    See How It Works
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <ContractAnalysisAnimation />
            </div>
          </div>
        </section>

        <section className="py-16 bg-neutral-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How ContractScan Protects You</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="h-12 w-12 text-primary" />,
                  title: "Identify Risky Clauses",
                  description: "AI technology scans your contracts for unfair terms and liability issues.",
                },
                {
                  icon: <AlertCircle className="h-12 w-12 text-[#F59E0B]" />,
                  title: "Get Plain-Language Explanations",
                  description: "Understand exactly why certain clauses could harm your business.",
                },
                {
                  icon: <Edit className="h-12 w-12 text-[#0D9488]" />,
                  title: "Suggest Better Alternatives",
                  description: "Receive professionally-written replacement text you can use immediately.",
                },
              ].map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                  <div className="mb-4 inline-block">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Freelancers Trust ContractScan</h2>
              <p className="text-xl text-neutral-600">
                Join thousands of freelancers who protect their business with our AI-powered contract analysis.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  quote:
                    "ContractScan saved me from signing a contract with hidden scope creep. The alternative clause they suggested was accepted by my client without question.",
                  author: "Sarah J., Web Developer",
                },
                {
                  quote:
                    "I used to spend hours reading contracts and still missed important details. Now I can analyze a contract in minutes and negotiate with confidence.",
                  author: "Michael T., Graphic Designer",
                },
                {
                  quote:
                    "As a new freelancer, I had no idea what to look for in contracts. ContractScan is like having a legal advisor in my pocket at a fraction of the cost.",
                  author: "Elena R., Content Writer",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow transition duration-200 p-6"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4 text-[#F59E0B]">{"★".repeat(5)}</div>
                    <p className="text-neutral-700 mb-6 flex-grow">{testimonial.quote}</p>
                    <p className="font-medium text-neutral-900">{testimonial.author}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link href="/signup">
                <Button className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md transition duration-200">
                  Try ContractScan Free
                </Button>
              </Link>
            </div>
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
                  <Link href="/how-it-works" className="text-neutral-600 hover:text-primary transition">
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

function ContractAnalysisAnimation() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-neutral-200 relative overflow-hidden h-[400px]">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div
            className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 font-mono text-sm overflow-hidden"
            style={{ maxHeight: 320 }}
          >
            <div className="py-0.5">CONTRACT AGREEMENT</div>
            <div className="py-0.5"></div>
            <div className="py-0.5">This Agreement is made between Client and Freelancer.</div>
            <div className="py-0.5"></div>
            <div className="py-0.5">1. SERVICES</div>
            <div className="py-0.5">Freelancer will provide the following services: [Description of services]</div>
            <div className="py-0.5"></div>
            <div className="py-0.5">2. PAYMENT</div>
            <div className="py-0.5 bg-[#EF4444]/10 -mx-4 px-4">
              Client will pay Freelancer $X for services rendered. Payment will be made within 30 days of invoice.
            </div>
            <div className="py-0.5"></div>
            <div className="py-0.5">3. REVISIONS</div>
            <div className="py-0.5">Freelancer agrees to provide unlimited revisions until Client is satisfied.</div>
            <div className="py-0.5"></div>
            <div className="py-0.5">4. COPYRIGHT</div>
            <div className="py-0.5">Upon full payment, all rights to the work transfer to Client.</div>
            <div className="py-0.5"></div>
            <div className="py-0.5">5. TERMINATION</div>
            <div className="py-0.5">
              Client may terminate this agreement at any time without compensation to Freelancer.
            </div>
          </div>

          <div className="mt-4 bg-white p-3 rounded-lg border border-neutral-200 shadow-sm">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-[#EF4444] flex-shrink-0 mt-0.5 mr-2" />
              <div>
                <p className="font-medium text-sm text-[#EF4444]">Issue Detected</p>
                <p className="text-sm text-neutral-600 mt-1">
                  30-day payment terms may be too long for freelancers' cash flow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


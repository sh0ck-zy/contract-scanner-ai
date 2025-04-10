import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  CheckCircle,
  Shield,
  FileText,
  Eye,
  Star,
  DollarSign,
  Scale,
  AlertTriangle,
  Users,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  MessageSquare,
  Clock,
} from "lucide-react"
import { FloatingCTA } from "@/components/floating-cta"

// This page doesn't require authentication
export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">ContractScan</span>
            </Link>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium flex-1">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">Features</Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">How It Works</Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">Pricing</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90">Sign Up Free</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-white to-blue-50">
          <div className="responsive-container">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                  Trusted by 5,000+ freelancers
                </div>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-primary">AI Contract Analysis</span> for Freelancers
              </h1>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Don't sign another unfair contract. Our AI identifies risky clauses, explains issues in plain language, and suggests better alternatives tailored for freelance work.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-md shadow-lg">
                    Analyze Your Contract Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                    See How It Works
                  </Button>
                </div>
                <p className="text-sm text-gray-600">No credit card required • 3 free analyses</p>
                
                <div className="pt-6 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <Avatar key={i} className="border-2 border-background w-8 h-8">
                        <AvatarFallback>{`U${i}`}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      <strong>4.9/5</strong> from 230+ reviews
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="relative bg-white rounded-xl border shadow-md overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-accent text-white text-xs font-medium rounded-bl-lg">
                  LIVE DEMO
                </div>
                <div className="p-5">
                  <div className="mb-4 pb-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">FREELANCE DESIGN AGREEMENT</span>
                  </div>
                  
                  <div className="font-mono text-sm space-y-1">
                    <div className="py-1">4. REVISIONS</div>
                    <div className="py-1 bg-red-50 border-l-4 border-red-400 pl-3 pr-4 relative animate-pulse-slow">
                      <span>Designer agrees to provide <span className="font-bold text-red-600">unlimited revisions</span> until Client is satisfied.</span>
                      <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 translate-x-full">
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 px-2 py-0.5">
                          <AlertTriangle className="h-3 w-3" /> High Risk
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-white border border-gray-200 rounded-md shadow-sm p-4">
                      <h4 className="font-medium text-red-800 flex items-center text-sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Unlimited Revisions Risk
                      </h4>
                      <p className="mt-2 text-sm text-gray-600">This clause creates unlimited unpaid work potential. There's no cap on revisions, which could lead to scope creep and profitability issues.</p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <h5 className="text-xs font-medium text-green-800 uppercase">Suggested Alternative</h5>
                        <p className="mt-1 text-sm text-gray-900 font-mono bg-green-50 p-2 rounded border border-green-100">
                          Designer will provide <span className="font-bold text-green-700">up to two (2) rounds of revisions</span> at no additional cost. Additional revisions will be billed at Designer's hourly rate of $X.
                        </p>
                        <Button variant="ghost" size="sm" className="mt-2 text-xs flex items-center text-primary hover:text-primary/80 p-0 h-auto">
                          <Copy className="h-3 w-3 mr-1" /> Copy suggestion
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="responsive-container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                AI-Powered Protection for Freelancers
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We've designed ContractScan specifically for the challenges freelancers face
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<AlertTriangle className="h-8 w-8 text-warning" />}
                title="Risk Detection"
                description="Identify unfair clauses and potential red flags in client contracts before you sign."
                painPoint="Never get stuck with unfair terms again"
                freelancerType="For designers tired of unlimited revision requests"
              />
              
              <FeatureCard 
                icon={<Eye className="h-8 w-8 text-accent" />}
                title="Plain Language Explanations"
                description="Complex legal jargon translated into simple terms anyone can understand."
                painPoint="No more confused Googling of legal terms"
                freelancerType="For writers who want to understand what they're signing"
              />
              
              <FeatureCard 
                icon={<FileText className="h-8 w-8 text-primary" />}
                title="Suggested Alternatives"
                description="Get professionally-written replacement text you can use to counter unfair terms."
                painPoint="Negotiate confidently with ready-to-use language"
                freelancerType="For developers who hate contract negotiations"
              />
              
              <FeatureCard 
                icon={<Clock className="h-8 w-8 text-success" />}
                title="Fast Analysis"
                description="Upload your contract and get a complete analysis in under 60 seconds."
                painPoint="No more waiting days for expensive legal reviews"
                freelancerType="For busy freelancers with tight deadlines"
              />
              
              <FeatureCard 
                icon={<DollarSign className="h-8 w-8 text-primary" />}
                title="Payment Protection"
                description="Identify missing payment terms and ensure you're protected against non-payment."
                painPoint="Secure your cash flow and prevent payment disputes"
                freelancerType="For freelancers who've been burned by late payments"
              />
              
              <FeatureCard 
                icon={<Scale className="h-8 w-8 text-accent" />}
                title="Scope Creep Prevention"
                description="Flag vague deliverable descriptions and unlimited revision clauses."
                painPoint="Keep projects defined and prevent unpaid extra work"
                freelancerType="For anyone who's dealt with 'just one more small change'"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-gradient-to-t from-blue-50 to-white">
          <div className="responsive-container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                How ContractScan Works
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Get insights and protection in three simple steps
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <StepCard 
                number="1"
                title="Upload Your Contract"
                description="Paste your contract text or upload a PDF document to our secure platform."
              />
              <StepCard 
                number="2"
                title="AI Analysis"
                description="Our AI reviews the contract, identifying potentially risky clauses and terms."
              />
              <StepCard 
                number="3"
                title="Get Actionable Insights"
                description="Receive a detailed report with explanations and suggestions for improvement."
              />
                </div>
            
            <div className="mt-12 text-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-md">
                Try It For Free
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials and Social Proof Section */}
        <section className="py-16 bg-muted">
          <div className="responsive-container">
            <div className="text-center mb-10">
              <h2 className="font-display text-3xl font-bold mb-4">
                Trusted by Freelancers Everywhere
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Join thousands of freelancers who protect their business with ContractScan
              </p>
            </div>

            {/* Usage statistics with animated counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              <StatCard 
                value="15,432" 
                label="Contracts Analyzed" 
                icon={<FileText className="h-6 w-6 text-primary" />} 
              />
              <StatCard 
                value="$2.3M" 
                label="Income Protected" 
                icon={<DollarSign className="h-6 w-6 text-success" />} 
              />
              <StatCard 
                value="94%" 
                label="Success Rate" 
                icon={<CheckCircle className="h-6 w-6 text-success" />} 
              />
              <StatCard 
                value="4.9/5" 
                label="Client Satisfaction" 
                icon={<Star className="h-6 w-6 text-warning" />} 
              />
            </div>
            
            {/* Testimonial cards */}
            <div className="grid md:grid-cols-3 gap-8">
              <TestimonialCard
                name="Sarah Johnson"
                role="Web Designer"
                quote="ContractScan saved me from signing a contract with hidden scope creep. The alternative clause they suggested was accepted by my client without question."
                rating={5}
              />
              <TestimonialCard
                name="Michael Torres"
                role="Freelance Developer"
                quote="I used to spend hours reading contracts and still missed important details. Now I can analyze a contract in minutes and negotiate with confidence."
                rating={5}
              />
              <TestimonialCard
                name="Elena Rodriguez"
                role="Content Writer"
                quote="As a new freelancer, I had no idea what to look for in contracts. ContractScan is like having a legal advisor in my pocket at a fraction of the cost."
                rating={5}
              />
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="responsive-container">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Choose the plan that works for your freelance business needs
              </p>
            </div>

            {/* Monthly/Annual toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-muted p-1 rounded-full inline-flex">
                <Button variant="default" size="sm" className="rounded-full px-4">Monthly</Button>
                <Button variant="ghost" size="sm" className="rounded-full px-4">Annual (Save 20%)</Button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free tier */}
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="p-6 border-b">
                  <h3 className="font-bold text-xl mb-1">Free</h3>
                  <p className="text-muted-foreground text-sm mb-4">Try before you subscribe</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground ml-2">/forever</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <PricingFeature included>3 contract analyses per month</PricingFeature>
                    <PricingFeature included>Basic risk detection</PricingFeature>
                    <PricingFeature included>Up to 5 pages per contract</PricingFeature>
                    <PricingFeature>Advanced clause suggestions</PricingFeature>
                    <PricingFeature>Priority support</PricingFeature>
                  </ul>
                  <Button className="mt-6 w-full border border-primary text-primary bg-white hover:bg-primary/10">
                    Get Started Free
                  </Button>
                </div>
              </div>
              
              {/* Pro tier - with "Most Popular" badge */}
              <div className="bg-white rounded-lg border-2 border-primary shadow-md overflow-hidden transition-all relative">
                <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
                <div className="p-6 border-b">
                  <h3 className="font-bold text-xl mb-1">Pro</h3>
                  <p className="text-muted-foreground text-sm mb-4">For active freelancers</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$19</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <PricingFeature included>Unlimited contract analyses</PricingFeature>
                    <PricingFeature included>Advanced risk detection</PricingFeature>
                    <PricingFeature included>Up to 30 pages per contract</PricingFeature>
                    <PricingFeature included>Advanced clause suggestions</PricingFeature>
                    <PricingFeature included>Priority support</PricingFeature>
                  </ul>
                  <Button className="mt-6 w-full bg-primary hover:bg-primary/90 shadow-md">
                    Start 7-Day Free Trial
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    No credit card required for trial
                  </p>
                </div>
              </div>
              
              {/* Business tier */}
              <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div className="p-6 border-b">
                  <h3 className="font-bold text-xl mb-1">Agency</h3>
                  <p className="text-muted-foreground text-sm mb-4">For teams and agencies</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">$49</span>
                    <span className="text-muted-foreground ml-2">/month</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-4">
                    <PricingFeature included>Everything in Pro</PricingFeature>
                    <PricingFeature included>Team access (5 users)</PricingFeature>
                    <PricingFeature included>Custom contract templates</PricingFeature>
                    <PricingFeature included>Bulk contract analysis</PricingFeature>
                    <PricingFeature included>Dedicated account manager</PricingFeature>
                  </ul>
                  <Button variant="outline" className="mt-6 w-full">
                    Contact Sales
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h3 className="text-xl font-display font-bold mb-4">
                Have questions about our plans?
              </h3>
              <p className="text-muted-foreground mb-6">
                Contact our team for custom pricing or feature requests. We're happy to create a plan that meets your specific needs.
              </p>
              <Button variant="outline" className="bg-background">
                <MessageSquare className="mr-2 h-4 w-4" /> Schedule a Call
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary/5 border-y">
          <div className="responsive-container">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Protect your freelance business today
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join 5,000+ freelancers who use ContractScan to analyze contracts before signing
              </p>
              
              <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto mb-12">
                <div className="bg-white rounded-lg border-2 border-primary relative overflow-hidden shadow-md p-6">
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-white text-xs font-bold rounded-bl-lg">
                    MOST POPULAR
                  </div>
                  <div className="text-center space-y-4">
                    <h3 className="font-medium text-lg">Analyze a Contract</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload an existing client contract to identify potential issues
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90 shadow-md">
                      Analyze Now - Free
                    </Button>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-border shadow-sm p-6">
                  <div className="text-center space-y-4">
                    <h3 className="font-medium text-lg">Generate a Contract</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a fair, balanced contract using our freelancer-friendly templates
                    </p>
                    <Button variant="outline" className="w-full">
                      Start Building
                </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-primary" />
                <span>No credit card required • Cancel anytime • 100% secure</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-muted/30 border-t">
        <div className="responsive-container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-xl">ContractScan</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered contract analysis built specifically for freelancers
              </p>
              <div className="flex space-x-4">
                <SocialLink icon={<Twitter className="h-4 w-4" />} href="#" label="Twitter" />
                <SocialLink icon={<Linkedin className="h-4 w-4" />} href="#" label="LinkedIn" />
                <SocialLink icon={<Facebook className="h-4 w-4" />} href="#" label="Facebook" />
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <FooterLink href="/blog">Freelance Contract Guide</FooterLink>
                <FooterLink href="/templates">Contract Templates</FooterLink>
                <FooterLink href="/guides">Payment Protection Tips</FooterLink>
                <FooterLink href="/webinars">Free Webinars</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/testimonials">Customer Stories</FooterLink>
                <FooterLink href="/pricing">Pricing</FooterLink>
                <FooterLink href="/contact">Contact</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/gdpr">GDPR Compliance</FooterLink>
                <FooterLink href="/security">Security</FooterLink>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} ContractScan AI. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded">SOC 2 Compliant</div>
              <div className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded">GDPR Compliant</div>
              <div className="text-xs text-muted-foreground px-3 py-1 bg-muted rounded">256-bit Encryption</div>
            </div>
          </div>
        </div>
      </footer>

      <FloatingCTA />
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description, painPoint, freelancerType }: { icon: React.ReactNode, title: string, description: string, painPoint: string, freelancerType: string }) {
  return (
    <div className="group relative rounded-lg border p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md overflow-hidden">
      <div className="mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
          <span className="text-sm font-medium">{painPoint}</span>
        </div>
        <div className="flex items-start gap-2">
          <Users className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
          <span className="text-sm text-muted-foreground">{freelancerType}</span>
            </div>
            </div>
          </div>
  )
}

// Step Card Component
function StepCard({ number, title, description }: { number: string, title: string, description: string }) {
  return (
    <div className="relative rounded-lg border p-6 shadow-sm bg-card">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <span className="text-xl font-bold">{number}</span>
      </div>
      <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

// Pricing Feature Component
function PricingFeature({ children, included = false }: { children: React.ReactNode, included?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      {included ? (
        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
      ) : (
        <svg className="h-5 w-5 text-muted-foreground/40 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      )}
      <span className={included ? "" : "text-muted-foreground"}>{children}</span>
    </li>
  )
}

// Stat Card Component
function StatCard({ value, label, icon }: { value: string, label: string, icon: React.ReactNode }) {
  return (
    <div className="text-center">
      <div className="inline-flex p-3 rounded-full bg-background mb-4">
        {icon}
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ name, role, quote, rating }: { name: string, role: string, quote: string, rating: number }) {
  return (
    <div className="bg-card rounded-lg shadow-sm p-6 border relative">
      <div className="absolute -top-4 left-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          {role}
        </span>
              </div>
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-muted overflow-hidden mr-4 flex items-center justify-center">
          {name.charAt(0)}
            </div>
        <div>
          <h4 className="font-medium">{name}</h4>
          <div className="flex text-warning text-sm">
            {Array(rating).fill(0).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warning" />
            ))}
          </div>
        </div>
      </div>
      <p className="text-muted-foreground italic">"{quote}"</p>
    </div>
  )
}

// Social Link Component
function SocialLink({ icon, href, label }: { icon: React.ReactNode, href: string, label: string }) {
  return (
    <a 
      href={href} 
      aria-label={label}
      className="h-8 w-8 flex items-center justify-center rounded-full bg-background hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
    >
      {icon}
    </a>
  )
}

// Footer Link Component
function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <li>
      <a 
        href={href} 
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </a>
    </li>
  )
}


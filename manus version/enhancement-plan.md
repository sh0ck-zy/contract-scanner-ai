# ContractScan: Strategic Enhancement Plan

Based on our market analysis and codebase review, here's a comprehensive enhancement plan to transform ContractScan into a market-leading legal tool for freelancers.

## Market Analysis Summary

Our market research identified these key insights:
- US-based web developers and designers (2-5 years experience, $70K-$150K income) are the most promising early adopters
- Payment protection, scope creep prevention, and regulatory compliance are the top pain points
- Freelancers need both speed and legal confidence, a combination currently underserved in the market
- Community-based marketing and educational content are the most effective acquisition channels

## Current Codebase Assessment

The existing application has a solid foundation:
- Modern Next.js architecture with clean component structure
- OpenAI integration for basic contract analysis
- Subscription model with Stripe integration
- User authentication via Clerk
- Clean UI with good user experience flow

## Strategic Enhancement Recommendations

### 1. Core AI Analysis Engine Improvements

#### Industry-Specific Analysis Models
```typescript
// lib/ai/analyze-contract-enhanced.ts

import OpenAI from "openai";
import { getIndustrySpecificPrompt } from "./industry-prompts";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContractIssue {
  type: string;
  text: string;
  explanation: string;
  suggestion: string;
  severityScore: number;
  industryRelevance: string[];
}

export interface ContractAnalysis {
  riskLevel: "High" | "Medium" | "Low";
  issues: ContractIssue[];
  recommendedActions: string[];
  complianceFlags: string[];
  industrySpecificRisk?: {
    [key: string]: number;
  };
}

export async function analyzeContractAdvanced(
  contractText: string,
  industry: string = "general",
  region: string = "US"
): Promise<ContractAnalysis> {
  // Get industry-specific prompt
  const industryPrompt = getIndustrySpecificPrompt(industry, region);
  
  const prompt = `
    You are an expert contract reviewer for freelancers in the ${industry} industry. 
    Analyze this contract for problematic clauses that could harm a freelancer.
    
    ${industryPrompt}
    
    Format your response as JSON with the following structure:
    {
      "riskLevel": "High/Medium/Low",
      "issues": [
        {
          "type": "Revision Policy",
          "text": "quoted text here",
          "explanation": "explanation here",
          "suggestion": "suggested alternative here",
          "severityScore": 8,
          "industryRelevance": ["web development", "design"]
        }
      ],
      "recommendedActions": [
        "Negotiate revision terms before signing",
        "Clarify payment schedule"
      ],
      "complianceFlags": [
        "California FWPA compliance issue",
        "Missing kill fee clause"
      ],
      "industrySpecificRisk": {
        "webDevelopment": 7,
        "graphicDesign": 5
      }
    }
    
    IMPORTANT: You must respond with a JSON object only, no additional text.
    
    Here is the contract to analyze:
    
    ${contractText}
  `;

  try {
    console.log("Starting advanced contract analysis...");

    // Use GPT-4 for enhanced analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Upgrade to GPT-4o for better analysis
      messages: [
        { role: "system", content: "You are a contract analysis expert for freelancers in the " + industry + " industry. You will respond with JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    });

    console.log("OpenAI response received");

    try {
      const result = JSON.parse(response.choices[0].message.content) as ContractAnalysis;
      return result;
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw response:", response.choices[0].message.content);

      // Fallback response in case of parsing error
      return {
        riskLevel: "Medium",
        issues: [
          {
            type: "API Error",
            text: "Error processing contract",
            explanation: "We encountered an error while analyzing your contract. Our system wasn't able to process it correctly.",
            suggestion: "Please try again with a simpler contract text or contact support if the issue persists.",
            severityScore: 5,
            industryRelevance: ["general"]
          }
        ],
        recommendedActions: ["Try again or contact support"],
        complianceFlags: []
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze contract");
  }
}
```

#### Industry-Specific Prompts
```typescript
// lib/ai/industry-prompts.ts

interface IndustryPrompt {
  focusAreas: string;
  commonIssues: string;
  regionSpecific?: Record<string, string>;
}

const industryPrompts: Record<string, IndustryPrompt> = {
  "web_development": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Unlimited revisions without additional payment
      2. Ownership of code and intellectual property rights
      3. Vague project scope that enables scope creep
      4. Payment terms longer than 15 days or with unclear milestones
      5. Hosting and maintenance responsibilities
      6. Warranty periods and liability for bugs/issues
      7. Browser/device compatibility requirements
    `,
    commonIssues: `
      Common issues in web development contracts:
      - Unclear definition of "project completion"
      - Missing provisions for third-party integrations
      - Ambiguous acceptance testing procedures
      - Lack of clear change request process
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for GDPR compliance requirements and data processing clauses"
    }
  },
  "graphic_design": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Unlimited revisions without additional payment
      2. Full copyright transfer without adequate compensation
      3. Vague deliverable descriptions
      4. Usage rights limitations
      5. Client's ability to reject work subjectively
      6. Requirements to provide source files without additional payment
      7. Lack of kill fee or cancellation terms
    `,
    commonIssues: `
      Common issues in graphic design contracts:
      - Unclear ownership of unused concepts
      - Missing provisions for additional usage rights
      - Ambiguous approval processes
      - Lack of clear revision limits
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for moral rights provisions and copyright assignment limitations"
    }
  },
  "content_creation": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Work-for-hire clauses without adequate compensation
      2. Byline and credit requirements
      3. Exclusivity clauses
      4. Reuse and republication rights
      5. Indemnification for factual accuracy
      6. Editing and revision expectations
      7. Kill fees and cancellation terms
    `,
    commonIssues: `
      Common issues in content creation contracts:
      - Unclear ownership of research materials
      - Missing provisions for additional usage
      - Ambiguous word count requirements
      - Lack of clear revision limits
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for moral rights provisions and right to be identified as author"
    }
  },
  "general": {
    focusAreas: `
      Focus specifically on identifying these red flags:
      1. Unlimited revisions without additional payment
      2. Full copyright transfer without adequate compensation
      3. Vague deliverable descriptions that enable scope creep
      4. Payment terms longer than 30 days or with unclear milestones
      5. Overly restrictive non-compete clauses
      6. Client ability to terminate without compensation
      7. Indemnification clauses that create unreasonable liability
    `,
    commonIssues: `
      Common issues in freelance contracts:
      - Unclear intellectual property rights
      - Missing provisions for additional work
      - Ambiguous completion criteria
      - Lack of clear payment terms
    `,
    regionSpecific: {
      "US": "Check for compliance with California FWPA and NY Freelance Isn't Free Act",
      "EU": "Check for compliance with EU freelancer protection regulations"
    }
  }
};

export function getIndustrySpecificPrompt(industry: string, region: string = "US"): string {
  const industryKey = industry in industryPrompts ? industry : "general";
  const prompt = industryPrompts[industryKey];
  
  let fullPrompt = prompt.focusAreas + "\n\n" + prompt.commonIssues;
  
  if (prompt.regionSpecific && prompt.regionSpecific[region]) {
    fullPrompt += "\n\n" + prompt.regionSpecific[region];
  }
  
  return fullPrompt;
}
```

### 2. Contract Template Generation

```typescript
// lib/ai/generate-contract.ts

import OpenAI from "openai";
import { getContractTemplate } from "./contract-templates";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContractRequirements {
  industry: string;
  projectType: string;
  clientName: string;
  freelancerName: string;
  projectDescription: string;
  deliverables: string[];
  timeline: string;
  paymentTerms: string;
  region: string;
}

export async function generateContract(requirements: ContractRequirements): Promise<string> {
  // Get base template for the industry and project type
  const template = getContractTemplate(requirements.industry, requirements.projectType, requirements.region);
  
  const prompt = `
    You are an expert contract generator for freelancers in the ${requirements.industry} industry.
    Create a professional contract based on the following requirements:
    
    Client Name: ${requirements.clientName}
    Freelancer Name: ${requirements.freelancerName}
    Project Description: ${requirements.projectDescription}
    Deliverables: ${requirements.deliverables.join(", ")}
    Timeline: ${requirements.timeline}
    Payment Terms: ${requirements.paymentTerms}
    Region: ${requirements.region}
    
    Use the following contract template as a starting point, but customize it to the specific project requirements:
    
    ${template}
    
    Make sure the contract includes:
    1. Clear scope of work with specific deliverables
    2. Well-defined payment terms with milestones
    3. Reasonable revision limits (max 2-3 rounds)
    4. Fair intellectual property terms that protect the freelancer
    5. Clear process for change requests
    6. Termination clauses that protect both parties
    7. Compliance with ${requirements.region} freelancer protection laws
    
    Format the contract professionally with proper legal structure and numbering.
  `;

  try {
    console.log("Generating contract...");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a contract generation expert for freelancers. Generate a professional, legally-sound contract." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    console.log("Contract generated successfully");
    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate contract");
  }
}
```

### 3. Enhanced API Routes

```typescript
// app/api/contracts/generate/route.ts

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { generateContract } from "@/lib/ai/generate-contract";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get DB user or create if it doesn't exist
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create user in database
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    // Check subscription for premium features
    if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL") {
      return new NextResponse("Subscription required for contract generation", { status: 403 });
    }

    // Get contract requirements from request
    const contractRequirements = await req.json();

    // Generate contract
    try {
      const contractText = await generateContract(contractRequirements);

      // Save to database
      const contract = await prisma.contract.create({
        data: {
          userId: dbUser.id,
          title: contractRequirements.projectType + " Contract for " + contractRequirements.clientName,
          originalText: contractText,
          metadata: {
            industry: contractRequirements.industry,
            region: contractRequirements.region,
            projectType: contractRequirements.projectType,
          },
          contractType: "GENERATED",
        },
      });

      return NextResponse.json({ 
        contractId: contract.id,
        contractText 
      });
    } catch (error) {
      console.error("Error in contract generation:", error);
      return new NextResponse("Contract generation failed", { status: 500 });
    }
  } catch (error) {
    console.error("Error generating contract:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

```typescript
// app/api/contracts/analyze/route.ts (Enhanced)

import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { analyzeContractAdvanced } from "@/lib/ai/analyze-contract-enhanced";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get DB user or create if it doesn't exist
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create user in database
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    // Check subscription
    if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL") {
      // Allow some free analyses
      const analysisCount = await prisma.contract.count({
        where: { userId: dbUser.id }
      });

      if (analysisCount >= 3) {
        return new NextResponse("Subscription required", { status: 403 });
      }
    }

    // Get contract data from request
    const { contractText, title, industry, region } = await req.json();

    if (!contractText) {
      return new NextResponse("Contract text is required", { status: 400 });
    }

    // Analyze contract using OpenAI with industry-specific model
    try {
      const analysis = await analyzeContractAdvanced(contractText, industry || "general", region || "US");

      // Save to database with enhanced schema
      const contract = await prisma.contract.create({
        data: {
          userId: dbUser.id,
          title: title || "Untitled Contract",
          originalText: contractText,
          riskLevel: analysis.riskLevel,
          metadata: {
            industry: industry || "general",
            region: region || "US",
            industrySpecificRisk: analysis.industrySpecificRisk
          },
          issues: {
            create: analysis.issues.map(issue => ({
              type: issue.type,
              text: issue.text,
              explanation: issue.explanation,
              suggestion: issue.suggestion,
              severityScore: issue.severityScore,
              industryRelevance: issue.industryRelevance
            }))
          },
          recommendedActions: analysis.recommendedActions,
          complianceFlags: analysis.complianceFlags
        },
        include: {
          issues: true
        }
      });

      return NextResponse.json(contract);
    } catch (error) {
      console.error("Error in OpenAI analysis:", error);
      return new NextResponse("AI analysis failed", { status: 500 });
    }
  } catch (error) {
    console.error("Error analyzing contract:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

### 4. Enhanced Frontend Components

#### Industry Selection Component
```tsx
// components/industry-selector.tsx

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const industries = [
  {
    value: "web_development",
    label: "Web Development",
    description: "Websites, web apps, and online services"
  },
  {
    value: "graphic_design",
    label: "Graphic Design",
    description: "Visual design, branding, and illustration"
  },
  {
    value: "content_creation",
    label: "Content Creation",
    description: "Writing, editing, and content strategy"
  },
  {
    value: "marketing",
    label: "Marketing",
    description: "Digital marketing, SEO, and advertising"
  },
  {
    value: "consulting",
    label: "Consulting",
    description: "Professional advice and expertise"
  },
  {
    value: "general",
    label: "Other/General",
    description: "All other freelance services"
  }
];

interface IndustrySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function IndustrySelector({ value, onChange }: IndustrySelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedIndustry = industries.find(industry => industry.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedIndustry ? selectedIndustry.label : "Select industry..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search industry..." />
          <CommandEmpty>No industry found.</CommandEmpty>
          <CommandGroup>
            {industries.map((industry) => (
              <CommandItem
                key={industry.value}
                value={industry.value}
                onSelect={(currentValue) => {
                  onChange(currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === industry.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{industry.label}</span>
                  <span className="text-xs text-neutral-500">{industry.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
```

#### Enhanced Contract Analysis Page
```tsx
// app/dashboard/contracts/new/page.tsx (Enhanced)

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2, Upload, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { IndustrySelector } from "@/components/industry-selector"
import { RegionSelector } from "@/components/region-selector"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function AnalyzeContractPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [title, setTitle] = useState("")
  const [contractText, setContractText] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [activeTab, setActiveTab] = useState("paste")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [industry, setIndustry] = useState("general")
  const [region, setRegion] = useState("US")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (activeTab === "paste" && !contractText.trim()) {
      toast({
        title: "Error",
        description: "Please enter your contract text",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "upload" && !file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAnalyzing(true)

      let textToAnalyze = contractText

      // If file is uploaded, read its contents
      if (activeTab === "upload" && file) {
        textToAnalyze = await readFileAsText(file)
      }

      // Call the API to analyze the contract with industry and region
      const response = await fetch("/api/contracts/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title || "Untitled Contract",
          contractText: textToAnalyze,
          industry,
          region
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to analyze contract")
      }

      const data = await response.json()

      // Redirect to the contract details page
      router.push(`/dashboard/contracts/${data.id}`)

      toast({
        title: "Analysis Complete",
        description: "Your contract has been analyzed successfully.",
      })
    } catch (error: any) {
      console.error("Error analyzing contract:", error)
      toast({
        title: "Analysis Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Helper function to read file contents
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target?.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsText(file)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Analyze New Contract</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Contract</CardTitle>
          <CardDescription>
            Paste your contract text or upload a document to analyze for potential issues.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Contract Title
                </Label>
                <Input
                  id="title"
                  placeholder="E.g., Client Project Agreement"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-neutral-500">Give your contract a name for easy reference later.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="industry" className="text-sm font-medium">
                      Industry
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-neutral-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            Selecting your industry helps us provide more accurate and relevant contract analysis.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <IndustrySelector value={industry} onChange={setIndustry} />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="region" className="text-sm font-medium">
                      Region
                    </Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-neutral-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[200px] text-xs">
                            We'll check for region-specific legal requirements and protections.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <RegionSelector value={region} onChange={setRegion} />
                </div>
              </div>

              <Tabs defaultValue="paste" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="paste" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Paste Text
                  </TabsTrigger>
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Upload File
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contract-text" className="text-sm font-medium">
                      Contract Text
                    </Label>
                    <Textarea
                      id="contract-text"
                      placeholder="Paste your contract here..."
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      className="min-h-[300px] font-mono text-sm"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center">
                    <Upload className="h-10 w-10 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Contract Document</h3>
                    <p className="text-sm text-neutral-500 mb-4">Drag and drop your file here, or click to browse.</p>
                    <input
                      type="file"
                      id="contract-file"
                      accept=".doc,.docx,.pdf,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      onClick={() => document.getElementById("contract-file")?.click()}
                      variant="outline"
                      className="mx-auto"
                    >
                      Browse Files
                    </Button>

                    {file && (
                      <div className="mt-4 bg-neutral-50 p-3 rounded-md flex items-center">
                        <FileText className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm font-medium truncate">{file.name}</span>
                      </div>
                    )}

                    <p className="text-xs text-neutral-500 mt-4">Supported file types: .PDF, .DOCX, .DOC, .TXT</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isAnalyzing}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isAnalyzing || (activeTab === "paste" && !contractText.trim()) || (activeTab === "upload" && !file)
              }
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Contract</>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
```

### 5. Contract Generation UI

```tsx
// app/dashboard/contracts/generate/page.tsx

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { IndustrySelector } from "@/components/industry-selector"
import { RegionSelector } from "@/components/region-selector"
import { ProjectTypeSelector } from "@/components/project-type-selector"

export default function GenerateContractPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const [formData, setFormData] = useState({
    industry: "web_development",
    projectType: "fixed_price",
    clientName: "",
    freelancerName: "",
    projectDescription: "",
    deliverables: [""],
    timeline: "",
    paymentTerms: "",
    region: "US"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDeliverableChange = (index: number, value: string) => {
    const newDeliverables = [...formData.deliverables]
    newDeliverables[index] = value
    setFormData(prev => ({ ...prev, deliverables: newDeliverables }))
  }

  const addDeliverable = () => {
    setFormData(prev => ({ ...prev, deliverables: [...prev.deliverables, ""] }))
  }

  const removeDeliverable = (index: number) => {
    const newDeliverables = [...formData.deliverables]
    newDeliverables.splice(index, 1)
    setFormData(prev => ({ ...prev, deliverables: newDeliverables }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.clientName || !formData.freelancerName || !formData.projectDescription || 
        !formData.deliverables[0] || !formData.timeline || !formData.paymentTerms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)

      // Call API to generate contract
      const response = await fetch("/api/contracts/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || "Failed to generate contract")
      }

      const data = await response.json()

      // Redirect to the contract details page
      router.push(`/dashboard/contracts/${data.contractId}`)

      toast({
        title: "Contract Generated",
        description: "Your contract has been generated successfully.",
      })
    } catch (error: any) {
      console.error("Error generating contract:", error)
      toast({
        title: "Generation Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Generate New Contract</h1>

      <Card>
        <CardHeader>
          <CardTitle>Contract Details</CardTitle>
          <CardDescription>
            Fill in the details below to generate a customized contract for your project.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry" className="text-sm font-medium">
                    Industry
                  </Label>
                  <IndustrySelector 
                    value={formData.industry} 
                    onChange={(value) => setFormData(prev => ({ ...prev, industry: value }))} 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region" className="text-sm font-medium">
                    Region
                  </Label>
                  <RegionSelector 
                    value={formData.region} 
                    onChange={(value) => setFormData(prev => ({ ...prev, region: value }))} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-sm font-medium">
                  Project Type
                </Label>
                <ProjectTypeSelector 
                  value={formData.projectType} 
                  onChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-sm font-medium">
                    Client Name
                  </Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    placeholder="E.g., Acme Corporation"
                    value={formData.clientName}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freelancerName" className="text-sm font-medium">
                    Your Name (Freelancer)
                  </Label>
                  <Input
                    id="freelancerName"
                    name="freelancerName"
                    placeholder="E.g., Jane Smith"
                    value={formData.freelancerName}
                    onChange={handleChange}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription" className="text-sm font-medium">
                  Project Description
                </Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  placeholder="Describe the project in detail..."
                  value={formData.projectDescription}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Deliverables</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={addDeliverable} className="h-8 px-2">
                    <Plus className="h-4 w-4 mr-1" /> Add Deliverable
                  </Button>
                </div>
                
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Deliverable ${index + 1}`}
                      value={deliverable}
                      onChange={(e) => handleDeliverableChange(index, e.target.value)}
                      className="w-full"
                    />
                    {formData.deliverables.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeDeliverable(index)}
                        className="h-8 w-8"
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline" className="text-sm font-medium">
                  Project Timeline
                </Label>
                <Input
                  id="timeline"
                  name="timeline"
                  placeholder="E.g., 4 weeks from contract signing"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms" className="text-sm font-medium">
                  Payment Terms
                </Label>
                <Input
                  id="paymentTerms"
                  name="paymentTerms"
                  placeholder="E.g., 50% upfront, 50% upon completion"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t p-6">
            <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-1" />
                  Generate Contract
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
```

### 6. Educational Resources Component

```tsx
// components/educational-resources.tsx

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, Video, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Resource {
  id: string
  title: string
  description: string
  url: string
  type: "article" | "video" | "template" | "guide"
}

interface ResourcesProps {
  industry?: string
  issueType?: string
}

export function EducationalResources({ industry = "general", issueType }: ResourcesProps) {
  // This would ideally come from an API or database
  const resources: Record<string, Resource[]> = {
    "payment_terms": [
      {
        id: "1",
        title: "Securing Your Payments as a Freelancer",
        description: "Learn how to structure payment terms to minimize risk and ensure timely payment.",
        url: "/resources/payment-terms-guide",
        type: "guide"
      },
      {
        id: "2",
        title: "Payment Milestone Template",
        description: "A ready-to-use template for structuring payment milestones in your contracts.",
        url: "/resources/payment-milestone-template",
        type: "template"
      },
      {
        id: "3",
        title: "How to Handle Late Payments",
        description: "Video walkthrough on addressing and preventing late payments.",
        url: "/resources/late-payments-video",
        type: "video"
      }
    ],
    "revision_policy": [
      {
        id: "4",
        title: "Setting Clear Revision Boundaries",
        description: "Learn how to define revision scopes and limits to prevent scope creep.",
        url: "/resources/revision-boundaries",
        type: "guide"
      },
      {
        id: "5",
        title: "Revision Clause Template",
        description: "A template for clear revision terms in your contracts.",
        url: "/resources/revision-clause-template",
        type: "template"
      }
    ],
    "intellectual_property": [
      {
        id: "6",
        title: "Understanding IP Rights for Freelancers",
        description: "A comprehensive guide to intellectual property rights for freelance work.",
        url: "/resources/ip-rights-guide",
        type: "guide"
      },
      {
        id: "7",
        title: "IP Rights Clause Template",
        description: "A balanced IP rights clause template for freelance contracts.",
        url: "/resources/ip-clause-template",
        type: "template"
      }
    ],
    "scope_definition": [
      {
        id: "8",
        title: "Defining Project Scope Clearly",
        description: "Learn how to write clear scope definitions to prevent misunderstandings.",
        url: "/resources/scope-definition-guide",
        type: "guide"
      },
      {
        id: "9",
        title: "Scope of Work Template",
        description: "A detailed template for defining project scope in your contracts.",
        url: "/resources/scope-template",
        type: "template"
      }
    ],
    "general": [
      {
        id: "10",
        title: "Freelance Contract Essentials",
        description: "The key elements every freelance contract should include.",
        url: "/resources/contract-essentials",
        type: "guide"
      },
      {
        id: "11",
        title: "Red Flags in Client Contracts",
        description: "Learn to identify problematic clauses in contracts you're asked to sign.",
        url: "/resources/contract-red-flags",
        type: "article"
      }
    ]
  };

  // Filter resources based on issue type if provided
  const relevantResources = issueType && resources[issueType] 
    ? resources[issueType] 
    : resources["general"];

  // Add industry-specific resources if available
  const industryResources = industry !== "general" && resources[industry] 
    ? [...relevantResources, ...resources[industry]] 
    : relevantResources;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Educational Resources
        </CardTitle>
        <CardDescription>
          Learn more about contract best practices and how to protect yourself.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {industryResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            {industryResources
              .filter(r => r.type === "guide" || r.type === "article")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            {industryResources
              .filter(r => r.type === "template")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            {industryResources
              .filter(r => r.type === "video")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const getIcon = (type: string) => {
    switch (type) {
      case "article":
      case "guide":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Video className="h-4 w-4" />;
      case "template":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  return (
    <Link href={resource.url}>
      <div className="p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
        <div className="flex items-start gap-3">
          <div className="mt-1 p-2 bg-primary/10 rounded-md text-primary">
            {getIcon(resource.type)}
          </div>
          <div>
            <h3 className="font-medium text-sm">{resource.title}</h3>
            <p className="text-xs text-neutral-500 mt-1">{resource.description}</p>
            <div className="mt-2">
              <span className="text-xs font-medium px-2 py-1 bg-neutral-100 rounded-full capitalize">
                {resource.type}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### 7. Enhanced Results Page with Compliance Checks

```tsx
// components/compliance-alerts.tsx

import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ComplianceAlertsProps {
  complianceFlags: string[]
  region: string
}

export function ComplianceAlerts({ complianceFlags, region }: ComplianceAlertsProps) {
  if (!complianceFlags || complianceFlags.length === 0) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>No Compliance Issues Detected</AlertTitle>
        <AlertDescription>
          Your contract appears to comply with {region} freelancer protection laws.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Info className="h-4 w-4" />
        Compliance Alerts
      </h3>
      
      {complianceFlags.map((flag, index) => (
        <Alert key={index} variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Compliance Issue</AlertTitle>
          <AlertDescription className="text-amber-700">
            {flag}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}
```

## Implementation Strategy

### Phase 1: Core AI Enhancement (Weeks 1-2)
1. Implement industry-specific analysis models
2. Upgrade to GPT-4o for better analysis quality
3. Add region-specific compliance checks
4. Enhance the contract analysis API route

### Phase 2: Contract Generation (Weeks 3-4)
1. Implement contract template system
2. Create contract generation API
3. Build contract generation UI
4. Add industry-specific templates

### Phase 3: Educational Resources (Weeks 5-6)
1. Create educational content framework
2. Implement educational resources component
3. Develop initial set of guides and templates
4. Integrate resources with analysis results

### Phase 4: UI/UX Improvements (Weeks 7-8)
1. Enhance results page with compliance alerts
2. Improve data visualization for analysis results
3. Add industry and region selectors
4. Implement guided onboarding flow

## Marketing Integration

### Community-Focused Features
1. Add "Share with Community" option for anonymized contract issues
2. Implement "Community Insights" section showing common issues by industry
3. Create "Contract Confidence Score" that can be shared on social media

### Educational Content Strategy
1. Each contract analysis should link to relevant educational resources
2. Implement a "Contract Knowledge Base" section
3. Create downloadable industry-specific contract guides

### Growth Features
1. Add referral system with free analysis credits
2. Implement "Contract Checkup" widget for embedding on freelancer websites
3. Create shareable contract templates with ContractScan branding

## Conclusion

By implementing these enhancements, ContractScan will transform from a basic contract analysis tool into a comprehensive contract intelligence platform that addresses the specific needs of freelancers in different industries. The focus on industry-specific analysis, educational resources, and contract generation will create significant differentiation from competitors and deliver immediate value to users.

The implementation strategy is designed to deliver incremental value while building toward the complete vision, allowing for user feedback and refinement throughout the process.

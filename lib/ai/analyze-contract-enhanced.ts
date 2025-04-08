import OpenAI from "openai"
import { ContractAnalysis, ContractSeverity, ContractType, IssueType } from "@/types/contract"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ContractIssue {
  type: ContractType
  text: string
  explanation: string
  suggestion: string
  severityScore: number
  industryRelevance: number
}

export async function analyzeContractAdvanced(
  contractText: string,
  industry: string = "general",
  region: string = "US"
): Promise<ContractAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured")
  }

  if (!contractText) {
    throw new Error("Contract text is required")
  }

  if (contractText.length > 50000) {
    throw new Error("Contract text is too long (max 50,000 characters)")
  }

  try {
    const prompt = `As a legal expert specializing in freelancer contracts, analyze the following contract and provide a detailed analysis in JSON format. Focus on issues that commonly affect freelancers, including:

1. Payment Terms and Conditions
   - Payment schedule and deadlines
   - Late payment penalties
   - Payment methods and currency
   - Invoice requirements

2. Intellectual Property Rights
   - Ownership of work
   - Usage rights
   - Attribution requirements
   - Portfolio rights

3. Scope of Work
   - Project deliverables
   - Timeline expectations
   - Revision policies
   - Additional work compensation

4. Termination and Cancellation
   - Notice periods
   - Kill fees
   - Project cancellation terms
   - Final payment conditions

5. Liability and Insurance
   - Indemnification clauses
   - Insurance requirements
   - Liability limitations
   - Warranty terms

Provide analysis in this JSON format:
{
  "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
  "type": "SERVICE|EMPLOYMENT|LEASE|SALES|NDA|OTHER",
  "recommendedActions": [
    "Specific, actionable steps the freelancer should take",
    "e.g., 'Request a kill fee of 25% for project cancellation'"
  ],
  "complianceFlags": [
    "Important compliance issues to address",
    "e.g., 'Payment terms exceed standard 30-day net'"
  ],
  "issues": [
    {
      "type": "PAYMENT|IP|SCOPE|TERMINATION|LIABILITY|OTHER",
      "text": "The specific clause or text from the contract",
      "explanation": "Why this is problematic for freelancers",
      "suggestion": "How to address or negotiate this issue",
      "severity": "LOW|MEDIUM|HIGH|CRITICAL"
    }
  ]
}

Contract:
${contractText}`

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are a legal expert specializing in freelancer contracts, with deep knowledge of common issues and best practices for freelancers. Provide clear, actionable advice focused on protecting freelancer interests.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    })

    const result = response.choices[0]?.message?.content
    if (!result) {
      throw new Error("Failed to get analysis from OpenAI")
    }

    try {
      const analysis = JSON.parse(result) as ContractAnalysis

      // Validate and sanitize the response
      const validatedAnalysis: ContractAnalysis = {
        riskLevel: validateSeverity(analysis.riskLevel),
        type: validateType(analysis.type),
        recommendedActions: Array.isArray(analysis.recommendedActions)
          ? analysis.recommendedActions
          : [],
        complianceFlags: Array.isArray(analysis.complianceFlags)
          ? analysis.complianceFlags
          : [],
        issues: Array.isArray(analysis.issues)
          ? analysis.issues.map((issue) => ({
              type: validateIssueType(issue.type),
              text: issue.text || "",
              explanation: issue.explanation || "",
              suggestion: issue.suggestion || "",
              severity: validateSeverity(issue.severity),
              metadata: {},
            }))
          : [],
      }

      return validatedAnalysis
    } catch (error) {
      console.error("Error parsing OpenAI response:", error)
      throw new Error("Failed to parse contract analysis")
    }
  } catch (error: any) {
    console.error("Error analyzing contract:", error)
    throw new Error(
      error.response?.data?.error?.message || "Failed to analyze contract"
    )
  }
}

function validateType(type: any): ContractType {
  const validTypes: ContractType[] = ["SERVICE", "EMPLOYMENT", "NDA", "OTHER"]
  return validTypes.includes(type) ? type : "OTHER"
}

function validateSeverity(severity: any): ContractSeverity {
  const validSeverities: ContractSeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
  return validSeverities.includes(severity) ? severity : "MEDIUM"
}

function validateIssueType(type: any): IssueType {
  const validTypes: IssueType[] = ["PAYMENT", "IP", "SCOPE", "TERMINATION", "LIABILITY", "OTHER"]
  return validTypes.includes(type) ? type : "OTHER"
}


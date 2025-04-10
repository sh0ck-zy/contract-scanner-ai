import { OpenAI } from "openai"
import { validateSeverity, validateType } from "./validation"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface AnalysisOptions {
  industry?: string
  region?: string
}

interface ContractIssue {
  type: string
  text: string
  description?: string
  explanation: string
  suggestion: string
  severityScore: number
  industryRelevance: string
}

interface ContractAnalysis {
  riskLevel: string
  contractType: string
  recommendedActions: string[]
  complianceFlags: string[]
  issues: ContractIssue[]
}

export async function analyzeContractAdvanced(
  contractText: string,
  options: AnalysisOptions = {}
): Promise<ContractAnalysis> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured")
  }

  if (!contractText || contractText.trim().length === 0) {
    throw new Error("Contract text is required")
  }

  const prompt = `You are a legal contract analysis expert. Analyze the following contract text and provide a detailed analysis.
  
  ${options.industry ? `Industry context: ${options.industry}` : ''}
  ${options.region ? `Region context: ${options.region}` : ''}
  
  Contract text to analyze:
  """
  ${contractText}
  """
  
  Analyze the contract for potential issues, risks, and areas of improvement. Focus on:
  - Payment terms and conditions
  - Deadlines and deliverables
  - Intellectual property rights
  - Liability and legal protections
  - Scope of work clarity
  - Termination clauses
  - Compliance requirements
  
  Provide your analysis in the following JSON format:
  {
    "riskLevel": "LOW|MEDIUM|HIGH|CRITICAL",
    "contractType": "SERVICE|EMPLOYMENT|NDA|OTHER",
    "recommendedActions": ["action1", "action2", ...],
    "complianceFlags": ["flag1", "flag2", ...],
    "issues": [
      {
        "type": "ISSUE_TYPE",
        "text": "Brief description of the issue",
        "explanation": "Detailed explanation of why this is an issue",
        "suggestion": "Specific suggestion to fix the issue",
        "severityScore": 1-10,
        "industryRelevance": "GENERAL|SPECIFIC_INDUSTRY"
      }
    ]
  }

  Ensure each issue has:
  1. A clear type (e.g., PAYMENT, DEADLINE, IP_RIGHTS, LIABILITY, SCOPE, etc.)
  2. A concise description of the problem
  3. A detailed explanation of the implications
  4. A specific, actionable suggestion to fix it
  5. A severity score (1-10, where 10 is most severe)
  6. Industry relevance

  Return ONLY the JSON object, no additional text or explanation.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal contract analysis expert. Always return valid JSON with detailed contract analysis."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2, // Lower temperature for more consistent output
      max_tokens: 3000  // Increased token limit for longer analyses
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from AI")
    }

    // Clean the response to ensure it's valid JSON
    const cleanContent = content.trim().replace(/^```json\s*|\s*```$/g, '')
    
    let analysis: ContractAnalysis
    try {
      analysis = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError)
      console.error("Raw response:", content)
      throw new Error("Failed to parse AI response")
    }

    // Validate and enhance the analysis
    const enhancedAnalysis = {
      riskLevel: validateSeverity(analysis.riskLevel || "MEDIUM"),
      contractType: validateType(analysis.contractType || "OTHER"),
      recommendedActions: Array.isArray(analysis.recommendedActions) 
        ? analysis.recommendedActions.filter(action => action && typeof action === 'string')
        : [],
      complianceFlags: Array.isArray(analysis.complianceFlags)
        ? analysis.complianceFlags.filter(flag => flag && typeof flag === 'string')
        : [],
      issues: Array.isArray(analysis.issues)
        ? analysis.issues
            .filter(issue => issue && typeof issue === 'object')
            .map(issue => ({
              type: issue.type || "OTHER",
              text: issue.text || issue.description || "Issue detected",
              explanation: issue.explanation || "No detailed explanation provided",
              suggestion: issue.suggestion || "Review this section with a legal professional",
              severityScore: typeof issue.severityScore === 'number' 
                ? Math.min(Math.max(Math.round(issue.severityScore), 1), 10)
                : 5,
              industryRelevance: issue.industryRelevance || "GENERAL"
            }))
        : []
    }

    // If no issues were found but there's contract text, add a general review suggestion
    if (enhancedAnalysis.issues.length === 0 && contractText.length > 100) {
      enhancedAnalysis.issues.push({
        type: "GENERAL_REVIEW",
        text: "Contract requires professional review",
        explanation: "While no specific issues were automatically detected, this contract contains complex terms that should be reviewed by a legal professional.",
        suggestion: "Have a legal professional review the entire contract, particularly focusing on payment terms, deliverables, and legal protections.",
        severityScore: 5,
        industryRelevance: "GENERAL"
      })
    }

    return enhancedAnalysis
  } catch (error) {
    console.error("Error analyzing contract:", error)
    throw error
  }
}


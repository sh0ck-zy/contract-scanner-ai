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

  const prompt = `Analyze the following contract text and provide a detailed analysis.
  ${options.industry ? `Industry context: ${options.industry}` : ''}
  ${options.region ? `Region context: ${options.region}` : ''}
  
  Contract text:
  ${contractText}
  
  Please provide a structured analysis with:
  1. Risk level (LOW, MEDIUM, HIGH, CRITICAL)
  2. Contract type (SERVICE, EMPLOYMENT, NDA, OTHER)
  3. List of recommended actions
  4. List of compliance flags
  5. List of issues found, each with:
     - Type
     - Description
     - Explanation
     - Suggested fix
     - Severity score (1-10)
     - Industry relevance

  Format the response as a JSON object with these exact fields. Return ONLY the JSON object, no additional text.`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a legal contract analysis expert. Analyze contracts and provide detailed, accurate assessments. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: "json_object" }
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
      // Return a default analysis structure
      return {
        riskLevel: "MEDIUM",
        contractType: "OTHER",
        recommendedActions: [],
        complianceFlags: [],
        issues: []
      }
    }

    // Validate and set defaults for required fields
    return {
      riskLevel: validateSeverity(analysis.riskLevel),
      contractType: validateType(analysis.contractType),
      recommendedActions: Array.isArray(analysis.recommendedActions) ? analysis.recommendedActions : [],
      complianceFlags: Array.isArray(analysis.complianceFlags) ? analysis.complianceFlags : [],
      issues: (Array.isArray(analysis.issues) ? analysis.issues : []).map(issue => ({
        type: issue.type || "OTHER",
        text: issue.text || issue.description || "",
        explanation: issue.explanation || "",
        suggestion: issue.suggestion || "",
        severityScore: typeof issue.severityScore === 'number' ? Math.min(Math.max(issue.severityScore, 1), 10) : 5,
        industryRelevance: issue.industryRelevance || "GENERAL"
      }))
    }
  } catch (error) {
    console.error("Error analyzing contract:", error)
    // Return a default analysis structure
    return {
      riskLevel: "MEDIUM",
      contractType: "OTHER",
      recommendedActions: [],
      complianceFlags: [],
      issues: []
    }
  }
}


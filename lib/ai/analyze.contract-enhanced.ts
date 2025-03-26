import OpenAI from "openai"
import { getIndustrySpecificPrompt } from "./industry-prompts"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ContractIssue {
  type: string
  text: string
  explanation: string
  suggestion: string
  severityScore: number
  industryRelevance: string[]
}

export interface ContractAnalysis {
  riskLevel: "High" | "Medium" | "Low"
  issues: ContractIssue[]
  recommendedActions: string[]
  complianceFlags: string[]
  industrySpecificRisk?: {
    [key: string]: number
  }
}

export async function analyzeContractAdvanced(
  contractText: string,
  industry = "general",
  region = "US",
): Promise<ContractAnalysis> {
  // Get industry-specific prompt
  const industryPrompt = getIndustrySpecificPrompt(industry, region)

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
  `

  try {
    console.log("Starting advanced contract analysis...")

    // Use GPT-4 for enhanced analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Upgrade to GPT-4o for better analysis
      messages: [
        {
          role: "system",
          content:
            "You are a contract analysis expert for freelancers in the " +
            industry +
            " industry. You will respond with JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
    })

    console.log("OpenAI response received")

    try {
      const result = JSON.parse(response.choices[0].message.content || "{}") as ContractAnalysis
      return result
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError)
      console.log("Raw response:", response.choices[0].message.content)

      // Fallback response in case of parsing error
      return {
        riskLevel: "Medium",
        issues: [
          {
            type: "API Error",
            text: "Error processing contract",
            explanation:
              "We encountered an error while analyzing your contract. Our system wasn't able to process it correctly.",
            suggestion: "Please try again with a simpler contract text or contact support if the issue persists.",
            severityScore: 5,
            industryRelevance: ["general"],
          },
        ],
        recommendedActions: ["Try again or contact support"],
        complianceFlags: [],
      }
    }
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw new Error("Failed to analyze contract")
  }
}


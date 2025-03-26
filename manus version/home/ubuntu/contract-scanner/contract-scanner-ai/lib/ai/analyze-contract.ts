// lib/ai/analyze-contract.ts
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface ContractIssue {
  type: string
  text: string
  explanation: string
  suggestion: string
}

export interface ContractAnalysis {
  riskLevel: "High" | "Medium" | "Low"
  issues: ContractIssue[]
}

export async function analyzeContract(contractText: string): Promise<ContractAnalysis> {
  const prompt = `
    You are an expert contract reviewer for freelancers. Analyze this contract for problematic clauses that could harm a freelancer.
    
    Focus specifically on identifying these red flags:
    1. Unlimited revisions without additional payment
    2. Full copyright transfer without adequate compensation
    3. Vague deliverable descriptions that enable scope creep
    4. Payment terms longer than 30 days or with unclear milestones
    5. Overly restrictive non-compete clauses
    6. Client ability to terminate without compensation
    7. Indemnification clauses that create unreasonable liability
    
    For each issue found:
    - Quote the exact problematic text
    - Explain in plain language why it's problematic
    - Suggest alternative language that would be more fair
    
    Format your response as JSON with the following structure:
    {
      "riskLevel": "High/Medium/Low",
      "issues": [
        {
          "type": "Revision Policy",
          "text": "quoted text here",
          "explanation": "explanation here",
          "suggestion": "suggested alternative here"
        }
      ]
    }
    
    IMPORTANT: You must respond with a JSON object only, no additional text.
    
    Here is the contract to analyze:
    
    ${contractText}
  `

  try {
    console.log("Starting contract analysis...");

    // Remove the response_format parameter since it's not supported
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-3.5-turbo instead of gpt-4
      messages: [
        { role: "system", content: "You are a contract analysis expert for freelancers. You will respond with JSON only." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2, // Lower temperature for more consistent structured output
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
            suggestion: "Please try again with a simpler contract text or contact support if the issue persists."
          }
        ]
      };
    }
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze contract");
  }
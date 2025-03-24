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
    
    Here is the contract to analyze:
    
    ${contractText}
  `

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are a contract analysis expert for freelancers." },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
        })

        const result = JSON.parse(response.choices[0].message.content) as ContractAnalysis
        return result
    } catch (error) {
        console.error("Error analyzing contract:", error)
        throw new Error("Failed to analyze contract")
    }
}


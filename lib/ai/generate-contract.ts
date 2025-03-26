import OpenAI from "openai"
import { getContractTemplate } from "./contract-templates"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface ContractRequirements {
    industry: string
    projectType: string
    clientName: string
    freelancerName: string
    projectDescription: string
    deliverables: string[]
    timeline: string
    paymentTerms: string
    region: string
}

export async function generateContract(requirements: ContractRequirements): Promise<string> {
    // Get base template for the industry and project type
    const template = getContractTemplate(requirements.industry, requirements.projectType, requirements.region)

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
  `

    try {
        console.log("Generating contract...")

        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a contract generation expert for freelancers. Generate a professional, legally-sound contract.",
                },
                { role: "user", content: prompt },
            ],
            temperature: 0.3,
        })

        console.log("Contract generated successfully")
        return response.choices[0].message.content || ""
    } catch (error) {
        console.error("OpenAI API error:", error)
        throw new Error("Failed to generate contract")
    }
}


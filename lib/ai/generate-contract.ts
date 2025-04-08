import OpenAI from "openai"
import { getContractTemplate } from "./contract-templates"

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export interface ContractRequirements {
    industry: string
    projectType: string
    region: string
    paymentTerms: string
    deliverables: string[]
    timeline: string
    budget: string
    additionalRequirements?: string[]
}

export async function generateContract(requirements: ContractRequirements): Promise<string> {
    const template = getContractTemplate(requirements.industry, requirements.projectType, requirements.region)

    const prompt = `Generate a professional contract based on these requirements:

Industry: ${requirements.industry}
Project Type: ${requirements.projectType}
Region: ${requirements.region}
Payment Terms: ${requirements.paymentTerms}
Deliverables: ${requirements.deliverables.join(", ")}
Timeline: ${requirements.timeline}
Budget: ${requirements.budget}
Additional Requirements: ${requirements.additionalRequirements?.join(", ") || "None"}

Use this template as a base:
${template}

Generate a complete, professional contract that includes all necessary clauses and terms.
The contract should be in plain text format, with clear section headers and proper formatting.`

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
        })

        return completion.choices[0].message.content || ""
    } catch (error) {
        console.error("Error generating contract:", error)
        throw new Error("Failed to generate contract")
    }
}


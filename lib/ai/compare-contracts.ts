import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ContractComparison {
  differences: {
    added: string[];
    removed: string[];
    modified: {
      original: string;
      revised: string;
      explanation: string;
    }[];
  };
  summary: string;
  riskAssessment: {
    originalRisk: string;
    revisedRisk: string;
    improvements: string[];
    concerns: string[];
  };
}

export async function compareContracts(
  originalText: string,
  revisedText: string
): Promise<ContractComparison> {
  const prompt = `Compare these two contract versions and provide a detailed analysis in JSON format:

Original Contract:
${originalText}

Revised Contract:
${revisedText}

Provide the comparison in this exact JSON format:
{
  "differences": {
    "added": ["string"],
    "removed": ["string"],
    "modified": [
      {
        "original": "string",
        "revised": "string",
        "explanation": "string"
      }
    ]
  },
  "summary": "string",
  "riskAssessment": {
    "originalRisk": "string",
    "revisedRisk": "string",
    "improvements": ["string"],
    "concerns": ["string"]
  }
}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const comparison = JSON.parse(completion.choices[0].message.content || "{}");
    return comparison as ContractComparison;
  } catch (error) {
    console.error("Error comparing contracts:", error);
    throw new Error("Failed to compare contracts");
  }
} 
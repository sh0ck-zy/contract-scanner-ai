import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { analyzeContractAdvanced } from "@/lib/ai/analyze-contract-enhanced"

// Runtime configuration for Next.js
export const config = {
  runtime: "nodejs"
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the user in our database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    })

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const freelancerType = formData.get("freelancerType") as string
    const file = formData.get("file") as File

    if (!title || !freelancerType || !file) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For now, we'll use placeholder text since we can't parse PDFs yet
    const placeholderText = "This is a placeholder contract text. In a real implementation, we would parse the PDF file and extract the text content."

    try {
      // Analyze the contract
      const analysis = await analyzeContractAdvanced(placeholderText, {
        industry: freelancerType,
        region: "GLOBAL"
      })

      // Create the contract in the database
      const contract = await db.contract.create({
        data: {
          title,
          originalText: placeholderText,
          userId: dbUser.id,
          riskLevel: analysis.riskLevel,
          contractType: analysis.contractType,
          recommendedActions: JSON.stringify(analysis.recommendedActions),
          complianceFlags: JSON.stringify(analysis.complianceFlags),
          issues: {
            create: analysis.issues.map(issue => ({
              type: issue.type,
              text: issue.text || "",
              explanation: issue.explanation || "",
              suggestion: issue.suggestion || "",
              severityScore: issue.severityScore,
              industryRelevance: issue.industryRelevance || "GENERAL"
            }))
          }
        }
      })

      // Return the contract ID in the response
      return NextResponse.json({
        success: true,
        contractId: contract.id,
        contract: {
          id: contract.id,
          title: contract.title,
          originalText: contract.originalText,
          riskLevel: contract.riskLevel || "MEDIUM",
          contractType: contract.contractType || "OTHER",
          recommendedActions: typeof contract.recommendedActions === 'string' 
            ? JSON.parse(contract.recommendedActions)
            : contract.recommendedActions || [],
          complianceFlags: typeof contract.complianceFlags === 'string'
            ? JSON.parse(contract.complianceFlags)
            : contract.complianceFlags || [],
          issues: [] // We'll populate this from the database query if needed
        }
      })
    } catch (error: any) {
      console.error("Error analyzing contract:", error)
      return NextResponse.json({ 
        error: error.message || "Failed to analyze contract",
        details: error.response?.data?.error?.message || error.toString()
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error creating contract:", error)
    return NextResponse.json({ 
      error: "Internal server error",
      details: error.message || error.toString()
    }, { status: 500 })
  }
} 
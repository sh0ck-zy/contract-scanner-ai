import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { analyzeContractAdvanced } from "@/lib/ai/analyze-contract-enhanced"
import { sendAnalysisCompletionEmail } from "@/lib/email"

export const runtime = "nodejs" // Explicitly set to nodejs runtime

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Get DB user or create if it doesn't exist
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      // Create user in database
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
        },
      })
    }

    // Check subscription
    if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL") {
      // Allow some free analyses
      const analysisCount = await prisma.contract.count({
        where: { userId: dbUser.id },
      })

      if (analysisCount >= 3) {
        return new NextResponse("Subscription required", { status: 403 })
      }
    }

    // Get contract data from request
    const { contractText, title, industry, region } = await req.json()

    if (!contractText) {
      return new NextResponse("Contract text is required", { status: 400 })
    }

    // Analyze contract using OpenAI with industry-specific model
    try {
      const analysis = await analyzeContractAdvanced(contractText, industry || "general", region || "US")

      // Save to database with enhanced schema
      const contract = await prisma.contract.create({
        data: {
          userId: dbUser.id,
          title: title || "Untitled Contract",
          originalText: contractText,
          riskLevel: analysis.riskLevel,
          metadata: {
            industry: industry || "general",
            region: region || "US",
            industrySpecificRisk: analysis.industrySpecificRisk,
          },
          issues: {
            create: analysis.issues.map((issue) => ({
              type: issue.type,
              text: issue.text,
              explanation: issue.explanation,
              suggestion: issue.suggestion,
              severityScore: issue.severityScore,
              industryRelevance: issue.industryRelevance,
            })),
          },
          recommendedActions: analysis.recommendedActions,
          complianceFlags: analysis.complianceFlags,
        },
        include: {
          issues: true,
        },
      })

      // Send email notification
      if (user.emailAddresses && user.emailAddresses.length > 0) {
        await sendAnalysisCompletionEmail(
          user.emailAddresses[0].emailAddress,
          contract.title,
          contract.id,
          contract.riskLevel || "Unknown",
          contract.issues.length,
        )
      }

      return NextResponse.json(contract)
    } catch (error) {
      console.error("Error in OpenAI analysis:", error)
      return new NextResponse("AI analysis failed", { status: 500 })
    }
  } catch (error) {
    console.error("Error analyzing contract:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


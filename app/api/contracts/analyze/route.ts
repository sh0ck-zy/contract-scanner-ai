import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { analyzeContractAdvanced } from "@/lib/ai/analyze-contract-enhanced"
import { sendAnalysisCompletionEmail } from "@/lib/email"

export const runtime = "nodejs" // Explicitly set to nodejs runtime

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = auth()
    const user = await currentUser()

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get DB user or create if it doesn't exist
    let dbUser = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!dbUser) {
      // Create user in database
      dbUser = await db.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          subscriptionStatus: "FREE", // Set initial subscription status
        },
      })
    }

    // Check subscription
    if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL" && dbUser.subscriptionStatus !== "FREE") {
      return NextResponse.json({ error: "Invalid subscription status" }, { status: 403 })
    }

    // For free users, check usage limits
    if (dbUser.subscriptionStatus === "FREE") {
      const analysisCount = await db.contract.count({
        where: { userId: dbUser.id },
      })

      if (analysisCount >= 3) {
        return NextResponse.json({ error: "Free trial limit reached. Please upgrade to continue." }, { status: 403 })
      }
    }

    // Get and validate contract data from request
    let body;
    try {
      body = await req.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { contractText, title, industry, region } = body

    if (!contractText) {
      return NextResponse.json({ error: "Contract text is required" }, { status: 400 })
    }

    if (contractText.length > 50000) {
      return NextResponse.json({ error: "Contract text is too long. Maximum length is 50,000 characters." }, { status: 400 })
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is not configured")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    // Analyze contract using OpenAI with industry-specific model
    let analysis
    try {
      analysis = await analyzeContractAdvanced(contractText, industry || "general", region || "US")

      if (!analysis || !analysis.issues || !analysis.riskLevel) {
        throw new Error("Invalid analysis result from AI")
      }

      // Save to database with enhanced schema
      const contract = await db.contract.create({
        data: {
          userId: dbUser.id,
          title: title || "Untitled Contract",
          originalText: contractText,
          riskLevel: analysis.riskLevel,
          metadata: {
            industry: industry || "general",
            region: region || "US",
            industrySpecificRisk: analysis.industryRelevance,
            analyzedAt: new Date().toISOString(),
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
          recommendedActions: analysis.recommendedActions || [],
          complianceFlags: analysis.complianceFlags || [],
        },
        include: {
          issues: true,
        },
      })

      // Send email notification
      try {
        if (user.emailAddresses && user.emailAddresses.length > 0) {
          await sendAnalysisCompletionEmail(
            user.emailAddresses[0].emailAddress,
            contract.title,
            contract.id,
            contract.riskLevel || "Unknown",
            contract.issues.length,
          )
        }
      } catch (emailError) {
        console.error("Error sending email notification:", emailError)
        // Don't fail the request if email fails
      }

      return NextResponse.json(contract)
    } catch (error) {
      console.error("Error in OpenAI analysis:", error)
      return NextResponse.json({ 
        error: error instanceof Error ? error.message : "AI analysis failed"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error analyzing contract:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Internal Server Error"
    }, { status: 500 })
  }
}


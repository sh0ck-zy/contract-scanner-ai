import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { analyzeContractAdvanced } from "@/lib/ai/analyze-contract-enhanced"

// Set runtime config for Next.js
export const config = {
  runtime: "nodejs",
  regions: ["fra1"]  // Choose your region or 'auto'
}

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user info
    const user = await currentUser()
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 })
    }

    // Get form data
    const formData = await req.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const freelancerType = formData.get("freelancerType") as string

    if (!file || !title) {
      return NextResponse.json({ error: "File and title are required" }, { status: 400 })
    }

    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
    }

    // Check file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    // For now, use a placeholder text for testing
    const text = `This is placeholder text for a PDF analysis. 
    The application is currently using this text to test the analysis pipeline.
    In a production environment, the actual PDF content would be analyzed.`;
    
    // Get user from database
    let dbUser
    try {
      dbUser = await db.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
        },
      })
    } catch (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    // Check subscription limits
    const subscriptionStatus = dbUser.subscriptionStatus || "FREE"
    if (subscriptionStatus === "FREE") {
      const analysisCount = await db.contract.count({
        where: {
          userId: dbUser.id,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
          },
        },
      })

      if (analysisCount >= 3) {
        return NextResponse.json(
          { error: "Free tier limit reached. Please upgrade your subscription." },
          { status: 403 }
        )
      }
    }

    // Analyze contract
    let analysis
    try {
      analysis = await analyzeContractAdvanced(text, freelancerType || "general")
    } catch (error) {
      console.error("Analysis error:", error)
      return NextResponse.json({ error: "Failed to analyze contract" }, { status: 500 })
    }

    // Save to database
    try {
      const contract = await db.contract.create({
        data: {
          userId: dbUser.id,
          title,
          originalText: text,
          riskLevel: analysis.riskLevel,
          type: analysis.type || "UNKNOWN",
          recommendedActions: analysis.recommendedActions || [],
          complianceFlags: analysis.complianceFlags || [],
          issues: {
            create: analysis.issues.map((issue) => ({
              type: issue.type || "UNKNOWN",
              text: issue.text || "",
              explanation: issue.explanation || "",
              suggestion: issue.suggestion || "",
              severity: issue.severity || "LOW",
              metadata: issue.metadata || {},
            })),
          },
        },
        include: {
          issues: true,
        },
      })
      
      return NextResponse.json(contract)
    } catch (error) {
      console.error("Database save error:", error)
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
} 
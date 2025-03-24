import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"
import { prisma } from "@/lib/db"
import { analyzeContract } from "@/lib/ai/analyze-contract"
import { sendAnalysisCompletionEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Check if user has an active subscription
    if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL") {
      return new NextResponse("Subscription required", { status: 403 })
    }

    const { contractText, title } = await req.json()

    if (!contractText) {
      return new NextResponse("Contract text is required", { status: 400 })
    }

    // Analyze contract using OpenAI
    const analysis = await analyzeContract(contractText)

    // Save to database
    const contract = await prisma.contract.create({
      data: {
        userId: dbUser.id,
        title: title || "Untitled Contract",
        originalText: contractText,
        riskLevel: analysis.riskLevel,
        issues: {
          create: analysis.issues.map((issue) => ({
            type: issue.type,
            text: issue.text,
            explanation: issue.explanation,
            suggestion: issue.suggestion,
          })),
        },
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
    console.error("Error analyzing contract:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


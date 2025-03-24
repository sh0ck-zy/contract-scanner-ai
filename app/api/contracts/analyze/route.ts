// app/api/contracts/analyze/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { analyzeContract } from "@/lib/ai/analyze-contract";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get DB user or create if it doesn't exist
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      // Create user in database
      dbUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
        },
      });
    }

    // Check subscription
    if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL") {
      // Allow some free analyses
      const analysisCount = await prisma.contract.count({
        where: { userId: dbUser.id }
      });

      if (analysisCount >= 3) {
        return new NextResponse("Subscription required", { status: 403 });
      }
    }

    // Get contract data from request
    const { contractText, title } = await req.json();

    if (!contractText) {
      return new NextResponse("Contract text is required", { status: 400 });
    }

    // Analyze contract using OpenAI
    try {
      const analysis = await analyzeContract(contractText);

      // Save to database
      const contract = await prisma.contract.create({
        data: {
          userId: dbUser.id,
          title: title || "Untitled Contract",
          originalText: contractText,
          riskLevel: analysis.riskLevel,
          issues: {
            create: analysis.issues.map(issue => ({
              type: issue.type,
              text: issue.text,
              explanation: issue.explanation,
              suggestion: issue.suggestion
            }))
          }
        },
        include: {
          issues: true
        }
      });

      return NextResponse.json(contract);
    } catch (error) {
      console.error("Error in OpenAI analysis:", error);
      return new NextResponse("AI analysis failed", { status: 500 });
    }
  } catch (error) {
    console.error("Error analyzing contract:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
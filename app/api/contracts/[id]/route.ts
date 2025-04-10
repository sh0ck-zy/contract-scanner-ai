// app/api/contracts/[id]/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const contractId = params?.id;
    if (!contractId) {
      return new NextResponse("Contract ID is required", { status: 400 });
    }

    // Find the user in our database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const contract = await db.contract.findUnique({
      where: {
        id: contractId,
        userId: dbUser.id,
      },
      include: {
        issues: true,
      },
    });

    if (!contract) {
      return new NextResponse("Contract not found", { status: 404 });
    }

    // Format the response to match the frontend expectations
    const formattedContract = {
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
      issues: contract.issues.map(issue => ({
        type: issue.type,
        description: issue.text,
        severityScore: issue.severityScore,
        industryRelevance: issue.industryRelevance || "GENERAL"
      })),
      createdAt: contract.createdAt.toISOString(),
      updatedAt: contract.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      contract: formattedContract
    });
  } catch (error) {
    console.error("Error fetching contract:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
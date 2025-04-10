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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!params?.id) {
      return NextResponse.json({ error: "Contract ID is required" }, { status: 400 });
    }

    const contractId = params.id;
    
    // Find the user in our database
    const dbUser = await db.user.findUnique({
      where: { clerkId: userId }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }

    // Helper function to safely parse JSON or handle arrays
    const safeParseJSON = (value: string | string[] | null | undefined, defaultValue: any[] = []) => {
      if (!value) return defaultValue;
      if (Array.isArray(value)) return value;
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return defaultValue;
      }
    };

    // Format the response to match the frontend expectations
    return NextResponse.json({
      success: true,
      contract: {
        id: contract.id,
        title: contract.title || "Untitled Contract",
        originalText: contract.originalText || "",
        riskLevel: contract.riskLevel || "MEDIUM",
        contractType: contract.contractType || "OTHER",
        recommendedActions: safeParseJSON(contract.recommendedActions),
        complianceFlags: safeParseJSON(contract.complianceFlags),
        issues: (contract.issues || []).map(issue => ({
          id: issue.id,
          type: issue.type || "Unknown Issue",
          description: issue.text || "No description available",
          severityScore: typeof issue.severityScore === 'number' ? issue.severityScore : 0,
          industryRelevance: issue.industryRelevance || "GENERAL"
        })),
        createdAt: contract.createdAt?.toISOString() || new Date().toISOString(),
        updatedAt: contract.updatedAt?.toISOString() || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error("Error fetching contract:", error);
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error occurred"
    }, { status: 500 });
  }
}
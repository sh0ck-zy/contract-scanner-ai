// app/api/contracts/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    // Get headers first
    const headersList = headers();
    
    // Then handle auth
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ 
        error: "Unauthorized",
        contracts: [] 
      }, { status: 401 });
    }

    try {
      // Get or create user in database
      const dbUser = await db.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          subscriptionStatus: "FREE",
        },
      });

      // Get all contracts for the user
      const contracts = await db.contract.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        include: { 
          issues: true,
          comparisons: true,
          revisedComparisons: true,
        },
      });

      return NextResponse.json({
        success: true,
        contracts: contracts.map(contract => ({
          id: contract.id,
          title: contract.title,
          createdAt: contract.createdAt,
          riskLevel: contract.riskLevel,
          type: contract.contractType,
          issues: contract.issues.map(issue => ({
            type: issue.type,
            text: issue.text,
            severityScore: issue.severityScore
          }))
        }))
      });
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ 
        error: "Database operation failed",
        details: dbError instanceof Error ? dbError.message : "Unknown error",
        contracts: []
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in contracts API route:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: error instanceof Error ? error.message : "Unknown error",
      contracts: []
    }, { status: 500 });
  }
}
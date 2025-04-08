// app/api/contracts/route.ts
import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
      // Check if we can connect to the database
      await db.$connect();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Return an empty array instead of an error for new users/installations
      return NextResponse.json([]);
    }

    // Get or create user in database
    let dbUser;
    try {
      dbUser = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!dbUser) {
        // Create user if they don't exist
        dbUser = await db.user.create({
          data: {
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            subscriptionStatus: "FREE",
          },
        });
      }
    } catch (userError) {
      console.error("Error finding or creating user:", userError);
      // Return empty array for new installations
      return NextResponse.json([]);
    }

    // Get all contracts for the user
    try {
      const contracts = await db.contract.findMany({
        where: { userId: dbUser.id },
        orderBy: { createdAt: "desc" },
        include: { 
          issues: true,
          originalComparisons: true,
          revisedComparisons: true,
        },
      });

      return NextResponse.json(contracts);
    } catch (contractsError) {
      console.error("Error fetching contracts:", contractsError);
      // Return empty array if we can't fetch contracts
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Error in contracts API route:", error);
    // Return empty array instead of error for better user experience
    return NextResponse.json([]);
  }
}
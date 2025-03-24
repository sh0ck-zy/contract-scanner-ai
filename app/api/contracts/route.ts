// app/api/contracts/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get all contracts for the user
    const contracts = await prisma.contract.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      include: { issues: true },
    });

    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
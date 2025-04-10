import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();
    
    // Check if requester is admin
    const adminUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await db.systemSettings.findFirst();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    
    // Check if requester is admin
    const adminUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: { role: true }
    });

    if (!adminUser || adminUser.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { maxFileSize, allowedFileTypes } = body;

    const settings = await db.systemSettings.upsert({
      where: { id: "1" },
      update: {
        maxFileSize,
        allowedFileTypes,
      },
      create: {
        id: "1",
        maxFileSize,
        allowedFileTypes,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
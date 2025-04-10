import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { role, subscriptionStatus } = body;

    const user = await db.user.update({
      where: { id: params.id },
      data: {
        role,
        subscriptionStatus,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    await db.user.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api-utils";
import { Prisma } from "@prisma/client";

type UserMetadata = {
    industry?: string;
    region?: string;
    preferences?: any;
};

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { clerkId: userId },
            select: {
                metadata: true,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const metadata = (user.metadata as UserMetadata) || {};
        return NextResponse.json(metadata);
    } catch (error) {
        console.error("[USER_PREFERENCES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { industry, region, preferences } = body;

        const user = await db.user.findUnique({
            where: { clerkId: userId },
            select: {
                metadata: true,
            },
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const currentMetadata = (user.metadata as UserMetadata) || {};
        const updatedMetadata = {
            ...currentMetadata,
            industry,
            region,
            preferences,
        };

        const updatedUser = await db.user.update({
            where: { clerkId: userId },
            data: {
                metadata: updatedMetadata as Prisma.JsonValue,
            },
            select: {
                metadata: true,
            },
        });

        return NextResponse.json(updatedUser.metadata || {});
    } catch (error) {
        console.error("[USER_PREFERENCES_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const { userId } = auth()
        const user = await currentUser()

        if (!userId || !user) {
            return errorResponse("Unauthorized", 401)
        }

        // Get request body
        const { industry, region } = await req.json()

        if (!industry || !region) {
            return errorResponse("Industry and region are required", 400)
        }

        // Get or create DB user
        let dbUser = await db.user.findUnique({
            where: { clerkId: userId },
        })

        if (!dbUser) {
            // Create user in database
            dbUser = await db.user.create({
                data: {
                    clerkId: userId,
                    email: user.emailAddresses[0].emailAddress,
                },
            })
        }

        // Update user preferences
        await db.user.update({
            where: { id: dbUser.id },
            data: {
                metadata: {
                    ...((dbUser.metadata as any) || {}),
                    industry,
                    region,
                },
            },
        })

        return successResponse({ success: true })
    } catch (error) {
        console.error("Error saving user preferences:", error)
        return errorResponse("Internal Server Error")
    }
}


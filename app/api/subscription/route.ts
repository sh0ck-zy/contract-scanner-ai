// app/api/subscription/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { getSubscription } from "@/lib/stripe";

export async function GET() {
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

        // Get subscription details from Stripe if customer ID exists
        let subscriptionDetails = null;
        if (dbUser.stripeCustomerId) {
            subscriptionDetails = await getSubscription(dbUser.stripeCustomerId);
        }

        return NextResponse.json({
            status: dbUser.subscriptionStatus || 'inactive',
            subscription: subscriptionDetails,
        });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
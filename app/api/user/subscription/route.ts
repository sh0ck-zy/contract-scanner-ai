import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { getSubscription } from '@/lib/stripe';

export async function GET() {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { clerkId: user.id },
        });

        if (!dbUser) {
            return new NextResponse("User not found", { status: 404 });
        }

        // Get subscription details from Stripe if subscriptionId exists
        let subscriptionDetails = null;
        if (dbUser.subscriptionId) {
            subscriptionDetails = await getSubscription(dbUser.subscriptionId);
        }

        return NextResponse.json({
            status: dbUser.subscriptionStatus,
            subscription: subscriptionDetails,
        });
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
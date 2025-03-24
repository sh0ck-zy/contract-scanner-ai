import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { createPortalSession } from '@/lib/stripe';

export async function POST(req: Request) {
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

        if (!dbUser.stripeCustomerId) {
            return new NextResponse("No Stripe customer found", { status: 400 });
        }

        // Create Stripe portal session
        const session = await createPortalSession(
            dbUser.stripeCustomerId,
            `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`
        );

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating portal session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
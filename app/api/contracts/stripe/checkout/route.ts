import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs';
import { prisma } from '@/lib/db';
import { createCheckoutSession, getOrCreateCustomer, PRODUCTS } from '@/lib/stripe';

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

        const { plan } = await req.json();
        let priceId;

        switch (plan) {
            case 'monthly':
                priceId = PRODUCTS.PRO.MONTHLY;
                break;
            case 'yearly':
                priceId = PRODUCTS.PRO.YEARLY;
                break;
            default:
                return new NextResponse("Invalid plan", { status: 400 });
        }

        // Get or create Stripe customer
        const customerId = await getOrCreateCustomer(
            dbUser.id,
            user.emailAddresses[0].emailAddress
        );

        // Create Stripe checkout session
        const session = await createCheckoutSession({
            priceId,
            customerId,
            metadata: { userId: dbUser.id },
            successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Error creating checkout session:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
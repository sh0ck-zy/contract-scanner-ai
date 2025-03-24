import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`Webhook signature verification failed: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Handle the event
    try {
        switch (event.type) {
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error(`Error handling webhook: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }
}

async function handleSubscriptionCreated(subscription: any) {
    const customerId = subscription.customer;
    const subscriptionId = subscription.id;
    const status = subscription.status;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error(`No user found with Stripe customer ID: ${customerId}`);
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            subscriptionId,
            subscriptionStatus: status === 'active' ? 'ACTIVE' : status.toUpperCase(),
        },
    });

    // Send welcome email
    await sendEmail({
        to: user.email,
        subject: 'Welcome to ContractScan Pro!',
        text: `Thank you for subscribing to ContractScan Pro! Your subscription is now active.`,
        html: `
      <h1>Welcome to ContractScan Pro!</h1>
      <p>Thank you for subscribing. Your subscription is now active.</p>
      <p>With ContractScan Pro, you now have access to:</p>
      <ul>
        <li>Unlimited contract analyses</li>
        <li>Advanced issue detection</li>
        <li>Custom contract templates</li>
        <li>Priority support</li>
      </ul>
      <p>Let's get started analyzing your contracts and protecting your business!</p>
    `,
    });
}

async function handleSubscriptionUpdated(subscription: any) {
    const customerId = subscription.customer;
    const status = subscription.status;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error(`No user found with Stripe customer ID: ${customerId}`);
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            subscriptionStatus: status === 'active' ? 'ACTIVE' : status.toUpperCase(),
        },
    });

    // Handle subscription changes based on logic from webhook-handler.js
}

async function handleSubscriptionDeleted(subscription: any) {
    const customerId = subscription.customer;

    const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (!user) {
        console.error(`No user found with Stripe customer ID: ${customerId}`);
        return;
    }

    await prisma.user.update({
        where: { id: user.id },
        data: {
            subscriptionStatus: 'CANCELED',
            subscriptionId: null,
        },
    });

    // Send cancellation email based on logic from webhook-handler.js
}

async function handleInvoicePaymentSucceeded(invoice: any) {
    // Implementation based on logic from webhook-handler.js
}

async function handleInvoicePaymentFailed(invoice: any) {
    // Implementation based on logic from webhook-handler.js
}
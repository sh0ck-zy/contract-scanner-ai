import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse("Missing signature or webhook secret", { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object)
        break
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object)
        break
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error(`Error handling webhook: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 })
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const customerId = subscription.customer

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`No user found for customer ID: ${customerId}`)
    return
  }

  // Update user subscription status
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "ACTIVE",
      subscriptionId: subscription.id,
    },
  })

  // Send confirmation email
  // Implementation would go here
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`No user found for customer ID: ${customerId}`)
    return
  }

  // Update user subscription status based on subscription status
  const status = subscription.status === "active" ? "ACTIVE" : subscription.status === "trialing" ? "TRIAL" : "INACTIVE"

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: status,
      subscriptionId: subscription.id,
    },
  })
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer

  // Find user by Stripe customer ID
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  })

  if (!user) {
    console.error(`No user found for customer ID: ${customerId}`)
    return
  }

  // Update user subscription status
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: "INACTIVE",
      subscriptionId: null,
    },
  })
}


import Stripe from "stripe"
import { prisma } from "./db"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Define product and price IDs
export const PRODUCTS = {
  PRO: {
    MONTHLY: process.env.STRIPE_PRICE_MONTHLY || "price_monthly_id",
    YEARLY: process.env.STRIPE_PRICE_YEARLY || "price_yearly_id",
  },
}

/**
 * Creates a Stripe Checkout session for subscription
 */
export async function createCheckoutSession({
  priceId,
  customerId,
  metadata = {},
  successUrl,
  cancelUrl,
}: {
  priceId: string
  customerId: string
  metadata?: Record<string, string>
  successUrl: string
  cancelUrl: string
}) {
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    metadata,
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

/**
 * Get or create a Stripe customer for the user
 */
export async function getOrCreateCustomer(userId: string, email: string) {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId
  }

  // Create a new customer
  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  })

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  })

  return customer.id
}

/**
 * Create a billing portal session for managing subscriptions
 */
export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

/**
 * Get subscription details for a customer
 */
export async function getSubscription(customerId: string) {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    expand: ['data.default_payment_method'],
  })

  return subscriptions.data[0]
}


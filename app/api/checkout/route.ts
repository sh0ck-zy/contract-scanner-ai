import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { createCheckoutSession, getOrCreateCustomer, PRODUCTS } from "@/lib/stripe"

export async function POST(req: Request) {
  try {
    const user = await currentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    const { plan } = await req.json()

    if (!plan || !["monthly", "yearly"].includes(plan)) {
      return new NextResponse("Invalid plan", { status: 400 })
    }

    // Get price ID based on plan
    const priceId = plan === "monthly" ? PRODUCTS.PRO.MONTHLY : PRODUCTS.PRO.YEARLY

    // Get or create Stripe customer
    const email = user.emailAddresses[0]?.emailAddress
    if (!email) {
      return new NextResponse("User email not found", { status: 400 })
    }

    const customerId = await getOrCreateCustomer(dbUser.id, email)

    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      customerId,
      metadata: { userId: dbUser.id },
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=canceled`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


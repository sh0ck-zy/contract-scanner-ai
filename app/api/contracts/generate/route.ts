import { NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { generateContract } from "@/lib/ai/generate-contract"
import { Prisma } from "@prisma/client"

export const runtime = "nodejs" // Explicitly set to nodejs runtime

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const { userId } = await auth()
        const user = await currentUser()

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        // Get DB user or create if it doesn't exist
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

        // Check subscription for premium features
        if (dbUser.subscriptionStatus !== "ACTIVE" && dbUser.subscriptionStatus !== "TRIAL") {
            return new NextResponse("Subscription required for contract generation", { status: 403 })
        }

        // Get contract requirements from request
        const contractRequirements = await req.json()

        // Generate contract
        try {
            const contractText = await generateContract(contractRequirements)

            // Save to database
            const contract = await db.contract.create({
                data: {
                    userId: dbUser.id,
                    title: contractRequirements.projectType + " Contract for " + contractRequirements.clientName,
                    originalText: contractText,
                    metadata: {
                        industry: contractRequirements.industry,
                        region: contractRequirements.region,
                        projectType: contractRequirements.projectType,
                    } as Prisma.JsonValue,
                    contractType: "GENERATED",
                },
            })

            return NextResponse.json({
                contractId: contract.id,
                contractText,
            })
        } catch (error) {
            console.error("Error in contract generation:", error)
            return new NextResponse("Contract generation failed", { status: 500 })
        }
    } catch (error) {
        console.error("Error generating contract:", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}


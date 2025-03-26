import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { errorResponse, successResponse } from "@/lib/api-utils"

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
        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!dbUser) {
            // Create user in database
            dbUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: user.emailAddresses[0].emailAddress,
                },
            })
        }

        // Update user preferences
        await prisma.user.update({
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

export async function GET(req: Request) {
    try {
        // Get authenticated user
        const { userId } = auth()

        if (!userId) {
            return errorResponse("Unauthorized", 401)
        }

        // Get DB user
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!dbUser) {
            return errorResponse("User not found", 404)
        }

        // Return user preferences
        return successResponse({
            industry: (dbUser.metadata as any)?.industry || "general",
            region: (dbUser.metadata as any)?.region || "US",
        })
    } catch (error) {
        console.error("Error fetching user preferences:", error)
        return errorResponse("Internal Server Error")
    }
}


import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { errorResponse, successResponse } from "@/lib/api-utils"

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        // Get authenticated user
        const { userId } = auth()

        if (!userId) {
            return errorResponse("Unauthorized", 401)
        }

        // Get DB user
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true },
        })

        if (!dbUser) {
            return errorResponse("User not found", 404)
        }

        // Get comparison
        const comparison = await prisma.contractComparison.findUnique({
            where: {
                id: params.id,
                userId: dbUser.id,
            },
            include: {
                originalContract: {
                    select: {
                        id: true,
                        title: true,
                        originalText: true,
                    },
                },
                revisedContract: {
                    select: {
                        id: true,
                        title: true,
                        originalText: true,
                    },
                },
            },
        })

        if (!comparison) {
            return errorResponse("Comparison not found", 404)
        }

        return successResponse({
            originalContract: {
                id: comparison.originalContract.id,
                title: comparison.originalContract.title,
                text: comparison.originalContract.originalText,
            },
            revisedContract: {
                id: comparison.revisedContract.id,
                title: comparison.revisedContract.title,
                text: comparison.revisedContract.originalText,
            },
            differences: comparison.differences,
        })
    } catch (error) {
        console.error("Error fetching comparison:", error)
        return errorResponse("Internal Server Error")
    }
}


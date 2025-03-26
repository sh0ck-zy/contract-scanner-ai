import { auth } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { errorResponse, successResponse, validateRequiredFields } from "@/lib/api-utils"
import { compareContracts } from "@/lib/ai/compare-contracts"

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const { userId } = auth()

        if (!userId) {
            return errorResponse("Unauthorized", 401)
        }

        // Get request body
        const { originalId, revisedId } = await req.json()

        const validationError = validateRequiredFields({ originalId, revisedId }, ["originalId", "revisedId"])
        if (validationError) {
            return errorResponse(validationError, 400)
        }

        // Get DB user
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
            select: { id: true, subscriptionStatus: true },
        })

        if (!dbUser) {
            return errorResponse("User not found", 404)
        }

        // Check if user has access to both contracts
        const originalContract = await prisma.contract.findUnique({
            where: {
                id: originalId,
                userId: dbUser.id,
            },
            select: {
                id: true,
                title: true,
                originalText: true,
            },
        })

        const revisedContract = await prisma.contract.findUnique({
            where: {
                id: revisedId,
                userId: dbUser.id,
            },
            select: {
                id: true,
                title: true,
                originalText: true,
            },
        })

        if (!originalContract || !revisedContract) {
            return errorResponse("One or both contracts not found", 404)
        }

        // Compare contracts
        const comparisonResult = await compareContracts(originalContract.originalText, revisedContract.originalText)

        // Save comparison to database
        const comparison = await prisma.contractComparison.create({
            data: {
                userId: dbUser.id,
                originalContractId: originalId,
                revisedContractId: revisedId,
                differences: comparisonResult,
            },
        })

        return successResponse({
            comparisonId: comparison.id,
            originalContract: {
                id: originalContract.id,
                title: originalContract.title,
                text: originalContract.originalText,
            },
            revisedContract: {
                id: revisedContract.id,
                title: revisedContract.title,
                text: revisedContract.originalText,
            },
            differences: comparisonResult,
        })
    } catch (error) {
        console.error("Error comparing contracts:", error)
        return errorResponse("Internal Server Error")
    }
}


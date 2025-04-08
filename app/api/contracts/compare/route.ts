import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { compareContracts } from "@/lib/ai/compare-contracts";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { originalText, revisedText } = await req.json();

        if (!originalText || !revisedText) {
            return new NextResponse("Both original and revised texts are required", { status: 400 });
        }

        const comparison = await compareContracts(originalText, revisedText);

        // First create the original contract
        const originalContract = await db.contract.create({
            data: {
                userId,
                title: "Original Contract",
                originalText,
                riskLevel: comparison.riskAssessment.originalRisk,
                recommendedActions: comparison.riskAssessment.improvements,
                complianceFlags: comparison.riskAssessment.concerns,
            },
        });

        // Then create the revised contract
        const revisedContract = await db.contract.create({
            data: {
                userId,
                title: "Revised Contract",
                originalText: revisedText,
                riskLevel: comparison.riskAssessment.revisedRisk,
                recommendedActions: comparison.riskAssessment.improvements,
                complianceFlags: comparison.riskAssessment.concerns,
            },
        });

        // Finally create the comparison
        const contractComparison = await db.contractComparison.create({
            data: {
                userId,
                originalContractId: originalContract.id,
                revisedContractId: revisedContract.id,
                differences: comparison.differences,
            },
        });

        return NextResponse.json({
            comparison: contractComparison,
            originalContract,
            revisedContract,
            analysis: comparison,
        });
    } catch (error) {
        console.error("[CONTRACT_COMPARE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


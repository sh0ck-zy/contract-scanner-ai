// app/api/contracts/analyze/route.ts
import { NextResponse } from "next/server";
import { analyzeContract } from "@/lib/ai/analyze-contract";

export async function POST(req: Request) {
  try {
    const { contractText, title } = await req.json();

    if (!contractText) {
      return new NextResponse("Contract text is required", { status: 400 });
    }

    // Log to help with debugging
    console.log("Analyzing contract:", { title });

    // Analyze contract using OpenAI
    try {
      const analysis = await analyzeContract(contractText);

      // For testing/demo, create a mock contract with ID
      const mockContract = {
        id: "demo-" + Date.now(),
        title: title || "Untitled Contract",
        createdAt: new Date().toISOString(),
        originalText: contractText,
        riskLevel: analysis.riskLevel,
        issues: analysis.issues,
      };

      return NextResponse.json(mockContract);

    } catch (error) {
      console.error("Error in OpenAI analysis:", error);
      return new NextResponse("AI analysis failed", { status: 500 });
    }
  } catch (error) {
    console.error("Error analyzing contract:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
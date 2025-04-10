import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { analyzeContractAdvanced } from "@/lib/ai/analyze-contract-enhanced"
// import { sendAnalysisCompletionEmail } from "@/lib/email"

export const config = {
  runtime: "nodejs"
}

export async function POST(req: NextRequest) {
  try {
    console.log("[CONTRACT_ANALYSIS] Starting analysis process")
    
    // Get user data from Clerk
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      console.log("[CONTRACT_ANALYSIS] Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { text, title, freelancerType, industry, region } = await req.json()
    
    if (!text) {
      console.log("[CONTRACT_ANALYSIS] No text provided")
      return NextResponse.json({ error: "No text provided" }, { status: 400 })
    }

    // Log the input for debugging
    console.log("[CONTRACT_ANALYSIS] Input:", {
      textLength: text.length,
      title,
      freelancerType,
      industry,
      region
    })
    
    // Analyze the contract with AI
    let analysis;
    try {
      analysis = await analyzeContractAdvanced(text, {
        industry: industry || freelancerType,
        region,
      });
      console.log("[CONTRACT_ANALYSIS] Analysis result:", {
        riskLevel: analysis.riskLevel,
        contractType: analysis.contractType,
        issuesCount: analysis.issues.length,
        recommendedActionsCount: analysis.recommendedActions.length,
        complianceFlagsCount: analysis.complianceFlags.length
      });
    } catch (error) {
      console.error("[CONTRACT_ANALYSIS] Analysis error:", error);
      return NextResponse.json({ 
        error: "Failed to analyze contract",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }
    
    // Save contract to the database
    let contract;
    try {
      // Get or create user in database
      const dbUser = await db.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
          clerkId: userId,
          email: user.emailAddresses[0].emailAddress,
          subscriptionStatus: "FREE"
        }
      });
      
      console.log(`[CONTRACT_ANALYSIS] User ${dbUser.id} found/created`);
      
      // Create contract with analysis results
      contract = await db.contract.create({
        data: {
          userId: dbUser.id,
          title: title || "Untitled Contract",
          originalText: text,
          riskLevel: analysis.riskLevel,
          contractType: analysis.contractType,
          recommendedActions: JSON.stringify(analysis.recommendedActions || []),
          complianceFlags: JSON.stringify(analysis.complianceFlags || []),
          issues: {
            create: (analysis.issues || []).map(issue => ({
              type: issue.type || "OTHER",
              text: issue.text || "",
              explanation: issue.explanation || "",
              suggestion: issue.suggestion || "",
              severityScore: issue.severityScore || 5,
              industryRelevance: issue.industryRelevance || "GENERAL"
            }))
          }
        },
        include: {
          issues: true
        }
      });
      
      console.log(`[CONTRACT_ANALYSIS] Contract ${contract.id} saved with:`, {
        issuesCount: contract.issues.length,
        riskLevel: contract.riskLevel,
        contractType: contract.contractType
      });
      
      return NextResponse.json({
        success: true,
        contract: {
          id: contract.id,
          title: contract.title,
          riskLevel: contract.riskLevel,
          contractType: contract.contractType,
          recommendedActions: typeof contract.recommendedActions === 'string' 
            ? JSON.parse(contract.recommendedActions)
            : contract.recommendedActions || [],
          complianceFlags: typeof contract.complianceFlags === 'string'
            ? JSON.parse(contract.complianceFlags)
            : contract.complianceFlags || [],
          issues: contract.issues,
          createdAt: contract.createdAt
        }
      });
    } catch (error) {
      console.error("[CONTRACT_ANALYSIS] Database error:", error);
      return NextResponse.json({ 
        error: "Error saving contract",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[CONTRACT_ANALYSIS] Unexpected error:", error);
    return NextResponse.json({ 
      error: "Server error",
      details: error.message || "Unknown error"
    }, { status: 500 });
  }
}

// Função para gerar uma análise simulada para desenvolvimento
function generateMockAnalysis(contractText: string, freelancerType: string = "general") {
  // Detectar problemas comuns baseados em palavras-chave
  const hasPaymentIssue = contractText.toLowerCase().includes("payment") || Math.random() > 0.7;
  const hasDeadlineIssue = contractText.toLowerCase().includes("deadline") || Math.random() > 0.7;
  const hasIntellectualPropertyIssue = contractText.toLowerCase().includes("intellectual property") || Math.random() > 0.7;
  const hasLiabilityIssue = contractText.toLowerCase().includes("liability") || Math.random() > 0.7;
  
  // Calcular nível de risco baseado no número de questões detectadas
  const issuesCount = [hasPaymentIssue, hasDeadlineIssue, hasIntellectualPropertyIssue, hasLiabilityIssue].filter(Boolean).length;
  const riskLevel = issuesCount <= 1 ? "LOW" : issuesCount <= 2 ? "MEDIUM" : "HIGH";
  
  // Gerar issues baseadas em palavras-chave
  const issues = [];
  
  if (hasPaymentIssue) {
    issues.push({
      type: "PAYMENT",
      text: "Payment terms are not clearly defined",
      explanation: "The contract does not specify clear payment deadlines or consequences for late payments.",
      suggestion: "Add specific payment terms including amounts, deadlines, and consequences for late payments.",
      severity: "HIGH",
      severityScore: 8
    });
  }
  
  if (hasDeadlineIssue) {
    issues.push({
      type: "DEADLINE",
      text: "Project deadlines are vague",
      explanation: "The contract does not have specific project milestones or completion dates.",
      suggestion: "Include specific deadlines for each project phase and the final deliverable.",
      severity: "MEDIUM",
      severityScore: 5
    });
  }
  
  if (hasIntellectualPropertyIssue) {
    issues.push({
      type: "INTELLECTUAL_PROPERTY",
      text: "Intellectual property rights are not clearly assigned",
      explanation: "The contract is unclear about who owns the intellectual property created during the project.",
      suggestion: "Explicitly state that you retain ownership of your work until final payment is received.",
      severity: "HIGH",
      severityScore: 9
    });
  }
  
  if (hasLiabilityIssue) {
    issues.push({
      type: "LIABILITY",
      text: "Unlimited liability clause",
      explanation: "The contract has an unlimited liability clause that puts you at financial risk.",
      suggestion: "Add a liability cap that limits your financial exposure to the value of the contract.",
      severity: "HIGH",
      severityScore: 10
    });
  }
  
  // Se não encontramos nenhum problema, adicione um genérico
  if (issues.length === 0) {
    issues.push({
      type: "GENERAL",
      text: "Contract is too vague",
      explanation: "The contract doesn't have enough specific details about the work to be performed.",
      suggestion: "Add more detailed scope of work with specific deliverables and acceptance criteria.",
      severity: "MEDIUM",
      severityScore: 6
    });
  }
  
  // Adicionar ações recomendadas baseadas nas issues
  const recommendedActions = issues.map(issue => 
    `Review ${issue.type.toLowerCase()} terms: ${issue.suggestion}`
  );
  
  // Retornar a análise completa
  return {
    riskLevel,
    type: "FREELANCE",
    issues,
    recommendedActions,
    complianceFlags: []
  };
}


"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle,
  Copy,
  Download,
  FileText,
  Loader2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ComplianceAlerts } from "@/components/compliance-alerts"
import { EducationalResources } from "@/components/educational-resources"
import { ConfidenceScore } from "@/components/marketing/confidence-score"

interface Issue {
  id: string
  type: string
  text: string
  explanation: string
  suggestion: string
  severityScore?: number
  industryRelevance?: string[]
}

interface Contract {
  id: string
  title: string
  createdAt: string
  riskLevel: "High" | "Medium" | "Low"
  originalText: string
  issues: Issue[]
  recommendedActions?: string[]
  complianceFlags?: string[]
  metadata?: {
    industry?: string
    region?: string
    industrySpecificRisk?: Record<string, number>
  }
}

export default function ContractResultsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { id } = params
  const [contract, setContract] = useState<Contract | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("issues")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [confidenceScore, setConfidenceScore] = useState(0)

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setIsLoading(true)

        const response = await fetch(`/api/contracts/${id}`)

        if (!response.ok) {
          throw new Error("Failed to fetch contract")
        }

        const data = await response.json()
        setContract(data)

        // Calculate confidence score based on risk level and issues
        let score = 0
        if (data.riskLevel === "Low") score = 85
        else if (data.riskLevel === "Medium") score = 65
        else score = 45

        // Adjust score based on number of issues
        score -= Math.min(20, data.issues.length * 2)

        // Ensure score is between 0 and 100
        score = Math.max(0, Math.min(100, score))

        setConfidenceScore(score)
      } catch (error) {
        console.error("Error fetching contract data:", error)
        toast({
          title: "Error",
          description: "Failed to load contract data. Please try again.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContractData()
  }, [id, router, toast])

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)

    toast({
      title: "Copied to clipboard",
      description: "The suggested text has been copied to your clipboard.",
    })

    setTimeout(() => {
      setCopiedIndex(null)
    }, 2000)
  }

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF
    toast({
      title: "Export PDF",
      description: "PDF export functionality would be implemented here.",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-neutral-600">Loading contract analysis...</p>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-[#EF4444] mb-4" />
        <h2 className="text-xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-neutral-600 mb-6">
          The contract you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
      </div>
    )
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return <AlertCircle className="h-6 w-6 text-[#EF4444]" />
      case "Medium":
        return <AlertTriangle className="h-6 w-6 text-[#F59E0B]" />
      case "Low":
        return <CheckCircle className="h-6 w-6 text-[#10B981]" />
      default:
        return null
    }
  }

  // Get the most common issue type for educational resources
  const getMainIssueType = () => {
    if (!contract.issues || contract.issues.length === 0) return "general"

    const issueTypes = contract.issues.map((issue) => issue.type.toLowerCase())
    const typeCount: Record<string, number> = {}

    issueTypes.forEach((type) => {
      if (type.includes("payment")) typeCount["payment_terms"] = (typeCount["payment_terms"] || 0) + 1
      else if (type.includes("revision")) typeCount["revision_policy"] = (typeCount["revision_policy"] || 0) + 1
      else if (type.includes("intellectual") || type.includes("copyright"))
        typeCount["intellectual_property"] = (typeCount["intellectual_property"] || 0) + 1
      else if (type.includes("scope")) typeCount["scope_definition"] = (typeCount["scope_definition"] || 0) + 1
    })

    let maxType = "general"
    let maxCount = 0

    Object.entries(typeCount).forEach(([type, count]) => {
      if (count > maxCount) {
        maxType = type
        maxCount = count
      }
    })

    return maxType
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{contract.title}</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Analyzed on {new Date(contract.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center">
            <div className="flex items-center mr-6">
              {getRiskIcon(contract.riskLevel)}
              <span
                className={`ml-2 font-semibold ${contract.riskLevel === "High"
                    ? "text-[#EF4444]"
                    : contract.riskLevel === "Medium"
                      ? "text-[#F59E0B]"
                      : "text-[#10B981]"
                  }`}
              >
                {contract.riskLevel} Risk
              </span>
            </div>

            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportPDF}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-neutral-600">Risk Level</span>
                  <span
                    className={`font-semibold ${contract.riskLevel === "High"
                        ? "text-[#EF4444]"
                        : contract.riskLevel === "Medium"
                          ? "text-[#F59E0B]"
                          : "text-[#10B981]"
                      }`}
                  >
                    {contract.riskLevel}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-neutral-600">Issues Found</span>
                  <span className="font-semibold">{contract.issues.length}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-neutral-600">Contract Length</span>
                  <span className="font-semibold">
                    {contract.originalText.split(" ").length.toLocaleString()} words
                  </span>
                </div>

                <div className="space-y-2 mt-6">
                  <h3 className="font-semibold">Issue Types</h3>
                  <ul className="space-y-2">
                    {Object.entries(
                      contract.issues.reduce((acc: Record<string, number>, issue: Issue) => {
                        acc[issue.type] = (acc[issue.type] || 0) + 1
                        return acc
                      }, {}),
                    ).map(([type, count]) => (
                      <li key={type} className="flex items-center justify-between">
                        <span className="text-neutral-600">{type}</span>
                        <span className="font-semibold">{count}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {contract.recommendedActions && contract.recommendedActions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {contract.recommendedActions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-1" />
                      <span className="text-sm">{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {contract.complianceFlags && (
            <ComplianceAlerts complianceFlags={contract.complianceFlags} region={contract.metadata?.region || "US"} />
          )}

          <ConfidenceScore score={confidenceScore} contractId={contract.id} contractTitle={contract.title} />

          <EducationalResources industry={contract.metadata?.industry || "general"} issueType={getMainIssueType()} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="issues" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="issues" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Issues ({contract.issues.length})
              </TabsTrigger>
              <TabsTrigger value="original" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Original Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-6">
              {contract.issues.map((issue: Issue, index: number) => (
                <Card
                  key={issue.id}
                  className={`border-l-4 ${issue.type.includes("Payment") || issue.type.includes("Copyright")
                      ? "border-l-[#EF4444]"
                      : issue.type.includes("Revision") || issue.type.includes("Termination")
                        ? "border-l-[#F59E0B]"
                        : "border-l-[#0D9488]"
                    }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{issue.type}</span>
                      {issue.severityScore && (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${issue.severityScore > 7
                              ? "bg-red-100 text-red-700"
                              : issue.severityScore > 4
                                ? "bg-amber-100 text-amber-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          Severity: {issue.severityScore}/10
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-[#EF4444]/5 border-l-4 border-[#EF4444] rounded p-4">
                      <h4 className="text-sm font-medium text-[#EF4444] mb-2">Problematic Clause:</h4>
                      <p className="text-sm font-mono">{issue.text}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Why It's a Problem:</h4>
                      <p className="text-sm text-neutral-700">{issue.explanation}</p>
                    </div>

                    <div className="bg-[#10B981]/5 border-l-4 border-[#10B981] rounded p-4 relative">
                      <h4 className="text-sm font-medium text-[#10B981] mb-2">Suggested Alternative:</h4>
                      <p className="text-sm font-mono pr-8">{issue.suggestion}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 h-8 w-8 p-0"
                        onClick={() => copyToClipboard(issue.suggestion, index)}
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-[#10B981]" />
                        ) : (
                          <Copy className="h-4 w-4 text-neutral-500" />
                        )}
                      </Button>
                    </div>

                    {issue.industryRelevance && issue.industryRelevance.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {issue.industryRelevance.map((industry, i) => (
                          <span key={i} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                            {industry}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {contract.issues.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <CheckCircle className="h-12 w-12 text-[#10B981] mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
                  <p className="text-neutral-600 max-w-md mx-auto">
                    Good news! We didn't find any significant issues in your contract.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="original">
              <Card>
                <CardContent className="p-6">
                  <pre className="whitespace-pre-wrap font-mono text-sm bg-neutral-50 p-4 rounded-lg border overflow-auto max-h-[600px]">
                    {contract.originalText}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


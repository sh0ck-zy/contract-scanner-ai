"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
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
  Shield,
  DollarSign,
  FileCode,
  Clock,
  XCircle,
  MessageSquare,
  ThumbsUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ComplianceAlerts } from "@/components/compliance-alerts"
import { EducationalResources } from "@/components/educational-resources"
import { ConfidenceScore } from "@/components/confidence-score"

interface Issue {
  id: string
  type: "PAYMENT" | "IP" | "SCOPE" | "TERMINATION" | "LIABILITY" | "OTHER"
  text: string
  explanation: string
  suggestion: string
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

interface Contract {
  id: string
  title: string
  createdAt: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  type: "SERVICE" | "EMPLOYMENT" | "NDA" | "OTHER"
  originalText: string
  issues: Issue[]
  recommendedActions: string[]
  complianceFlags: string[]
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
        if (data.riskLevel === "LOW") score = 85
        else if (data.riskLevel === "MEDIUM") score = 65
        else if (data.riskLevel === "HIGH") score = 45
        else score = 25

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
        <p className="text-slate-600">Loading contract analysis...</p>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-slate-600 mb-6">
          The contract you're looking for doesn't exist or you don't have access to it.
        </p>
        <Button onClick={() => router.push("/dashboard")} className="bg-primary hover:bg-primary/90">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return <AlertCircle className="h-6 w-6 text-red-500" />
      case "HIGH":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "MEDIUM":
        return <AlertTriangle className="h-6 w-6 text-amber-500" />
      case "LOW":
        return <CheckCircle className="h-6 w-6 text-emerald-500" />
      default:
        return null
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return <DollarSign className="h-5 w-5" />
      case "IP":
        return <FileCode className="h-5 w-5" />
      case "SCOPE":
        return <Clock className="h-5 w-5" />
      case "TERMINATION":
        return <XCircle className="h-5 w-5" />
      case "LIABILITY":
        return <Shield className="h-5 w-5" />
      default:
        return <AlertCircle className="h-5 w-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200"
      case "HIGH":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-100"
      case "LOW":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-slate-100 text-slate-800 border-slate-200"
    }
  }

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1 px-3 py-1">
            <AlertCircle className="h-3 w-3" /> Critical Risk
          </Badge>
        );
      case "HIGH":
        return (
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1 px-3 py-1">
            <AlertTriangle className="h-3 w-3" /> High Risk
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100 flex items-center gap-1 px-3 py-1">
            <AlertTriangle className="h-3 w-3" /> Medium Risk
          </Badge>
        );
      case "LOW":
        return (
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200 flex items-center gap-1 px-3 py-1">
            <CheckCircle className="h-3 w-3" /> Low Risk
          </Badge>
        );
      default:
        return null;
    }
  };

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

  // Sort issues by severity for better visibility
  const sortedIssues = [...contract.issues].sort((a, b) => {
    const severityOrder = { "CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button 
        variant="ghost" 
        className="flex items-center gap-2 mb-6" 
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>

      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{contract.title}</h1>
            {getRiskBadge(contract.riskLevel)}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              Analyzed on {new Date(contract.createdAt).toLocaleDateString()}
            </span>
            <Button variant="outline" onClick={handleExportPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left sidebar */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="space-y-6 sticky top-4">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-slate-600">Risk Level</span>
                  <div className="flex items-center">
                    {getRiskIcon(contract.riskLevel)}
                    <span
                      className={
                        contract.riskLevel === "CRITICAL" || contract.riskLevel === "HIGH"
                          ? "ml-2 font-medium text-red-600"
                          : contract.riskLevel === "MEDIUM"
                          ? "ml-2 font-medium text-amber-600"
                          : "ml-2 font-medium text-emerald-600"
                      }
                    >
                      {contract.riskLevel.charAt(0) + contract.riskLevel.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-slate-600">Issues Found</span>
                  <span className="font-medium">{contract.issues.length}</span>
                </div>

                <div className="flex items-center justify-between border-b pb-4">
                  <span className="text-slate-600">Contract Type</span>
                  <span className="font-medium">
                    {contract.type.charAt(0) + contract.type.slice(1).toLowerCase().replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-3 mt-4">
                  <h3 className="font-medium">Issue Severity Breakdown</h3>
                  
                  {/* Severity breakdown */}
                  <div className="space-y-2">
                    {[
                      { 
                        label: "Critical", 
                        count: contract.issues.filter(i => i.severity === "CRITICAL").length, 
                        color: "bg-red-500" 
                      },
                      { 
                        label: "High", 
                        count: contract.issues.filter(i => i.severity === "HIGH").length, 
                        color: "bg-amber-500" 
                      },
                      { 
                        label: "Medium", 
                        count: contract.issues.filter(i => i.severity === "MEDIUM").length, 
                        color: "bg-amber-300" 
                      },
                      { 
                        label: "Low", 
                        count: contract.issues.filter(i => i.severity === "LOW").length, 
                        color: "bg-emerald-500" 
                      }
                    ].map(severity => (
                      <div key={severity.label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">{severity.label}</span>
                          <span className="font-medium">{severity.count}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`${severity.color} h-2 rounded-full`} 
                            style={{ width: `${contract.issues.length ? (severity.count / contract.issues.length) * 100 : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {contract.recommendedActions && contract.recommendedActions.length > 0 && (
                  <div className="space-y-3 mt-6 pt-4 border-t">
                    <h3 className="font-medium">Recommended Actions</h3>
                    <ul className="space-y-2">
                      {contract.recommendedActions.map((action, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <ThumbsUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <ConfidenceScore score={confidenceScore} className="mt-6 pt-4 border-t" />
              </CardContent>
            </Card>

            {contract.complianceFlags && contract.complianceFlags.length > 0 && (
              <ComplianceAlerts flags={contract.complianceFlags} />
            )}

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600">
                  Our legal experts can provide personalized guidance on improving this contract.
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Book a Consultation
                </Button>
              </CardContent>
            </Card>

            <EducationalResources resourceType={getMainIssueType()} />
          </div>
        </div>

        {/* Main content area */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <Tabs defaultValue="issues" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-slate-100 p-1 rounded-lg">
              <TabsTrigger value="issues" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white">
                <AlertTriangle className="h-4 w-4" /> Issues ({contract.issues.length})
              </TabsTrigger>
              <TabsTrigger value="original" className="flex items-center gap-2 rounded-md data-[state=active]:bg-white">
                <FileText className="h-4 w-4" /> Original Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="mt-6">
              <div className="space-y-6">
                {contract.issues.length === 0 ? (
                  <Card className="border-slate-200 bg-slate-50 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle className="h-16 w-16 text-emerald-500 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Issues Found</h3>
                      <p className="text-slate-500 text-center max-w-md">
                        Good news! We didn't find any significant issues in your contract.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Accordion type="multiple" className="space-y-4">
                    {sortedIssues.map((issue, index) => (
                      <AccordionItem 
                        key={issue.id} 
                        value={`issue-${index}`}
                        className="border border-slate-200 rounded-lg overflow-hidden shadow-sm"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50">
                          <div className="flex items-center gap-3 text-left">
                            <Badge 
                              variant="outline" 
                              className={`${getSeverityColor(issue.severity)} px-2 py-1 flex items-center gap-1`}
                            >
                              {getIssueIcon(issue.type)}
                              <span className="ml-1">{issue.type}</span>
                            </Badge>
                            <span className="font-medium text-slate-900 line-clamp-1">{issue.text}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-t px-6 py-4 bg-white">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Problematic Text</h4>
                              <div className="bg-slate-50 p-4 rounded-md border border-slate-200 text-sm font-mono">
                                {issue.text}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-slate-700 mb-2">Why This is an Issue</h4>
                              <p className="text-slate-600">{issue.explanation}</p>
                            </div>
                            
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-slate-700">Suggested Alternative</h4>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 h-7 text-primary hover:text-primary/90 hover:bg-primary/10"
                                  onClick={() => copyToClipboard(issue.suggestion, index)}
                                >
                                  {copiedIndex === index ? (
                                    <>
                                      <Check className="h-3.5 w-3.5" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" /> Copy
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="bg-primary/5 p-4 rounded-md border border-primary/10 text-sm">
                                {issue.suggestion}
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </TabsContent>

            <TabsContent value="original" className="mt-6">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Original Contract Text</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-md border border-slate-200 whitespace-pre-wrap font-mono text-sm max-h-[600px] overflow-y-auto">
                    {contract.originalText}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}


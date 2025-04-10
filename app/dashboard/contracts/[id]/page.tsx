"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { use } from "react"

// Utility function for date formatting
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    // Check if date is valid before formatting
    if (isNaN(date.getTime())) {
      return "N/A"
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  } catch (e) {
    console.error("Date formatting error:", e)
    return "N/A"
  }
}

interface Contract {
  id: string
  title: string
  originalText: string
  riskLevel: string
  contractType: string
  recommendedActions: string[]
  complianceFlags: string[]
  issues: {
    type: string
    description: string
    severityScore: number
    industryRelevance: string
  }[]
  createdAt: string
  updatedAt: string
}

export default function ContractResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Unwrap the params Promise
  const { id: contractId } = use(params)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        if (!contractId) {
          setError("Contract ID is required")
          setLoading(false)
          return
        }

        const response = await fetch(`/api/contracts/${contractId}`)
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to fetch contract: ${errorText}`)
        }

        const data = await response.json()
        if (!data.success || !data.contract) {
          throw new Error("Invalid contract data received")
        }

        setContract(data.contract)
      } catch (err) {
        console.error("Error fetching contract:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch contract")
      } finally {
        setLoading(false)
      }
    }

    fetchContract()
  }, [contractId])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="container mx-auto py-8">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Contract Not Found</h2>
          </div>
          <p className="mt-2 text-yellow-700">
            The requested contract could not be found.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{contract?.title || "Untitled Contract"}</h1>
          <p className="text-muted-foreground">
            Analyzed on {contract?.createdAt ? formatDate(contract.createdAt) : "N/A"}
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Risk Level
                </p>
                <Badge
                  variant={
                    contract?.riskLevel === "HIGH" || contract?.riskLevel === "CRITICAL"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {contract?.riskLevel || "MEDIUM"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contract Type
                </p>
                <p className="text-lg font-medium">{contract?.contractType || "OTHER"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract?.complianceFlags && contract.complianceFlags.length > 0 ? (
                <div className="space-y-2">
                  {contract.complianceFlags.map((flag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-green-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No compliance flags detected in this contract</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Issues Found</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract?.issues && contract.issues.length > 0 ? (
                contract.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            issue.severityScore >= 8
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {issue.type || "Unknown Issue"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Severity: {issue.severityScore || 0}/10
                        </span>
                      </div>
                      <Badge variant="outline">
                        {issue.industryRelevance || "GENERAL"}
                      </Badge>
                    </div>
                    <p className="mt-2">{issue.description || "No description available"}</p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No issues detected in this contract</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contract?.recommendedActions && contract.recommendedActions.length > 0 ? (
                <ul className="list-inside list-disc space-y-2">
                  {contract.recommendedActions.map((action, index) => (
                    <li key={index}>{action}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">
                  No specific actions needed for this contract
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


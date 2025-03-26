"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2, Plus, FileCheck } from "lucide-react"
import ContractCard from "@/components/contract-card"
import ContractStats from "@/components/dashboard/contract-stats"
import { useToast } from "@/hooks/use-toast"

interface Contract {
  id: string
  title: string
  createdAt: string
  riskLevel: "High" | "Medium" | "Low"
  issues: any[]
  contractType?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/contracts")

        if (!response.ok) {
          throw new Error("Failed to fetch contracts")
        }

        const data = await response.json()
        setContracts(data)
      } catch (error) {
        console.error("Error fetching contracts:", error)
        toast({
          title: "Error",
          description: "Failed to load contracts. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchContracts()
  }, [toast])

  // Get recent contracts (latest 3)
  const recentContracts = [...contracts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  // Calculate total issues
  const totalIssues = contracts.reduce((acc, contract) => acc + contract.issues.length, 0)

  // Calculate high risk contracts
  const highRiskContracts = contracts.filter((c) => c.riskLevel === "High").length

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-neutral-600">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back to ContractScan</p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Button
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
            onClick={() => router.push("/dashboard/contracts/new")}
          >
            <Plus className="h-4 w-4" /> Analyze Contract
          </Button>
          <Button
            className="bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2"
            onClick={() => router.push("/dashboard/contracts/generate")}
          >
            <FileCheck className="h-4 w-4" /> Generate Contract
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Contracts</CardTitle>
            <CardDescription>All contracts analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{contracts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">High Risk Contracts</CardTitle>
            <CardDescription>Contracts needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#EF4444]">{highRiskContracts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Issues Identified</CardTitle>
            <CardDescription>Total issues found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalIssues}</p>
          </CardContent>
        </Card>
      </div>

      {contracts.length > 0 && (
        <div className="mb-8">
          <ContractStats contracts={contracts} />
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Contracts</h2>
          <Button
            variant="outline"
            className="text-primary border-primary hover:bg-primary/10"
            onClick={() => router.push("/dashboard/contracts")}
          >
            View All
          </Button>
        </div>

        {recentContracts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
              />
            ))}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:col-span-3">
              <Card
                className="border-2 border-dashed border-neutral-200 bg-transparent hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center p-6"
                onClick={() => router.push("/dashboard/contracts/new")}
              >
                <div className="text-center">
                  <div className="mx-auto bg-neutral-100 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6 text-neutral-500" />
                  </div>
                  <h3 className="font-medium mb-1">Analyze New Contract</h3>
                  <p className="text-sm text-neutral-500">Upload or paste a contract</p>
                </div>
              </Card>

              <Card
                className="border-2 border-dashed border-neutral-200 bg-transparent hover:bg-neutral-50 transition-colors cursor-pointer flex items-center justify-center p-6"
                onClick={() => router.push("/dashboard/contracts/generate")}
              >
                <div className="text-center">
                  <div className="mx-auto bg-neutral-100 h-12 w-12 rounded-full flex items-center justify-center mb-3">
                    <FileCheck className="h-6 w-6 text-neutral-500" />
                  </div>
                  <h3 className="font-medium mb-1">Generate New Contract</h3>
                  <p className="text-sm text-neutral-500">Create a customized contract</p>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="mx-auto bg-neutral-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-neutral-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">No contracts yet</h3>
            <p className="text-neutral-600 max-w-md mx-auto mb-6">
              Start by analyzing your first contract to get insights and suggestions, or generate a new contract from
              scratch.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => router.push("/dashboard/contracts/new")}
              >
                Analyze Your First Contract
              </Button>
              <Button
                className="bg-secondary hover:bg-secondary/90 text-white"
                onClick={() => router.push("/dashboard/contracts/generate")}
              >
                Generate a Contract
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Tips for Better Contracts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-3">
                Always specify payment terms clearly, including due dates, accepted payment methods, and late payment
                penalties.
              </p>
              <p className="text-sm text-neutral-500">Recommended: Net-14 or Net-15 payment terms for freelancers.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Scope of Work</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600 mb-3">
                Define the project scope in detail, including deliverables, timelines, and what constitutes out-of-scope
                work.
              </p>
              <p className="text-sm text-neutral-500">
                Include a clear change request process for scope modifications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus } from "lucide-react"
import ContractCard from "@/components/contract-card"
import ContractStats from "@/components/dashboard/contract-stats"

export default function DashboardPage() {
  const router = useRouter()

  // Mock data for recent contracts
  const recentContracts = [
    {
      id: "123",
      title: "Website Development Agreement",
      createdAt: new Date().toISOString(),
      riskLevel: "High" as const,
      issues: new Array(4),
    },
    {
      id: "456",
      title: "Graphic Design Contract",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "Medium" as const,
      issues: new Array(2),
    },
    {
      id: "789",
      title: "Content Writing Agreement",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "Low" as const,
      issues: new Array(1),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-neutral-500 mt-1">Welcome back to ContractScan</p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          onClick={() => router.push("/dashboard/contracts/new")}
        >
          <Plus className="h-4 w-4" /> Analyze New Contract
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Contracts</CardTitle>
            <CardDescription>All contracts analyzed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{recentContracts.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">High Risk Contracts</CardTitle>
            <CardDescription>Contracts needing attention</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-[#EF4444]">
              {recentContracts.filter((c) => c.riskLevel === "High").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Issues Identified</CardTitle>
            <CardDescription>Total issues found</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {recentContracts.reduce((acc, contract) => acc + contract.issues.length, 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <ContractStats contracts={recentContracts} />
      </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
            />
          ))}

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
        </div>
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


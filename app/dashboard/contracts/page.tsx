"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Plus, Search } from "lucide-react"
import ContractCard from "@/components/contract-card"

export default function ContractsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  // Mock data for contracts
  const allContracts = [
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
    {
      id: "101",
      title: "Mobile App Development Contract",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "High" as const,
      issues: new Array(5),
    },
    {
      id: "102",
      title: "Logo Design Agreement",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "Low" as const,
      issues: new Array(1),
    },
    {
      id: "103",
      title: "SEO Consulting Agreement",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "Medium" as const,
      issues: new Array(3),
    },
    {
      id: "104",
      title: "Social Media Management Contract",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      riskLevel: "Medium" as const,
      issues: new Array(2),
    },
  ]

  // Filter and sort contracts
  const filteredContracts = allContracts
    .filter((contract) => {
      // Filter by search query
      const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase())

      // Filter by risk level
      const matchesRisk = riskFilter === "all" || contract.riskLevel === riskFilter

      return matchesSearch && matchesRisk
    })
    .sort((a, b) => {
      // Sort by date or risk level
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else if (sortBy === "risk-high") {
        const riskOrder = { High: 3, Medium: 2, Low: 1 }
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel]
      } else if (sortBy === "risk-low") {
        const riskOrder = { High: 3, Medium: 2, Low: 1 }
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
      }
      return 0
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Contract History</h1>
          <p className="text-neutral-500 mt-1">View and manage your analyzed contracts</p>
        </div>
        <Button
          className="mt-4 md:mt-0 bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
          onClick={() => router.push("/dashboard/contracts/new")}
        >
          <Plus className="h-4 w-4" /> Analyze New Contract
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Filter Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search contracts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="High">High Risk</SelectItem>
                <SelectItem value="Medium">Medium Risk</SelectItem>
                <SelectItem value="Low">Low Risk</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="risk-high">Highest Risk First</SelectItem>
                <SelectItem value="risk-low">Lowest Risk First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filteredContracts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border">
          <div className="mx-auto bg-neutral-100 h-16 w-16 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No contracts found</h3>
          <p className="text-neutral-600 max-w-md mx-auto mb-6">
            {searchQuery || riskFilter !== "all"
              ? "Try adjusting your filters to see more results."
              : "You haven't analyzed any contracts yet."}
          </p>
          {!searchQuery && riskFilter === "all" && (
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => router.push("/dashboard/contracts/new")}
            >
              Analyze Your First Contract
            </Button>
          )}
        </div>
      )}
    </div>
  )
}


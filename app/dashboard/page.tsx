"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  PlusCircle,
  Loader2,
  AlertTriangle,
  CheckCircle,
  FileEdit,
  FileSearch,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Contract {
  id: string
  title: string
  createdAt: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  type: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [recentContracts, setRecentContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Fetch contracts
    const fetchContracts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/contracts")

        if (!response.ok) {
          // If the API returns an error, just set empty arrays
          // This is likely the case for new users with no contracts
          console.warn("API returned non-OK status when fetching contracts:", response.status)
          setContracts([])
          setRecentContracts([])
          return
        }

        const data = await response.json()
        setContracts(data || [])
        
        // Get 3 most recent contracts
        const sorted = [...(data || [])].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setRecentContracts(sorted.slice(0, 3))
        
      } catch (error) {
        // Handle network errors silently and just set empty arrays
        console.warn("Error fetching contracts:", error)
        setContracts([])
        setRecentContracts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchContracts()
  }, [toast])

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            Critical Risk
          </Badge>
        )
      case "HIGH":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
            High Risk
          </Badge>
        )
      case "MEDIUM":
        return (
          <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-100">
            Medium Risk
          </Badge>
        )
      case "LOW":
    return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
            Low Risk
          </Badge>
        )
      default:
        return null
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "CRITICAL":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "HIGH":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "MEDIUM":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "LOW":
        return <CheckCircle className="h-5 w-5 text-emerald-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2">
          <Link href="/dashboard/contracts/new">
            <span className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Analyze New Contract
            </span>
          </Link>
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-primary" /> Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-3xl font-bold">{contracts.length}</p>
            <p className="text-sm text-slate-600">Contracts analyzed</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/10 p-0">
              <Link href="/dashboard/contracts" className="flex items-center gap-1">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Risks Found
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-3xl font-bold">
              {contracts.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL").length}
            </p>
            <p className="text-sm text-slate-600">High or critical risk contracts</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 p-0">
              <Link href="/dashboard/contracts?risk=high" className="flex items-center gap-1">
                Review issues <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" /> Safe Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-3xl font-bold">
              {contracts.filter(c => c.riskLevel === "LOW").length}
            </p>
            <p className="text-sm text-slate-600">Low risk contracts</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 p-0">
              <Link href="/dashboard/contracts?risk=low" className="flex items-center gap-1">
                View safe contracts <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Loading your contracts...</span>
          </div>
        ) : recentContracts.length === 0 ? (
          <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-slate-300 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Contracts Yet</h3>
              <p className="text-slate-500 text-center max-w-md mb-6">
                You haven't analyzed any contracts yet. Get started by analyzing your first contract.
              </p>
              <Button className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/contracts/new" className="flex items-center gap-2">
                  <PlusCircle className="h-4 w-4" /> Analyze Your First Contract
                </Link>
          </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {recentContracts.map((contract) => (
              <Card 
                key={contract.id}
                className="hover:shadow-md transition-shadow cursor-pointer border-l-4"
                style={{
                  borderLeftColor: 
                    contract.riskLevel === "CRITICAL" ? "#EF4444" : 
                    contract.riskLevel === "HIGH" ? "#F59E0B" : 
                    contract.riskLevel === "MEDIUM" ? "#F59E0B" : 
                    "#10B981"
                }}
                onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold truncate">{contract.title}</CardTitle>
                    {getRiskIcon(contract.riskLevel)}
                  </div>
                  <CardDescription>
                    Analyzed on {formatDate(contract.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-slate-50">
                      {contract.type || "Service Contract"}
                    </Badge>
                    {getRiskBadge(contract.riskLevel)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Your Contracts</h2>
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-slate-100 p-1 rounded-lg mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-white rounded-md">All Contracts</TabsTrigger>
            <TabsTrigger value="high_risk" className="data-[state=active]:bg-white rounded-md">High Risk</TabsTrigger>
            <TabsTrigger value="low_risk" className="data-[state=active]:bg-white rounded-md">Low Risk</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderContractList(contracts)}
          </TabsContent>

          <TabsContent value="high_risk">
            {renderContractList(contracts.filter(c => c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL"))}
          </TabsContent>

          <TabsContent value="low_risk">
            {renderContractList(contracts.filter(c => c.riskLevel === "LOW"))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  function renderContractList(contractList: Contract[]) {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading your contracts...</span>
        </div>
      )
    }

    if (contractList.length === 0) {
      return (
        <div className="bg-slate-50 rounded-lg p-8 text-center border border-slate-200">
          <p className="text-slate-600">No contracts found in this category.</p>
        </div>
      )
    }

    return (
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="px-4 py-3 text-left font-medium text-slate-600">Contract Name</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Date</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Type</th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">Risk Level</th>
                <th className="px-4 py-3 text-right font-medium text-slate-600"></th>
              </tr>
            </thead>
            <tbody>
              {contractList.map((contract, index) => (
                <tr 
                  key={contract.id} 
                  className={`hover:bg-slate-50 border-t border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                >
                  <td className="px-4 py-3 font-medium">{contract.title}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(contract.createdAt)}</td>
                  <td className="px-4 py-3 text-slate-600">{contract.type || "Service Contract"}</td>
                  <td className="px-4 py-3">
                    {getRiskBadge(contract.riskLevel)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary"
                      onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}


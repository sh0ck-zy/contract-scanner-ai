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
  ChevronLeft,
  ChevronRight,
  FileWarning,
  Shield,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface Contract {
  id: string
  title: string
  createdAt: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  type: string
  issues?: Array<{
    type: string
    text: string
    severityScore: number
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [contracts, setContracts] = useState<Contract[]>([])
  const [recentContracts, setRecentContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    highRiskCount: 0,
    lowRiskCount: 0,
    totalIssues: 0
  })

  useEffect(() => {
    // Fetch contracts
    const fetchContracts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/contracts")

        if (!response.ok) {
          console.warn("API returned non-OK status when fetching contracts:", response.status)
          setContracts([])
          setRecentContracts([])
          return
        }

        const data = await response.json()
        const contractList = data.contracts || []
        setContracts(contractList)
        
        // Get 5 most recent contracts for the carousel
        const sorted = [...contractList].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setRecentContracts(sorted.slice(0, 5))
        
        // Calculate stats
        setStats({
          totalAnalyzed: contractList.length,
          highRiskCount: contractList.filter((c: Contract) => 
            c.riskLevel === "HIGH" || c.riskLevel === "CRITICAL"
          ).length,
          lowRiskCount: contractList.filter((c: Contract) => 
            c.riskLevel === "LOW"
          ).length,
          totalIssues: contractList.reduce((acc: number, contract: Contract) => 
            acc + (contract.issues?.length || 0), 0
          )
        })
        
      } catch (error) {
        console.warn("Error fetching contracts:", error)
        setContracts([])
        setRecentContracts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchContracts()
  }, [])

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    } catch (e) {
      return "Invalid Date"
    }
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === recentContracts.length - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? recentContracts.length - 1 : prev - 1
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold mb-4 sm:mb-0">Dashboard</h1>
        <Button className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/contracts/new" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" /> Analyze New Contract
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-primary" /> Contract Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-3xl font-bold">{stats.totalAnalyzed}</p>
            <p className="text-sm text-slate-600">Total contracts analyzed</p>
            <p className="text-sm text-slate-600 mt-1">{stats.totalIssues} issues identified</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 hover:bg-primary/10 p-0">
              <Link href="/dashboard/contracts" className="flex items-center gap-1">
                View history <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileWarning className="h-5 w-5 text-amber-500" /> Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-3xl font-bold">{stats.highRiskCount}</p>
            <p className="text-sm text-slate-600">High/Critical risk contracts</p>
            <p className="text-sm text-slate-600 mt-1">Require immediate attention</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 p-0">
              <Link href="/dashboard/contracts?risk=high" className="flex items-center gap-1">
                Review risks <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-emerald-50 border-emerald-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" /> Contract Health
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-3xl font-bold">{stats.lowRiskCount}</p>
            <p className="text-sm text-slate-600">Low risk contracts</p>
            <p className="text-sm text-slate-600 mt-1">Meeting best practices</p>
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

      {/* Recent Activity Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        {isLoading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          </Card>
        ) : recentContracts.length === 0 ? (
          <Card className="p-8">
            <div className="text-center">
              <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Contracts Yet</h3>
              <p className="text-slate-600 mb-4">
                Start by analyzing your first contract to get insights and recommendations.
              </p>
              <Button asChild>
                <Link href="/dashboard/contracts/new">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Analyze Your First Contract
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="relative">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Latest Contract Analysis</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevSlide}
                    disabled={recentContracts.length <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextSlide}
                    disabled={recentContracts.length <= 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div 
                  className="transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {recentContracts.map((contract, index) => (
                    <div
                      key={contract.id}
                      className={cn(
                        "w-full",
                        index !== currentSlide && "hidden"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{contract.title}</h4>
                        {getRiskBadge(contract.riskLevel)}
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        Analyzed on {formatDate(contract.createdAt)}
                      </p>
                      <Button
                        variant="outline"
                        asChild
                        className="w-full sm:w-auto"
                      >
                        <Link href={`/dashboard/contracts/${contract.id}`}>
                          View Analysis
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}


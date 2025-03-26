"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ComparisonView } from "@/components/contract-comparison/comparison-view"
import { useToast } from "@/hooks/use-toast"

export default function ComparisonResultPage() {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [comparisonData, setComparisonData] = useState<any>(null)

  const comparisonId = searchParams.get("id")

  useEffect(() => {
    const fetchComparisonData = async () => {
      if (!comparisonId) {
        toast({
          title: "Missing Parameters",
          description: "Comparison ID is required.",
          variant: "destructive",
        })
        return
      }

      try {
        setIsLoading(true)

        const response = await fetch(`/api/contracts/compare/${comparisonId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch comparison data")
        }

        const data = await response.json()
        setComparisonData(data)
      } catch (error) {
        console.error("Error fetching comparison data:", error)
        toast({
          title: "Error",
          description: "Failed to load comparison data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchComparisonData()
  }, [comparisonId, toast])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-neutral-600">Loading comparison data...</p>
      </div>
    )
  }

  if (!comparisonData) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <p className="text-neutral-600">No comparison data available.</p>
      </div>
    )
  }

  return <ComparisonView {...comparisonData} />
}


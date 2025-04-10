"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Legal",
  "Manufacturing",
  "Retail",
  "Education",
  "Other"
]

const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East",
  "Africa"
]

export default function ContractsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [contractText, setContractText] = useState("")
  const [industry, setIndustry] = useState("")
  const [region, setRegion] = useState("")
  const [isPremium, setIsPremium] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contracts/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: contractText,
          industry: isPremium ? industry : undefined,
          region: isPremium ? region : undefined,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze contract")
      }

      const data = await response.json()
      router.push(`/dashboard/contracts/${data.contractId}`)
    } catch (error) {
      console.error("Error analyzing contract:", error)
      toast({
        title: "Error",
        description: "Failed to analyze contract. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Analyze New Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="contract">Contract Text</Label>
              <Textarea
                id="contract"
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste your contract text here..."
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="premium"
                checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="premium">Enable Premium Analysis</Label>
            </div>

            {isPremium && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Contract"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


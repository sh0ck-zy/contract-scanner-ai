"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Contract {
  id: string
  title: string
  createdAt: string
  riskLevel: "High" | "Medium" | "Low"
  issues: any[]
}

interface ContractStatsProps {
  contracts: Contract[]
}

export default function ContractStats({ contracts }: ContractStatsProps) {
  // Calculate risk distribution
  const riskDistribution = contracts.reduce(
    (acc, contract) => {
      acc[contract.riskLevel]++
      return acc
    },
    { High: 0, Medium: 0, Low: 0 } as Record<string, number>,
  )

  const riskData = [
    { name: "High", value: riskDistribution.High, fill: "#EF4444" },
    { name: "Medium", value: riskDistribution.Medium, fill: "#F59E0B" },
    { name: "Low", value: riskDistribution.Low, fill: "#10B981" },
  ]

  // Calculate issue types
  const issueTypes = contracts.reduce((acc: Record<string, number>, contract) => {
    // Group issues by type
    contract.issues.forEach((issue) => {
      acc[issue.type] = (acc[issue.type] || 0) + 1
    })
    return acc
  }, {})

  const issueData = Object.entries(issueTypes)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 issues

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              high: {
                label: "High Risk",
                color: "#EF4444",
              },
              medium: {
                label: "Medium Risk",
                color: "#F59E0B",
              },
              low: {
                label: "Low Risk",
                color: "#10B981",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Common Issue Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Count",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={issueData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#1E3A8A" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}


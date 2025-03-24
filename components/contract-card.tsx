"use client"

import { Card } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

interface ContractCardProps {
  contract: {
    id: string
    title: string
    createdAt: string
    riskLevel: "High" | "Medium" | "Low"
    issues: any[]
  }
  onClick: () => void
}

export default function ContractCard({ contract, onClick }: ContractCardProps) {
  return (
    <Card
      className="bg-white border border-neutral-200 rounded-lg shadow-sm hover:shadow transition duration-200 overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-medium text-lg truncate">{contract.title}</h3>
            <p className="text-sm text-neutral-500">{new Date(contract.createdAt).toLocaleDateString()}</p>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              contract.riskLevel === "High"
                ? "bg-[#EF4444]/10 text-[#EF4444]"
                : contract.riskLevel === "Medium"
                  ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                  : "bg-[#10B981]/10 text-[#10B981]"
            }`}
          >
            {contract.riskLevel} Risk
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-600">
            {contract.issues.length} {contract.issues.length === 1 ? "issue" : "issues"} found
          </p>
          <ChevronRight className="h-5 w-5 text-neutral-400" />
        </div>
      </div>
    </Card>
  )
}


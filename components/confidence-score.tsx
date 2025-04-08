import React from "react"

export interface ConfidenceScoreProps {
  score: number
  className?: string
}

export function ConfidenceScore({ score, className }: ConfidenceScoreProps) {
  // Function to determine score color
  const getScoreColor = () => {
    if (score >= 80) return "text-emerald-500"
    if (score >= 60) return "text-amber-500" 
    return "text-red-500"
  }

  // Function to determine gauge fill color
  const getGaugeColor = () => {
    if (score >= 80) return "from-emerald-200 to-emerald-500"
    if (score >= 60) return "from-amber-200 to-amber-500"
    return "from-red-200 to-red-500"
  }

  return (
    <div className={className}>
      <h3 className="font-medium mb-2">Contract Confidence Score</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
          <div 
            className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${getGaugeColor()}`}
            style={{ width: `${score}%` }}
          ></div>
        </div>
        <div className="flex justify-between w-full text-xs text-slate-500">
          <span>High Risk</span>
          <span className={`text-lg font-bold ${getScoreColor()}`}>
            {score}/100
          </span>
          <span>Low Risk</span>
        </div>
      </div>
    </div>
  )
} 
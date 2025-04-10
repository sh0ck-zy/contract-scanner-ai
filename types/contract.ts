export type ContractSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
export type ContractType = "SERVICE" | "EMPLOYMENT" | "NDA" | "OTHER"
export type IssueType = "PAYMENT" | "IP" | "SCOPE" | "TERMINATION" | "LIABILITY" | "OTHER"

export interface ContractIssue {
  type: IssueType
  text: string
  explanation: string
  suggestion: string
  severity: ContractSeverity
  metadata?: Record<string, any>
  severityScore?: number
}

export interface ContractAnalysis {
  riskLevel: ContractSeverity
  type: ContractType
  recommendedActions: string[]
  complianceFlags: string[]
  issues: ContractIssue[]
} 
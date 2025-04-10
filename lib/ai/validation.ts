export type ContractSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ContractType = "SERVICE" | "EMPLOYMENT" | "NDA" | "OTHER";

export function validateSeverity(severity: any): ContractSeverity {
  const validSeverities: ContractSeverity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
  return validSeverities.includes(severity) ? severity : "MEDIUM";
}

export function validateType(type: any): ContractType {
  const validTypes: ContractType[] = ["SERVICE", "EMPLOYMENT", "NDA", "OTHER"];
  return validTypes.includes(type) ? type : "OTHER";
} 
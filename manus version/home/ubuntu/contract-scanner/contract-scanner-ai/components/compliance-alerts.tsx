// components/compliance-alerts.tsx

import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ComplianceAlertsProps {
  complianceFlags: string[];
  region: string;
}

export function ComplianceAlerts({ complianceFlags, region }: ComplianceAlertsProps) {
  if (!complianceFlags || complianceFlags.length === 0) {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>No Compliance Issues Detected</AlertTitle>
        <AlertDescription>
          Your contract appears to comply with {region} freelancer protection laws.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium flex items-center gap-2">
        <Info className="h-4 w-4" />
        Compliance Alerts
      </h3>
      
      {complianceFlags.map((flag, index) => (
        <Alert key={index} variant="destructive" className="bg-amber-50 border-amber-200">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-700">Compliance Issue</AlertTitle>
          <AlertDescription className="text-amber-700">
            {flag}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, AlertTriangle } from "lucide-react"

export interface ComplianceAlertsProps {
    flags: string[]
}

export function ComplianceAlerts({ flags }: ComplianceAlertsProps) {
    if (!flags || flags.length === 0) {
        return null
    }

    // Function to determine the severity icon for each flag
    const getFlagIcon = (flag: string) => {
        if (flag.toLowerCase().includes("critical") || 
            flag.toLowerCase().includes("violation") ||
            flag.toLowerCase().includes("required")) {
            return <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
        }
        
        return <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
    }

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle>Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <ul className="space-y-3">
                    {flags.map((flag, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                            {getFlagIcon(flag)}
                            <span>{flag}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}


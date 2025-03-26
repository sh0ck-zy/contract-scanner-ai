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

    const originalId = searchParams.get("original")
    const revisedId = searchParams.get("revised")

    useEffect(() => {
        const fetchComparisonData = async () => {
            if (!originalId || !revisedId) {
                toast({
                    title: "Missing Parameters",
                    description: "Contract IDs are required for comparison.",
                    variant: "destructive",
                })
                return
            }

            try {
                setIsLoading(true)

                // In a real implementation, we would fetch comparison data from the API
                // For now, we'll use mock data
                await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call

                // Mock comparison data
                setComparisonData({
                    originalContract: {
                        id: originalId,
                        title: "Original Contract",
                        text: `# FREELANCE AGREEMENT

This Freelance Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Freelancer:** [FREELANCER_NAME], with a principal place of business at [FREELANCER_ADDRESS] ("Freelancer")

## 1. SERVICES

Freelancer agrees to provide the following services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Freelancer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Freelancer shall complete the Services according to the following timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Fee

Client agrees to pay Freelancer a fixed fee of [AMOUNT] for the Services.

### 3.2 Payment Schedule

Payment shall be made according to the following schedule:

50% upon signing this Agreement
50% upon completion of the Services

### 3.3 Late Payments

Payments not received within 30 days of the due date will be subject to a late fee of 1.5% per month.

## 4. REVISIONS AND CHANGES

### 4.1 Included Revisions

The fixed fee includes up to three (3) rounds of revisions to the Deliverables.

### 4.2 Additional Revisions

Additional revisions or changes to the project scope will be billed at Freelancer's standard hourly rate of [HOURLY_RATE] per hour.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Freelancer for use in the Deliverables.

### 5.2 Freelancer's Work

Upon receipt of full payment, Freelancer grants Client a non-exclusive, worldwide license to use the Deliverables.

## 6. TERMINATION

### 6.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Freelancer. Upon termination, Client shall pay for all Services performed up to the date of termination.

### 6.2 Termination by Freelancer

Freelancer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 7. GENERAL PROVISIONS

### 7.1 Independent Contractor

Freelancer is an independent contractor, not an employee of Client.

### 7.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 7.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

FREELANCER: ________________________
[FREELANCER_NAME]`,
                    },
                    revisedContract: {
                        id: revisedId,
                        title: "Revised Contract",
                        text: `# FREELANCE AGREEMENT

This Freelance Agreement (the "Agreement") is entered into as of [DATE], by and between:

**Client:** [CLIENT_NAME], with a principal place of business at [CLIENT_ADDRESS] ("Client")

**Freelancer:** [FREELANCER_NAME], with a principal place of business at [FREELANCER_ADDRESS] ("Freelancer")

## 1. SERVICES

Freelancer agrees to provide the following services (the "Services") to Client:

[PROJECT_DESCRIPTION]

### 1.1 Deliverables

Freelancer shall deliver the following deliverables (the "Deliverables"):

[DELIVERABLES]

## 2. TIMELINE

Freelancer shall complete the Services according to the following timeline:

[TIMELINE]

## 3. PAYMENT TERMS

### 3.1 Fee

Client agrees to pay Freelancer a fixed fee of [AMOUNT] for the Services.

### 3.2 Payment Schedule

Payment shall be made according to the following schedule:

50% upon signing this Agreement
50% upon completion of the Services

### 3.3 Late Payments

Payments not received within 15 days of the due date will be subject to a late fee of 1.5% per month.

## 4. REVISIONS AND CHANGES

### 4.1 Included Revisions

The fixed fee includes up to two (2) rounds of revisions to the Deliverables.

### 4.2 Additional Revisions

Additional revisions or changes to the project scope will be billed at Freelancer's standard hourly rate of [HOURLY_RATE] per hour.

### 4.3 Change Request Process

All change requests must be submitted in writing. Freelancer will evaluate each change request and provide Client with an estimate of the additional time and cost required, if any.

## 5. INTELLECTUAL PROPERTY RIGHTS

### 5.1 Client Content

Client retains all ownership rights to content provided to Freelancer for use in the Deliverables.

### 5.2 Freelancer's Work

Upon receipt of full payment, Freelancer grants Client a non-exclusive, worldwide license to use the Deliverables.

### 5.3 Portfolio Rights

Freelancer retains the right to display the Deliverables in Freelancer's portfolio for promotional purposes, unless otherwise specified in writing.

## 6. TERMINATION

### 6.1 Termination by Client

Client may terminate this Agreement at any time by providing written notice to Freelancer. Upon termination, Client shall pay for all Services performed up to the date of termination, plus a kill fee of 25% of the remaining contract value.

### 6.2 Termination by Freelancer

Freelancer may terminate this Agreement if Client fails to make any payment when due or breaches any material term of this Agreement.

## 7. GENERAL PROVISIONS

### 7.1 Independent Contractor

Freelancer is an independent contractor, not an employee of Client.

### 7.2 Governing Law

This Agreement shall be governed by the laws of [JURISDICTION].

### 7.3 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions and agreements.

## 8. CONFIDENTIALITY

Both parties agree to keep confidential any proprietary or sensitive information shared during the course of this engagement.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ________________________
[CLIENT_NAME]

FREELANCER: ________________________
[FREELANCER_NAME]`,
                    },
                    differences: {
                        added: [
                            { text: "### 4.3 Change Request Process", lineNumber: 52 },
                            {
                                text: "All change requests must be submitted in writing. Freelancer will evaluate each change request and provide Client with an estimate of the additional time and cost required, if any.",
                                lineNumber: 53,
                            },
                            { text: "### 5.3 Portfolio Rights", lineNumber: 67 },
                            {
                                text: "Freelancer retains the right to display the Deliverables in Freelancer's portfolio for promotional purposes, unless otherwise specified in writing.",
                                lineNumber: 68,
                            },
                            { text: "plus a kill fee of 25% of the remaining contract value.", lineNumber: 76 },
                            { text: "## 8. CONFIDENTIALITY", lineNumber: 95 },
                            {
                                text: "Both parties agree to keep confidential any proprietary or sensitive information shared during the course of this engagement.",
                                lineNumber: 96,
                            },
                        ],
                        removed: [
                            { text: "three (3)", lineNumber: 45 },
                            { text: "30", lineNumber: 37 },
                        ],
                        changed: [
                            {
                                original: {
                                    text: "Payments not received within 30 days of the due date will be subject to a late fee of 1.5% per month.",
                                    lineNumber: 37,
                                },
                                revised: {
                                    text: "Payments not received within 15 days of the due date will be subject to a late fee of 1.5% per month.",
                                    lineNumber: 37,
                                },
                            },
                            {
                                original: {
                                    text: "The fixed fee includes up to three (3) rounds of revisions to the Deliverables.",
                                    lineNumber: 45,
                                },
                                revised: {
                                    text: "The fixed fee includes up to two (2) rounds of revisions to the Deliverables.",
                                    lineNumber: 45,
                                },
                            },
                            {
                                original: {
                                    text: "Client may terminate this Agreement at any time by providing written notice to Freelancer. Upon termination, Client shall pay for all Services performed up to the date of termination.",
                                    lineNumber: 76,
                                },
                                revised: {
                                    text: "Client may terminate this Agreement at any time by providing written notice to Freelancer. Upon termination, Client shall pay for all Services performed up to the date of termination, plus a kill fee of 25% of the remaining contract value.",
                                    lineNumber: 76,
                                },
                            },
                        ],
                    },
                })
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
    }, [originalId, revisedId, toast])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-neutral-600">Comparing contracts...</p>
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


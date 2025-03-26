"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Diff, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Contract {
    id: string
    title: string
    createdAt: string
}

export default function CompareContractsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [contracts, setContracts] = useState<Contract[]>([])
    const [originalContractId, setOriginalContractId] = useState("")
    const [revisedContractId, setRevisedContractId] = useState("")
    const [isLoadingContracts, setIsLoadingContracts] = useState(true)

    // Fetch contracts
    useEffect(() => {
        const fetchContracts = async () => {
            try {
                setIsLoadingContracts(true)
                const response = await fetch("/api/contracts")

                if (!response.ok) {
                    throw new Error("Failed to fetch contracts")
                }

                const data = await response.json()
                setContracts(data)
            } catch (error) {
                console.error("Error fetching contracts:", error)
                toast({
                    title: "Error",
                    description: "Failed to load contracts. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoadingContracts(false)
            }
        }

        fetchContracts()
    }, [toast])

    const handleCompare = async () => {
        if (!originalContractId || !revisedContractId) {
            toast({
                title: "Selection Required",
                description: "Please select both an original and revised contract to compare.",
                variant: "destructive",
            })
            return
        }

        if (originalContractId === revisedContractId) {
            toast({
                title: "Invalid Selection",
                description: "Please select two different contracts to compare.",
                variant: "destructive",
            })
            return
        }

        try {
            setIsLoading(true)

            const response = await fetch("/api/contracts/compare", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    originalId: originalContractId,
                    revisedId: revisedContractId,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to compare contracts")
            }

            const data = await response.json()

            // Navigate to the comparison result page
            router.push(`/dashboard/contracts/compare/result?id=${data.comparisonId}`)
        } catch (error) {
            console.error("Error comparing contracts:", error)
            toast({
                title: "Comparison Failed",
                description: "Failed to compare the selected contracts. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Button>

            <h1 className="text-2xl font-bold mb-6">Compare Contracts</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Select Contracts to Compare</CardTitle>
                    <CardDescription>
                        Choose two contracts to see the differences between them. This helps you track changes and understand how
                        your contracts have evolved.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Original Contract</label>
                            <Select value={originalContractId} onValueChange={setOriginalContractId} disabled={isLoadingContracts}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select the original contract" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contracts.map((contract) => (
                                        <SelectItem key={contract.id} value={contract.id}>
                                            {contract.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
                                <ArrowRight className="h-4 w-4 text-neutral-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Revised Contract</label>
                            <Select value={revisedContractId} onValueChange={setRevisedContractId} disabled={isLoadingContracts}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select the revised contract" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contracts.map((contract) => (
                                        <SelectItem key={contract.id} value={contract.id}>
                                            {contract.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Diff className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-medium text-blue-700">How Contract Comparison Works</h4>
                                <p className="text-sm text-blue-600 mt-1">
                                    Our comparison tool highlights additions, removals, and changes between two contracts. This helps you
                                    track revisions and understand how terms have evolved over time.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t p-6">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                        onClick={handleCompare}
                        disabled={isLoading || isLoadingContracts || !originalContractId || !revisedContractId}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Comparing Contracts...
                            </>
                        ) : (
                            <>
                                <Diff className="h-4 w-4" />
                                Compare Contracts
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}


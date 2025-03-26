"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Loader2, Plus, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { IndustrySelector } from "@/components/industry-selector"
import { RegionSelector } from "@/components/region-selector"
import { ProjectTypeSelector } from "@/components/project-type-selector"

export default function GenerateContractPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isGenerating, setIsGenerating] = useState(false)

    const [formData, setFormData] = useState({
        industry: "web_development",
        projectType: "fixed_price",
        clientName: "",
        freelancerName: "",
        projectDescription: "",
        deliverables: [""],
        timeline: "",
        paymentTerms: "",
        region: "US",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDeliverableChange = (index: number, value: string) => {
        const newDeliverables = [...formData.deliverables]
        newDeliverables[index] = value
        setFormData((prev) => ({ ...prev, deliverables: newDeliverables }))
    }

    const addDeliverable = () => {
        setFormData((prev) => ({ ...prev, deliverables: [...prev.deliverables, ""] }))
    }

    const removeDeliverable = (index: number) => {
        const newDeliverables = [...formData.deliverables]
        newDeliverables.splice(index, 1)
        setFormData((prev) => ({ ...prev, deliverables: newDeliverables }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate form
        if (
            !formData.clientName ||
            !formData.freelancerName ||
            !formData.projectDescription ||
            !formData.deliverables[0] ||
            !formData.timeline ||
            !formData.paymentTerms
        ) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            })
            return
        }

        try {
            setIsGenerating(true)

            // Call API to generate contract
            const response = await fetch("/api/contracts/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(errorData?.message || "Failed to generate contract")
            }

            const data = await response.json()

            // Redirect to the contract details page
            router.push(`/dashboard/contracts/${data.contractId}`)

            toast({
                title: "Contract Generated",
                description: "Your contract has been generated successfully.",
            })
        } catch (error: any) {
            console.error("Error generating contract:", error)
            toast({
                title: "Generation Failed",
                description: error.message || "Something went wrong. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Generate New Contract</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                    <CardDescription>
                        Fill in the details below to generate a customized contract for your project.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="industry" className="text-sm font-medium">
                                        Industry
                                    </Label>
                                    <IndustrySelector
                                        value={formData.industry}
                                        onChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="region" className="text-sm font-medium">
                                        Region
                                    </Label>
                                    <RegionSelector
                                        value={formData.region}
                                        onChange={(value) => setFormData((prev) => ({ ...prev, region: value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectType" className="text-sm font-medium">
                                    Project Type
                                </Label>
                                <ProjectTypeSelector
                                    value={formData.projectType}
                                    onChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clientName" className="text-sm font-medium">
                                        Client Name
                                    </Label>
                                    <Input
                                        id="clientName"
                                        name="clientName"
                                        placeholder="E.g., Acme Corporation"
                                        value={formData.clientName}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="freelancerName" className="text-sm font-medium">
                                        Your Name (Freelancer)
                                    </Label>
                                    <Input
                                        id="freelancerName"
                                        name="freelancerName"
                                        placeholder="E.g., Jane Smith"
                                        value={formData.freelancerName}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="projectDescription" className="text-sm font-medium">
                                    Project Description
                                </Label>
                                <Textarea
                                    id="projectDescription"
                                    name="projectDescription"
                                    placeholder="Describe the project in detail..."
                                    value={formData.projectDescription}
                                    onChange={handleChange}
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Deliverables</Label>
                                    <Button type="button" variant="ghost" size="sm" onClick={addDeliverable} className="h-8 px-2">
                                        <Plus className="h-4 w-4 mr-1" /> Add Deliverable
                                    </Button>
                                </div>

                                {formData.deliverables.map((deliverable, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Input
                                            placeholder={`Deliverable ${index + 1}`}
                                            value={deliverable}
                                            onChange={(e) => handleDeliverableChange(index, e.target.value)}
                                            className="w-full"
                                        />
                                        {formData.deliverables.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeDeliverable(index)}
                                                className="h-8 w-8"
                                            >
                                                <Trash className="h-4 w-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timeline" className="text-sm font-medium">
                                    Project Timeline
                                </Label>
                                <Input
                                    id="timeline"
                                    name="timeline"
                                    placeholder="E.g., 4 weeks from contract signing"
                                    value={formData.timeline}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentTerms" className="text-sm font-medium">
                                    Payment Terms
                                </Label>
                                <Input
                                    id="paymentTerms"
                                    name="paymentTerms"
                                    placeholder="E.g., 50% upfront, 50% upon completion"
                                    value={formData.paymentTerms}
                                    onChange={handleChange}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t p-6">
                        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isGenerating}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isGenerating}
                            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FileText className="h-4 w-4 mr-1" />
                                    Generate Contract
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}


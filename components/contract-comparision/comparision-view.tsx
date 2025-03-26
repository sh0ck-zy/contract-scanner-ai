"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, ArrowLeft, ArrowRight, Check, Copy, Diff, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ComparisonViewProps {
    originalContract: {
        id: string
        title: string
        text: string
    }
    revisedContract: {
        id: string
        title: string
        text: string
    }
    differences: {
        added: { text: string; lineNumber: number }[]
        removed: { text: string; lineNumber: number }[]
        changed: {
            original: { text: string; lineNumber: number }
            revised: { text: string; lineNumber: number }
        }[]
    }
}

export function ComparisonView({ originalContract, revisedContract, differences }: ComparisonViewProps) {
    const { toast } = useToast()
    const [activeTab, setActiveTab] = useState("side-by-side")
    const [copiedText, setCopiedText] = useState<string | null>(null)

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedText(text)

        toast({
            title: "Copied to clipboard",
            description: "The text has been copied to your clipboard.",
        })

        setTimeout(() => {
            setCopiedText(null)
        }, 2000)
    }

    // Split contract text into lines for side-by-side view
    const originalLines = originalContract.text.split("\n")
    const revisedLines = revisedContract.text.split("\n")

    // Create a map of line numbers to highlight
    const removedLineMap = differences.removed.reduce(
        (acc, item) => {
            acc[item.lineNumber] = true
            return acc
        },
        {} as Record<number, boolean>,
    )

    const addedLineMap = differences.added.reduce(
        (acc, item) => {
            acc[item.lineNumber] = true
            return acc
        },
        {} as Record<number, boolean>,
    )

    const changedOriginalLineMap = differences.changed.reduce(
        (acc, item) => {
            acc[item.original.lineNumber] = true
            return acc
        },
        {} as Record<number, boolean>,
    )

    const changedRevisedLineMap = differences.changed.reduce(
        (acc, item) => {
            acc[item.revised.lineNumber] = true
            return acc
        },
        {} as Record<number, boolean>,
    )

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => history.back()}>
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Contract Comparison</h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            Comparing {originalContract.title} with {revisedContract.title}
                        </p>
                    </div>

                    <div className="mt-4 sm:mt-0">
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => copyToClipboard(revisedContract.text)}
                        >
                            {copiedText === revisedContract.text ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} Copy
                            Revised
                        </Button>
                    </div>
                </div>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Diff className="h-5 w-5" /> Changes Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                            <div className="font-medium text-red-700 mb-2 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" /> Removed Content
                            </div>
                            <p className="text-sm text-neutral-700">{differences.removed.length} sections removed</p>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                            <div className="font-medium text-green-700 mb-2 flex items-center gap-2">
                                <Check className="h-4 w-4" /> Added Content
                            </div>
                            <p className="text-sm text-neutral-700">{differences.added.length} sections added</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
                            <div className="font-medium text-amber-700 mb-2 flex items-center gap-2">
                                <ArrowRight className="h-4 w-4" /> Modified Content
                            </div>
                            <p className="text-sm text-neutral-700">{differences.changed.length} sections modified</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="side-by-side" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 mb-6">
                    <TabsTrigger value="side-by-side" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" /> Side by Side
                    </TabsTrigger>
                    <TabsTrigger value="unified" className="flex items-center gap-2">
                        <Diff className="h-4 w-4" /> Unified View
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="side-by-side">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Original Contract</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-neutral-50 p-4 rounded-lg border overflow-auto max-h-[600px]">
                                    <pre className="whitespace-pre-wrap font-mono text-sm">
                                        {originalLines.map((line, index) => (
                                            <div
                                                key={index}
                                                className={`py-1 ${removedLineMap[index]
                                                        ? "bg-red-100 text-red-800"
                                                        : changedOriginalLineMap[index]
                                                            ? "bg-amber-100 text-amber-800"
                                                            : ""
                                                    }`}
                                            >
                                                {line}
                                            </div>
                                        ))}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">Revised Contract</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-neutral-50 p-4 rounded-lg border overflow-auto max-h-[600px]">
                                    <pre className="whitespace-pre-wrap font-mono text-sm">
                                        {revisedLines.map((line, index) => (
                                            <div
                                                key={index}
                                                className={`py-1 ${addedLineMap[index]
                                                        ? "bg-green-100 text-green-800"
                                                        : changedRevisedLineMap[index]
                                                            ? "bg-amber-100 text-amber-800"
                                                            : ""
                                                    }`}
                                            >
                                                {line}
                                            </div>
                                        ))}
                                    </pre>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="unified">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Unified View</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-neutral-50 p-4 rounded-lg border overflow-auto max-h-[600px]">
                                <pre className="whitespace-pre-wrap font-mono text-sm">
                                    {differences.removed.map((item, index) => (
                                        <div key={`removed-${index}`} className="py-1 bg-red-100 text-red-800">
                                            - {item.text}
                                        </div>
                                    ))}
                                    {differences.added.map((item, index) => (
                                        <div key={`added-${index}`} className="py-1 bg-green-100 text-green-800">
                                            + {item.text}
                                        </div>
                                    ))}
                                    {differences.changed.map((item, index) => (
                                        <div key={`changed-${index}`}>
                                            <div className="py-1 bg-red-100 text-red-800">- {item.original.text}</div>
                                            <div className="py-1 bg-green-100 text-green-800">+ {item.revised.text}</div>
                                        </div>
                                    ))}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}


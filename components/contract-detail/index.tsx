"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertCircle, AlertTriangle, ArrowLeft, Check, CheckCircle, Copy, Download, FileText, Loader2,
} from 'lucide-react';
import { getContract } from '@/lib/api-utils';

export default function ContractDetail({ contractId }: { contractId: string }) {
    const router = useRouter();
    const [contract, setContract] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("issues");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchContract() {
            try {
                const data = await getContract(contractId);
                setContract(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load contract');
            } finally {
                setIsLoading(false);
            }
        }

        fetchContract();
    }, [contractId]);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);

        setTimeout(() => {
            setCopiedIndex(null);
        }, 2000);
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-neutral-600">Loading contract analysis...</p>
            </div>
        );
    }

    if (error || !contract) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                <AlertCircle className="h-10 w-10 text-destructive mb-4" />
                <h2 className="text-xl font-bold mb-2">Contract Not Found</h2>
                <p className="text-neutral-600 mb-6">
                    {error || "The contract you're looking for doesn't exist or you don't have access to it."}
                </p>
                <Button onClick={() => router.push("/dashboard")}>Return to Dashboard</Button>
            </div>
        );
    }

    const getRiskIcon = (riskLevel: string) => {
        switch (riskLevel) {
            case "High":
                return <AlertCircle className="h-6 w-6 text-destructive" />;
            case "Medium":
                return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
            case "Low":
                return <CheckCircle className="h-6 w-6 text-green-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" className="flex items-center gap-2 mb-4" onClick={() => router.push("/dashboard")}>
                    <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{contract.title}</h1>
                        <p className="text-neutral-500 text-sm mt-1">
                            Analyzed on {new Date(contract.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center">
                        <div className="flex items-center mr-6">
                            {getRiskIcon(contract.riskLevel)}
                            <span
                                className={`ml-2 font-semibold ${contract.riskLevel === "High"
                                        ? "text-destructive"
                                        : contract.riskLevel === "Medium"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                    }`}
                            >
                                {contract.riskLevel} Risk
                            </span>
                        </div>

                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => {
                                // Print functionality would go here
                                window.print();
                            }}
                        >
                            <Download className="h-4 w-4" /> Export PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-4">
                                    <span className="text-neutral-600">Risk Level</span>
                                    <span
                                        className={`font-semibold ${contract.riskLevel === "High"
                                                ? "text-destructive"
                                                : contract.riskLevel === "Medium"
                                                    ? "text-yellow-500"
                                                    : "text-green-500"
                                            }`}
                                    >
                                        {contract.riskLevel}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b pb-4">
                                    <span className="text-neutral-600">Issues Found</span>
                                    <span className="font-semibold">{contract.issues.length}</span>
                                </div>

                                <div className="flex items-center justify-between border-b pb-4">
                                    <span className="text-neutral-600">Contract Length</span>
                                    <span className="font-semibold">
                                        {contract.originalText.split(" ").length.toLocaleString()} words
                                    </span>
                                </div>

                                <div className="space-y-2 mt-6">
                                    <h3 className="font-semibold">Issue Types</h3>
                                    <ul className="space-y-2">
                                        {Object.entries(
                                            contract.issues.reduce((acc: Record<string, number>, issue: any) => {
                                                acc[issue.type] = (acc[issue.type] || 0) + 1;
                                                return acc;
                                            }, {})
                                        ).map(([type, count]) => (
                                            <li key={type} className="flex items-center justify-between">
                                                <span className="text-neutral-600">{type}</span>
                                                <span className="font-semibold">{count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Tabs defaultValue="issues" className="w-full" onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger value="issues" className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Issues ({contract.issues.length})
                            </TabsTrigger>
                            <TabsTrigger value="original" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Original Text
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="issues" className="space-y-6">
                            {contract.issues.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg border">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
                                    <p className="text-neutral-600 max-w-md mx-auto">
                                        Good news! We didn't find any significant issues in your contract.
                                    </p>
                                </div>
                            ) : (
                                contract.issues.map((issue: any, index: number) => (
                                    <Card
                                        key={issue.id}
                                        className={`border-l-4 ${issue.type.includes("Payment") || issue.type.includes("Copyright")
                                                ? "border-l-destructive"
                                                : issue.type.includes("Revision") || issue.type.includes("Termination")
                                                    ? "border-l-yellow-500"
                                                    : "border-l-teal-600"
                                            }`}
                                    >
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-lg">{issue.type}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="bg-destructive/5 border-l-4 border-destructive rounded p-4">
                                                <h4 className="text-sm font-medium text-destructive mb-2">Problematic Clause:</h4>
                                                <p className="text-sm font-mono">{issue.text}</p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium mb-2">Why It's a Problem:</h4>
                                                <p className="text-sm text-neutral-700">{issue.explanation}</p>
                                            </div>

                                            <div className="bg-green-500/5 border-l-4 border-green-500 rounded p-4 relative">
                                                <h4 className="text-sm font-medium text-green-700 mb-2">Suggested Alternative:</h4>
                                                <p className="text-sm font-mono pr-8">{issue.suggestion}</p>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-3 right-3 h-8 w-8 p-0"
                                                    onClick={() => copyToClipboard(issue.suggestion, index)}
                                                >
                                                    {copiedIndex === index ? (
                                                        <Check className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <Copy className="h-4 w-4 text-neutral-500" />
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="original">
                            <Card>
                                <CardContent className="p-6">
                                    <pre className="whitespace-pre-wrap font-mono text-sm bg-neutral-50 p-4 rounded-lg border overflow-auto max-h-[600px]">
                                        {contract.originalText}
                                    </pre>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
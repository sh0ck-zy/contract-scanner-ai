"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { analyzeContract } from '@/lib/api-utils';

export default function ContractAnalyzer() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [contractText, setContractText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!contractText.trim()) {
            setError('Please enter your contract text');
            return;
        }

        try {
            setIsAnalyzing(true);
            setError('');

            // Call the API to analyze the contract
            const result = await analyzeContract(contractText, title || 'Untitled Contract');

            // Redirect to the results page
            router.push(`/dashboard/contracts/${result.id}`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Contract Analyzer</CardTitle>
                    <CardDescription>
                        Paste your contract below to scan for problematic clauses, unfair terms, and legal risks.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Contract Title</Label>
                                <Input
                                    id="title"
                                    placeholder="E.g., Client Project Agreement"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="contract">Your Contract</Label>
                                <Textarea
                                    id="contract"
                                    placeholder="Paste your contract text here..."
                                    className="min-h-[300px]"
                                    value={contractText}
                                    onChange={(e) => setContractText(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Your contract is analyzed securely. We do not store the raw text after analysis.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            disabled={isAnalyzing || !contractText.trim()}
                            className="w-full"
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Contract...
                                </>
                            ) : (
                                'Analyze Contract'
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
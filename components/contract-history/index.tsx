"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { ContractCard } from '@/components/contract-card';
import { getContractHistory } from '@/lib/api-utils';

export default function ContractHistory() {
    const router = useRouter();
    const [contracts, setContracts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchContracts() {
            try {
                const data = await getContractHistory();
                setContracts(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load contracts');
            } finally {
                setIsLoading(false);
            }
        }

        fetchContracts();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-6">
                <p className="text-destructive mb-4">{error}</p>
                <Button onClick={() => router.refresh()}>Try Again</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Your Contracts</h2>
                <Button
                    onClick={() => router.push('/dashboard/contracts/new')}
                    className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" /> New Analysis
                </Button>
            </div>

            {contracts.length === 0 ? (
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="mb-4 text-muted-foreground">You haven't analyzed any contracts yet.</p>
                        <Button
                            onClick={() => router.push('/dashboard/contracts/new')}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Analyze Your First Contract
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contracts.map((contract: any) => (
                        <ContractCard
                            key={contract.id}
                            contract={contract}
                            onClick={() => router.push(`/dashboard/contracts/${contract.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
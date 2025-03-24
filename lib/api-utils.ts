/**
 * Client-side API utilities for making requests to our backend
 */

// Analyze a contract
export async function analyzeContract(contractText: string, title: string = 'Untitled Contract') {
    const response = await fetch('/api/contracts/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contractText, title }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to analyze contract');
    }

    return response.json();
}

// Get user's contract history
export async function getContractHistory() {
    const response = await fetch('/api/contracts');

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch contracts');
    }

    return response.json();
}

// Get a specific contract by ID
export async function getContract(id: string) {
    const response = await fetch(`/api/contracts/${id}`);

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch contract');
    }

    return response.json();
}

// Create a checkout session for subscription
export async function createCheckoutSession(plan: 'monthly' | 'yearly') {
    const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create checkout session');
    }

    const data = await response.json();
    return data.url;
}

// Create a portal session for subscription management
export async function createPortalSession() {
    const response = await fetch('/api/stripe/portal', {
        method: 'POST',
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to create portal session');
    }

    const data = await response.json();
    return data.url;
}
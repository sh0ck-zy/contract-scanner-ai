import { ReferralWidget } from "@/components/marketing/referral-widget"

export default function ReferralsPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Refer Friends & Earn Credits</h1>
            <ReferralWidget />
        </div>
    )
}


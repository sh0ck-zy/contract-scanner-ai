"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Loader2, Mail, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReferralWidget() {
    const { toast } = useToast()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [referralCode, setReferralCode] = useState("")
    const [referralLink, setReferralLink] = useState("")
    const [referralCount, setReferralCount] = useState(0)
    const [creditsEarned, setCreditsEarned] = useState(0)

    useEffect(() => {
        const fetchReferralData = async () => {
            try {
                setIsLoadingData(true)
                const response = await fetch("/api/referrals")

                if (!response.ok) {
                    throw new Error("Failed to fetch referral data")
                }

                const data = await response.json()

                setReferralCode(data.referralCode)
                setReferralLink(data.referralLink)
                setReferralCount(data.stats.total)
                setCreditsEarned(data.stats.creditsEarned)
            } catch (error) {
                console.error("Error fetching referral data:", error)
                toast({
                    title: "Error",
                    description: "Failed to load referral data. Please try again.",
                    variant: "destructive",
                })
            } finally {
                setIsLoadingData(false)
            }
        }

        fetchReferralData()
    }, [toast])

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast({
                title: "Email Required",
                description: "Please enter your friend's email address.",
                variant: "destructive",
            })
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
            })
            return
        }

        try {
            setIsLoading(true)

            const response = await fetch("/api/referrals", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            })

            if (!response.ok) {
                throw new Error("Failed to send invitation")
            }

            const data = await response.json()

            toast({
                title: "Invitation Sent",
                description: `Invitation sent to ${email}`,
            })

            setEmail("")

            // Update referral count
            setReferralCount((prev) => prev + 1)
        } catch (error) {
            console.error("Error sending invitation:", error)
            toast({
                title: "Error",
                description: "Failed to send invitation. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const copyReferralLink = () => {
        navigator.clipboard.writeText(referralLink)
        toast({
            title: "Copied to Clipboard",
            description: "Your referral link has been copied to clipboard.",
        })
    }

    if (isLoadingData) {
        return (
            <Card>
                <CardContent className="p-8 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" /> Refer Friends & Earn Credits
                </CardTitle>
                <CardDescription>Invite friends to ContractScan and earn free contract analyses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Gift className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-medium">How It Works</h3>
                            <p className="text-sm text-neutral-600">Share your unique link, earn credits when friends sign up</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 bg-white rounded-lg border">
                            <p className="text-sm font-medium">Share Link</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border">
                            <p className="text-sm font-medium">Friend Signs Up</p>
                        </div>
                        <div className="p-2 bg-white rounded-lg border">
                            <p className="text-sm font-medium">Both Get Credits</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="referral-link">Your Referral Link</Label>
                    <div className="flex">
                        <Input id="referral-link" value={referralLink} readOnly className="rounded-r-none" />
                        <Button className="rounded-l-none" onClick={copyReferralLink}>
                            Copy
                        </Button>
                    </div>
                    <p className="text-xs text-neutral-500">Share this link with friends to earn credits</p>
                </div>

                <div className="border-t pt-4">
                    <h3 className="font-medium mb-3">Or Send Direct Invitation</h3>
                    <form onSubmit={handleSendInvite} className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="friend-email">Friend's Email</Label>
                            <div className="flex">
                                <Input
                                    id="friend-email"
                                    type="email"
                                    placeholder="friend@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-r-none"
                                />
                                <Button
                                    type="submit"
                                    className="rounded-l-none bg-primary hover:bg-primary/90 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">Your Referral Stats</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-neutral-50 p-3 rounded-lg border">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Friends Referred</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">{referralCount}</p>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg border">
                            <div className="flex items-center gap-2">
                                <Gift className="h-4 w-4 text-primary" />
                                <span className="text-sm font-medium">Credits Earned</span>
                            </div>
                            <p className="text-2xl font-bold mt-1">{creditsEarned}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-neutral-50 border-t">
                <p className="text-xs text-neutral-500 text-center w-full">
                    You earn 1 free contract analysis for each friend who signs up, and they get 1 free analysis too!
                </p>
            </CardFooter>
        </Card>
    )
}


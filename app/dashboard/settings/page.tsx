"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, CreditCard, Lock, User, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock user data for development
const mockUser = {
  fullName: "Test User",
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  id: "user_123456789",
  update: async (data: any) => {
    console.log("Mock update user data:", data);
    return Promise.resolve();
  }
};

export default function SettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
  })
  const [subscription, setSubscription] = useState({
    status: "inactive",
    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: null as any,
    invoices: [] as any[],
  })

  useEffect(() => {
    // Use mock user data in development
    const user = mockUser;
    
    setUserProfile({
      name: user.fullName || "",
      email: user.email || "",
    })

    // Using mock subscription data
    setSubscription({
      status: "active",
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentMethod: {
        card: {
          last4: "4242",
          exp_month: 12,
          exp_year: 2024,
        },
      },
      invoices: [
        {
          id: "inv_123",
          created: Date.now() / 1000 - 30 * 24 * 60 * 60,
          amount_paid: 1500,
          status: "paid",
          hosted_invoice_url: "#",
        },
        {
          id: "inv_456",
          created: Date.now() / 1000 - 60 * 24 * 60 * 60,
          amount_paid: 1500,
          status: "paid",
          hosted_invoice_url: "#",
        },
      ],
    });
  }, [])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Mock updating the user profile
      await mockUser.update({
        firstName: userProfile.name.split(" ")[0],
        lastName: userProfile.name.split(" ").slice(1).join(" "),
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePortalSession = async () => {
    try {
      setIsLoading(true)

      // Mock billing portal in development
      toast({
        title: "Development Mode",
        description: "Billing portal would open here in production.",
      })
      
      setIsLoading(false)
    } catch (error) {
      console.error("Error creating portal session:", error)
      toast({
        title: "Error",
        description: "Failed to access billing portal. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Show loading skeleton while data loads
  if (!userProfile.name) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Billing
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your account details and how we contact you.</CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    disabled
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs text-neutral-500">
                    Email address can only be changed in your account settings.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>Manage your subscription and billing information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-neutral-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {subscription.status === "active" ? "Pro Plan" : "Free Trial"}
                    </h3>
                    <p className="text-neutral-500 text-sm">
                      {subscription.status === "active"
                        ? `$15/month, renews on ${
                            subscription.currentPeriodEnd
                              ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                              : "N/A"
                          }`
                        : "3-day trial, no credit card required"}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      subscription.status === "active"
                        ? "bg-[#10B981]/10 text-[#10B981]"
                        : subscription.status === "trialing"
                          ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                          : "bg-neutral-100 text-neutral-600"
                    }`}
                  >
                    {subscription.status === "active"
                      ? "Active"
                      : subscription.status === "trialing"
                        ? "Trial"
                        : "Inactive"}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={handleCreatePortalSession}
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Loading..."
                    : subscription.status === "active"
                      ? "Manage Subscription"
                      : "Upgrade to Pro"}
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Payment Method</h3>

                {subscription.paymentMethod ? (
                  <div className="flex items-center justify-between bg-white p-4 border rounded-md">
                    <div className="flex items-center">
                      <CreditCard className="h-5 w-5 text-neutral-500 mr-3" />
                      <div>
                        <p className="font-medium">
                          •••• •••• •••• {subscription.paymentMethod.card.last4}
                        </p>
                        <p className="text-sm text-neutral-500">
                          Expires {subscription.paymentMethod.card.exp_month}/
                          {subscription.paymentMethod.card.exp_year}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-neutral-500"
                      onClick={handleCreatePortalSession}
                    >
                      Update
                    </Button>
                  </div>
                ) : (
                  <div className="bg-neutral-50 p-4 rounded-md text-center">
                    <p className="text-neutral-600">No payment method on file</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Billing History</h3>

                {subscription.invoices.length > 0 ? (
                  <div className="border rounded-md divide-y overflow-hidden">
                    {subscription.invoices.map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-white">
                        <div>
                          <p className="font-medium">
                            ${(invoice.amount_paid / 100).toFixed(2)} - {invoice.status}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {new Date(invoice.created * 1000).toLocaleDateString()}
                          </p>
                        </div>
                        <a
                          href={invoice.hosted_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:text-primary/90 underline"
                        >
                          View Invoice
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-neutral-50 p-4 rounded-md text-center">
                    <p className="text-neutral-600">No billing history available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and account security.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Password Management</h3>
                <p className="text-neutral-600">Password management is handled through your account.</p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white" 
                  onClick={() => {
                    toast({
                      title: "Development Mode",
                      description: "User profile would open here in production."
                    });
                  }}
                >
                  Open User Profile
                </Button>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-medium">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Protect your account with 2FA</p>
                    <p className="text-sm text-neutral-500">
                      Add an extra layer of security to your account by requiring a verification code along with your
                      password.
                    </p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-medium">Sessions</h3>
                <p className="text-neutral-600">Manage your active sessions and sign out from other devices.</p>
                <Button variant="outline">View Active Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to receive notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Email Notifications</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Contract Analysis</p>
                      <p className="text-sm text-neutral-500">Receive email when your contract analysis is complete</p>
                    </div>
                    <Switch id="email-contract" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Monthly Newsletter</p>
                      <p className="text-sm text-neutral-500">Get freelance tips and legal updates monthly</p>
                    </div>
                    <Switch id="email-newsletter" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-neutral-500">Stay informed about new features and improvements</p>
                    </div>
                    <Switch id="email-updates" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-medium">Security Alerts</h3>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Account Activity</p>
                      <p className="text-sm text-neutral-500">Get notified about new sign-ins from unknown devices</p>
                    </div>
                    <Switch id="security-activity" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Subscription Changes</p>
                      <p className="text-sm text-neutral-500">Get notified before your subscription renews</p>
                    </div>
                    <Switch id="security-subscription" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-primary hover:bg-primary/90 text-white">Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


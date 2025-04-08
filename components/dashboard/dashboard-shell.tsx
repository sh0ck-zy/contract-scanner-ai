"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileText, History, Home, Settings, Gift, Diff, FileCheck } from "lucide-react"

// Mock user data for development
const mockUser = {
    firstName: "Test",
    lastName: "User",
    imageUrl: "",
    email: "test@example.com",
}

export function DashboardShell({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Using mock user data in development
    const user = mockUser

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
            current: pathname === "/dashboard",
        },
        {
            name: "Analyze Contract",
            href: "/dashboard/contracts/new",
            icon: FileText,
            current: pathname === "/dashboard/contracts/new",
        },
        {
            name: "Generate Contract",
            href: "/dashboard/contracts/generate",
            icon: FileCheck,
            current: pathname === "/dashboard/contracts/generate",
        },
        {
            name: "Contract History",
            href: "/dashboard/contracts",
            icon: History,
            current:
                pathname.startsWith("/dashboard/contracts") &&
                pathname !== "/dashboard/contracts/new" &&
                pathname !== "/dashboard/contracts/generate" &&
                !pathname.startsWith("/dashboard/contracts/compare"),
        },
        {
            name: "Compare Contracts",
            href: "/dashboard/contracts/compare",
            icon: Diff,
            current: pathname.startsWith("/dashboard/contracts/compare"),
        },
        {
            name: "Refer Friends",
            href: "/dashboard/referrals",
            icon: Gift,
            current: pathname === "/dashboard/referrals",
        },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            current: pathname === "/dashboard/settings",
        },
    ]

    return (
        <div className="min-h-screen flex flex-col">
            <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center">
                            <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
                                CS
                            </div>
                            <span className="ml-2 text-xl font-bold text-primary">ContractScan</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user?.imageUrl} alt={user?.firstName || ""} />
                                        <AvatarFallback>{getInitials(user?.firstName || "", user?.lastName || "")}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard">Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/contracts">My Contracts</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/referrals">Refer Friends</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">Settings</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/">Log Out</Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                <div className="hidden md:block w-64 bg-white border-r border-neutral-200 p-4">
                    <nav className="space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${item.current
                                        ? "bg-primary/10 text-primary"
                                        : "text-neutral-700 hover:bg-neutral-50 hover:text-primary"
                                    }`}
                            >
                                <item.icon className={`h-5 w-5 mr-3 ${item.current ? "text-primary" : "text-neutral-400"}`} />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <main className="flex-1 bg-neutral-50">{children}</main>
            </div>

            {/* Mobile navigation */}
            <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
                <div className="flex justify-around py-2">
                    {navItems.slice(0, 5).map((item) => (
                        <Link key={item.name} href={item.href} className="flex flex-col items-center p-2 text-neutral-600">
                            <item.icon className={`h-6 w-6 ${item.current ? "text-primary" : ""}`} />
                            <span className={`text-xs mt-1 ${item.current ? "text-primary font-medium" : ""}`}>{item.name}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}

function getInitials(firstName: string, lastName: string): string {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}


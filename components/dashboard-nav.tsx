"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, History, Home, Settings } from "lucide-react"

export function NavLinks() {
    const pathname = usePathname()

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
            name: "Contract History",
            href: "/dashboard/contracts",
            icon: History,
            current: pathname.startsWith("/dashboard/contracts") && pathname !== "/dashboard/contracts/new",
        },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            current: pathname === "/dashboard/settings",
        },
    ]

    return (
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
    )
}

export function MobileNavLinks() {
    const pathname = usePathname()

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: Home,
            current: pathname === "/dashboard",
        },
        {
            name: "Analyze",
            href: "/dashboard/contracts/new",
            icon: FileText,
            current: pathname === "/dashboard/contracts/new",
        },
        {
            name: "History",
            href: "/dashboard/contracts",
            icon: History,
            current: pathname.startsWith("/dashboard/contracts") && pathname !== "/dashboard/contracts/new",
        },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            current: pathname === "/dashboard/settings",
        },
    ]

    return (
        <div className="flex justify-around py-2">
            {navItems.map((item) => (
                <Link key={item.name} href={item.href} className="flex flex-col items-center p-2 text-neutral-600">
                    <item.icon className={`h-6 w-6 ${item.current ? "text-primary" : ""}`} />
                    <span className={`text-xs mt-1 ${item.current ? "text-primary font-medium" : ""}`}>{item.name}</span>
                </Link>
            ))}
        </div>
    )
}
import Link from "next/link"
import { redirect } from "next/navigation"
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
import { auth, currentUser } from "@clerk/nextjs/server"
import { UserButton } from "@clerk/nextjs"
import { NavLinks, MobileNavLinks } from "@/components/dashboard-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication first
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Only fetch user details if authenticated
  const user = await currentUser()

  // Fallback user info in case Clerk data is missing
  const userInfo = {
    name: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "User",
    email: user?.emailAddresses[0]?.emailAddress || "",
    imageUrl: user?.imageUrl || "",
  }

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
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <div className="hidden md:block w-64 bg-white border-r border-neutral-200 p-4">
          <NavLinks />
        </div>

        <main className="flex-1 bg-neutral-50">{children}</main>
      </div>

      {/* Mobile navigation */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
        <MobileNavLinks />
      </div>
    </div>
  )
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)
}
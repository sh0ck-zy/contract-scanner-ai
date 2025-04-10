import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { UserTable } from "@/components/admin/user-table";
import { SystemConfig } from "@/components/admin/system-config";

export default async function AdminDashboard() {
  const { userId } = await auth();
  
  // Check if user is admin
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true }
  });

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid gap-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">User Management</h2>
          <UserTable />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">System Configuration</h2>
          <SystemConfig />
        </section>
      </div>
    </div>
  );
} 
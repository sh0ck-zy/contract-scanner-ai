import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs"
import { prisma } from "@/lib/db"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await currentUser()

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Get the contract
    const contract = await prisma.contract.findUnique({
      where: {
        id: params.id,
        userId: dbUser.id, // Ensure the contract belongs to the user
      },
      include: { issues: true },
    })

    if (!contract) {
      return new NextResponse("Contract not found", { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error("Error fetching contract:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}


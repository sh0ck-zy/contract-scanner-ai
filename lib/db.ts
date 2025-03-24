// lib/db.ts
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismadb = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismadb
}

// Export the Prisma client as the default export
export default prismadb
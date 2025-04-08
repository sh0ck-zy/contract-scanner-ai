// lib/db.ts
import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  }).$extends({
    result: {
      contract: {
        metadata: {
          needs: { metadata: true },
          compute(contract) {
            return contract.metadata as Record<string, any> | null
          }
        },
        recommendedActions: {
          needs: { recommendedActions: true },
          compute(contract) {
            return contract.recommendedActions as string[] | null
          }
        },
        complianceFlags: {
          needs: { complianceFlags: true },
          compute(contract) {
            return contract.complianceFlags as string[] | null
          }
        }
      }
    }
  })
}

export const db = globalThis.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db
}

// Export both named and default exports for compatibility
export const prisma = db
export default db
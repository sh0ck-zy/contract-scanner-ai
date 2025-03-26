import { auth, currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { errorResponse, successResponse, validateRequiredFields } from "@/lib/api-utils"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
    try {
        // Get authenticated user
        const { userId } = auth()
        const user = await currentUser()

        if (!userId || !user) {
            return errorResponse("Unauthorized", 401)
        }

        // Get request body
        const { email } = await req.json()

        const validationError = validateRequiredFields({ email }, ["email"])
        if (validationError) {
            return errorResponse(validationError, 400)
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return errorResponse("Invalid email format", 400)
        }

        // Get DB user
        let dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!dbUser) {
            // Create user in database
            dbUser = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: user.emailAddresses[0].emailAddress,
                },
            })
        }

        // Generate or retrieve referral code
        let referralCode = (dbUser.metadata as any)?.referralCode

        if (!referralCode) {
            referralCode = generateReferralCode(dbUser.id)

            // Save referral code to user
            await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                    metadata: {
                        ...((dbUser.metadata as any) || {}),
                        referralCode,
                    },
                },
            })
        }

        // Create referral record
        const referral = await prisma.referral.create({
            data: {
                userId: dbUser.id,
                email,
                status: "PENDING",
            },
        })

        // Send referral email
        await sendReferralEmail(email, user.firstName || user.emailAddresses[0].emailAddress.split("@")[0], referralCode)

        return successResponse({
            success: true,
            referralId: referral.id,
            referralCode,
        })
    } catch (error) {
        console.error("Error creating referral:", error)
        return errorResponse("Internal Server Error")
    }
}

export async function GET(req: Request) {
    try {
        // Get authenticated user
        const { userId } = auth()

        if (!userId) {
            return errorResponse("Unauthorized", 401)
        }

        // Get DB user
        const dbUser = await prisma.user.findUnique({
            where: { clerkId: userId },
        })

        if (!dbUser) {
            return errorResponse("User not found", 404)
        }

        // Get referral code
        let referralCode = (dbUser.metadata as any)?.referralCode

        if (!referralCode) {
            referralCode = generateReferralCode(dbUser.id)

            // Save referral code to user
            await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                    metadata: {
                        ...((dbUser.metadata as any) || {}),
                        referralCode,
                    },
                },
            })
        }

        // Get referrals
        const referrals = await prisma.referral.findMany({
            where: { userId: dbUser.id },
            orderBy: { createdAt: "desc" },
        })

        // Count successful referrals
        const successfulReferrals = referrals.filter((r) => r.status === "COMPLETED").length

        return successResponse({
            referralCode,
            referralLink: `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`,
            referrals,
            stats: {
                total: referrals.length,
                completed: successfulReferrals,
                pending: referrals.filter((r) => r.status === "PENDING").length,
                creditsEarned: successfulReferrals,
            },
        })
    } catch (error) {
        console.error("Error fetching referrals:", error)
        return errorResponse("Internal Server Error")
    }
}

// Helper functions
function generateReferralCode(userId: string): string {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}

async function sendReferralEmail(email: string, inviterName: string, referralCode: string) {
    const subject = `${inviterName} invited you to try ContractScan`
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`

    const text = `
    ${inviterName} thinks you'd love ContractScan!
    
    ContractScan helps freelancers analyze client contracts to identify potentially problematic clauses and suggest fairer alternatives.
    
    Sign up using this link and you'll both get a free contract analysis:
    ${referralLink}
    
    Best regards,
    The ContractScan Team
  `

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A8A;">${inviterName} invited you to try ContractScan!</h2>
      <p>${inviterName} thinks you'd love ContractScan!</p>
      <p>ContractScan helps freelancers analyze client contracts to identify potentially problematic clauses and suggest fairer alternatives.</p>
      <div style="margin: 30px 0;">
        <a href="${referralLink}" style="background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Sign Up & Get Free Analysis</a>
      </div>
      <p>Sign up using this link and you'll both get a free contract analysis!</p>
      <p>Best regards,<br>The ContractScan Team</p>
    </div>
  `

    return sendEmail({ to: email, subject, text, html })
}


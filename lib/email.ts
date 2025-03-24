import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  subject,
  text,
  html,
  from,
}: {
  to: string
  subject: string
  text: string
  html: string
  from?: string
}) {
  const sender = from || "ContractScan <noreply@contractscan.io>"

  try {
    const { data, error } = await resend.emails.send({
      from: sender,
      to,
      subject,
      text,
      html,
    })

    if (error) {
      console.error("Error sending email:", error)
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return { success: true, messageId: data.id }
  } catch (error: any) {
    console.error("Error sending email:", error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  const userName = name || email.split("@")[0]

  const subject = "Welcome to ContractScan!"
  const text = `
    Hi ${userName},
    
    Welcome to ContractScan! We're excited to have you on board.
    
    ContractScan helps freelancers like you analyze client contracts to identify potentially problematic clauses and suggest fairer alternatives.
    
    To get started, simply upload a contract or paste the text into our analyzer.
    
    If you have any questions, feel free to reply to this email.
    
    Best regards,
    The ContractScan Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A8A;">Welcome to ContractScan!</h2>
      <p>Hi ${userName},</p>
      <p>Welcome to ContractScan! We're excited to have you on board.</p>
      <p>ContractScan helps freelancers like you analyze client contracts to identify potentially problematic clauses and suggest fairer alternatives.</p>
      <p>To get started, simply upload a contract or paste the text into our analyzer.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
      </div>
      <p>If you have any questions, feel free to reply to this email.</p>
      <p>Best regards,<br>The ContractScan Team</p>
    </div>
  `

  return sendEmail({ to: email, subject, text, html })
}

/**
 * Send an analysis completion email
 */
export async function sendAnalysisCompletionEmail(
  email: string,
  contractTitle: string,
  contractId: string,
  riskLevel: string,
  issueCount: number,
) {
  const subject = `Contract Analysis Complete: ${contractTitle}`
  const text = `
    Your contract analysis is complete!
    
    Contract: ${contractTitle}
    Risk Level: ${riskLevel}
    Issues Found: ${issueCount}
    
    View the full analysis here: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/contracts/${contractId}
    
    Best regards,
    The ContractScan Team
  `

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1E3A8A;">Contract Analysis Complete</h2>
      <p>Your contract analysis is complete!</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Contract:</strong> ${contractTitle}</p>
        <p><strong>Risk Level:</strong> <span style="color: ${
          riskLevel === "High" ? "#EF4444" : riskLevel === "Medium" ? "#F59E0B" : "#10B981"
        };">${riskLevel}</span></p>
        <p><strong>Issues Found:</strong> ${issueCount}</p>
      </div>
      <div style="margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/contracts/${contractId}" style="background-color: #1E3A8A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Full Analysis</a>
      </div>
      <p>Best regards,<br>The ContractScan Team</p>
    </div>
  `

  return sendEmail({ to: email, subject, text, html })
}


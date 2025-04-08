import type { Metadata } from "next"
import "@/styles/globals.css"
import { Inter, Merriweather } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "../components/analytics"
import { ThemeProvider } from "@/components/theme-provider"
import { UserProvider } from "@/components/user-provider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

const merriweather = Merriweather({ 
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
})

export const metadata: Metadata = {
  title: "ContractScan - AI-Powered Contract Analysis for Freelancers",
  description: "Get instant AI-powered analysis of your freelance contracts. Identify potential risks, understand complex clauses, and protect your business.",
  keywords: ["contract analysis", "freelance", "AI contract review", "legal tech", "contract scanner"],
  authors: [{ name: "ContractScan Team" }],
  creator: "ContractScan",
  metadataBase: new URL("https://contractscan.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://contractscan.ai",
    title: "ContractScan - AI Contract Analysis for Freelancers",
    description: "ContractScan analyzes freelance contracts to identify risky clauses, explain issues in plain language, and provide suggestions to protect you.",
    siteName: "ContractScan",
  },
  twitter: {
    card: "summary_large_image",
    title: "ContractScan - AI Contract Analysis for Freelancers",
    description: "ContractScan analyzes freelance contracts to identify risky clauses, explain issues in plain language, and provide suggestions to protect you.",
    creator: "@contractscan",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <UserProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
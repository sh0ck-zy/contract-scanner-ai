import { SignUp } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

export default async function SignUpPage() {
    const { userId } = auth()
    
    if (userId) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <SignUp
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        footerActionLink: "text-primary hover:text-primary/90",
                    },
                }}
                redirectUrl="/dashboard"
                signInUrl="/sign-in"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
            />
        </div>
    )
}


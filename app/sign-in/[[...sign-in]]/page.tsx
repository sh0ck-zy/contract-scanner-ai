import { SignIn } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"

export default async function SignInPage() {
    const { userId } = await auth()
    
    if (userId) {
        redirect("/dashboard")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
            <SignIn
                appearance={{
                    elements: {
                        formButtonPrimary: "bg-primary hover:bg-primary/90 text-white",
                        footerActionLink: "text-primary hover:text-primary/90",
                    },
                }}
                redirectUrl="/dashboard"
                signUpUrl="/sign-up"
                afterSignInUrl="/dashboard"
                afterSignUpUrl="/dashboard"
            />
        </div>
    )
}


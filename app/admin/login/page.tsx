import type { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { AdminLoginClient } from "./login-client"

export const metadata: Metadata = {
    title: "Admin sign in | Divya Darshan 360",
    description: "Internal admin sign-in.",
    robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-6 py-16">
            <Suspense
                fallback={
                    <div className="text-center text-muted-foreground">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                }
            >
                <AdminLoginClient />
            </Suspense>
        </main>
    )
}

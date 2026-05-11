"use client"

import { Suspense, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, Loader2, ShieldCheck, Truck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { PhoneOtpForm } from "@/components/phone-otp-form"

function LoginInner() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading, configError } = useAuth()

    const redirectTo = searchParams.get("next") || "/"
    const safeRedirect = redirectTo.startsWith("/") ? redirectTo : "/"

    useEffect(() => {
        if (!loading && user) {
            router.replace(safeRedirect)
        }
    }, [user, loading, router, safeRedirect])

    if (configError) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="flex items-start gap-3 glass rounded-2xl p-5 border border-destructive/40">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-destructive mb-1">Sign-in is not available</p>
                        <p className="text-muted-foreground">
                            {configError} Set <code className="font-mono">NEXT_PUBLIC_FIREBASE_*</code> in
                            <code className="font-mono"> .env.local</code> and restart the dev server.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-md mx-auto text-center text-muted-foreground py-12">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
        )
    }

    if (user) {
        return (
            <div className="max-w-md mx-auto text-center text-muted-foreground py-12">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                <p className="mt-3 text-sm">Redirecting…</p>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <PhoneOtpForm onSuccess={() => router.replace(safeRedirect)} />

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="max-w-md mx-auto flex flex-col gap-2.5 text-xs text-muted-foreground"
            >
                <span className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Secure phone-OTP sign-in. We never store your password.
                </span>
                <span className="flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5 text-primary" />
                    Your past orders and shipping address stay linked to your number.
                </span>
            </motion.div>
        </div>
    )
}

export function LoginClient() {
    return (
        <Suspense
            fallback={
                <div className="max-w-md mx-auto text-center text-muted-foreground py-12">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </div>
            }
        >
            <LoginInner />
        </Suspense>
    )
}

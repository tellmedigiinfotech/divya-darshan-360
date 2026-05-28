"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, Loader2, ShieldCheck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { PhoneOtpForm } from "@/components/phone-otp-form"
import { apiFetch, ApiError } from "@/lib/api"

type AdminCheck = "idle" | "checking" | "denied"

export function AdminLoginClient() {
    const router = useRouter()
    const params = useSearchParams()
    const { user, loading, signOut } = useAuth()
    const [checkState, setCheckState] = useState<AdminCheck>("idle")
    const [denied, setDenied] = useState(false)

    const next = params.get("next") || "/admin"

    useEffect(() => {
        if (loading || !user) return
        let cancelled = false
        setCheckState("checking")
        ;(async () => {
            try {
                await apiFetch("/admin/me", { auth: true })
                if (!cancelled) router.replace(next)
            } catch (err) {
                if (cancelled) return
                if (err instanceof ApiError && err.status === 404) {
                    // Signed in, but not on the admin allowlist. Sign them
                    // out so they can try a different number.
                    await signOut()
                    setDenied(true)
                    setCheckState("denied")
                    return
                }
                setCheckState("idle")
            }
        })()
        return () => {
            cancelled = true
        }
    }, [user, loading, next, router, signOut])

    if (loading || checkState === "checking") {
        return (
            <div className="text-center text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
        )
    }

    return (
        <div className="w-full max-w-md">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-6"
            >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to site
            </Link>

            <div className="glass rounded-3xl p-8 ornate-border">
                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-5">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-primary tracking-[0.3em] uppercase text-xs block mb-2">Admin</span>
                    <h1 className="text-2xl font-serif mb-2">Sign in</h1>
                    <p className="text-sm text-muted-foreground">
                        Verify your phone number via OTP.
                    </p>
                </div>

                {denied && (
                    <div className="flex items-start gap-2 text-xs text-destructive mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>That number isn&apos;t authorized. Try the registered admin number.</p>
                    </div>
                )}

                {/* No onSuccess redirect — the useEffect above handles it after
                    checking /admin/me, so non-admins see the denied message
                    here instead of a flash of 404 on /admin. */}
                <PhoneOtpForm onSuccess={() => undefined} />
            </div>
        </div>
    )
}

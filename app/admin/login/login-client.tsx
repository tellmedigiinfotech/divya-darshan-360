"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import {
    getAdminPassword,
    setAdminPassword,
    verifyAdminPassword,
} from "@/lib/admin-auth"

export function AdminLoginClient() {
    const router = useRouter()
    const params = useSearchParams()
    const [password, setPassword] = useState("")
    const [showPw, setShowPw] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const next = params.get("next") || "/admin"

    useEffect(() => {
        if (getAdminPassword()) router.replace(next)
    }, [next, router])

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        const pw = password.trim()
        if (!pw) {
            setError("Enter the admin password.")
            return
        }
        setError(null)
        setSubmitting(true)
        try {
            const ok = await verifyAdminPassword(pw)
            if (!ok) {
                setError("Incorrect password.")
                return
            }
            setAdminPassword(pw)
            router.replace(next)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not verify password.")
        } finally {
            setSubmitting(false)
        }
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
                        Enter the shared admin password.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <label htmlFor="admin-password" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="admin-password"
                                type={showPw ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                autoComplete="current-password"
                                className="w-full px-4 py-3 pr-11 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw((s) => !s)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                                aria-label={showPw ? "Hide password" : "Show password"}
                            >
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-start gap-2 text-xs text-destructive">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full divine-button shadow-(--saffron-glow) text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submitting ? "Verifying…" : "Sign in"}
                    </button>
                </form>

                <p className="text-[11px] text-muted-foreground text-center mt-6">
                    Customers sign in via{" "}
                    <Link href="/login" className="underline hover:text-primary">
                        phone OTP
                    </Link>
                    .
                </p>
            </div>
        </div>
    )
}

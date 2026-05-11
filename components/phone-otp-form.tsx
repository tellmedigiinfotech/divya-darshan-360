"use client"

import { useId, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Phone, ShieldCheck } from "lucide-react"
import type { ConfirmationResult } from "firebase/auth"
import { useAuth } from "@/components/auth-provider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

type Step = "phone" | "otp"

export function PhoneOtpForm({
    onSuccess,
    title = "Sign in to continue",
    description = "We'll send a 6-digit OTP to your phone number.",
}: {
    onSuccess?: () => void
    title?: string
    description?: string
}) {
    const { sendOtp, verifyOtp } = useAuth()
    const recaptchaId = useId().replace(/:/g, "")
    const [step, setStep] = useState<Step>("phone")
    const [phone, setPhone] = useState("")
    const [code, setCode] = useState("")
    const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const digits = phone.replace(/\D/g, "")
        if (!/^[6-9]\d{9}$/.test(digits)) {
            setError("Enter a valid 10-digit Indian mobile number.")
            return
        }
        setBusy(true)
        try {
            const result = await sendOtp(`+91${digits}`, recaptchaId)
            setConfirmation(result)
            setStep("otp")
        } catch (err) {
            setError(messageFor(err, "Could not send OTP. Please try again."))
        } finally {
            setBusy(false)
        }
    }

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        if (!confirmation) {
            setError("Please request an OTP first.")
            return
        }
        if (code.length !== 6) {
            setError("Enter the 6-digit OTP.")
            return
        }
        setBusy(true)
        try {
            await verifyOtp(confirmation, code)
            onSuccess?.()
        } catch (err) {
            setError(messageFor(err, "Invalid OTP. Please try again."))
        } finally {
            setBusy(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-full max-w-md mx-auto"
        >
            <div className="glass rounded-[2rem] p-7 md:p-9 ornate-border">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                        {step === "phone" ? (
                            <Phone className="w-6 h-6 text-primary" />
                        ) : (
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        )}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-serif">
                        {step === "phone" ? title : "Enter the OTP"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        {step === "phone"
                            ? description
                            : `Sent to +91 ${phone.replace(/(\d{5})(\d{5})/, "$1 $2")}`}
                    </p>
                </div>

                {step === "phone" ? (
                    <form onSubmit={handleSendOtp} className="space-y-4" noValidate>
                        <div>
                            <Label
                                htmlFor="otp-phone"
                                className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground"
                            >
                                Mobile number *
                            </Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    +91
                                </span>
                                <Input
                                    id="otp-phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    maxLength={10}
                                    autoComplete="tel-national"
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                                    }
                                    placeholder="9876543210"
                                    className="h-12 pl-12 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                        </div>

                        {error && <p className="text-xs text-destructive">{error}</p>}

                        <button
                            type="submit"
                            disabled={busy}
                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full divine-button shadow-(--saffron-glow) text-base disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {busy ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="font-serif tracking-wide">Sending…</span>
                                </>
                            ) : (
                                <span className="font-serif tracking-wide">Send OTP</span>
                            )}
                        </button>
                        <p className="text-[11px] text-muted-foreground text-center">
                            By continuing you agree to receive a one-time SMS from Divya Darshan 360.
                        </p>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-5" noValidate>
                        <div className="flex justify-center">
                            <InputOTP
                                maxLength={6}
                                value={code}
                                onChange={(v) => setCode(v.replace(/\D/g, ""))}
                                inputMode="numeric"
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>

                        {error && (
                            <p className="text-xs text-destructive text-center">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={busy || code.length !== 6}
                            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full divine-button shadow-(--saffron-glow) text-base disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {busy ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="font-serif tracking-wide">Verifying…</span>
                                </>
                            ) : (
                                <span className="font-serif tracking-wide">Verify & Continue</span>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setStep("phone")
                                setCode("")
                                setError(null)
                            }}
                            className="w-full inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Change number
                        </button>
                    </form>
                )}
            </div>

            {/* Invisible reCAPTCHA target. Firebase Auth attaches the widget here. */}
            <div id={recaptchaId} className="absolute pointer-events-none opacity-0" />
        </motion.div>
    )
}

function messageFor(err: unknown, fallback: string): string {
    if (err && typeof err === "object" && "code" in err) {
        const code = String((err as { code?: string }).code || "")
        switch (code) {
            case "auth/invalid-phone-number":
                return "Please enter a valid phone number with country code."
            case "auth/quota-exceeded":
            case "auth/too-many-requests":
                return "Too many attempts. Try again after a few minutes."
            case "auth/invalid-verification-code":
                return "The OTP you entered is incorrect. Please try again."
            case "auth/code-expired":
                return "This OTP has expired. Please request a new one."
            case "auth/network-request-failed":
                return "Network error. Check your connection and try again."
            case "auth/captcha-check-failed":
                return "reCAPTCHA check failed. Please refresh and try again."
        }
        const maybeMsg = (err as { message?: unknown }).message
        if (typeof maybeMsg === "string" && maybeMsg.length > 0) {
            return maybeMsg
        }
    }
    if (err instanceof Error) return err.message
    return fallback
}

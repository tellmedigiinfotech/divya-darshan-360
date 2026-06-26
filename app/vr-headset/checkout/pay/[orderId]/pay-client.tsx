"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    ClipboardCopy,
    Loader2,
    Smartphone,
    Wallet,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, ApiError } from "@/lib/api"
import { trackPurchaseConversion } from "@/lib/gtag"

type OrderStatus = "awaiting_payment" | "created" | "paid" | "failed" | "expired"

type OrderStatusResponse = {
    order_id: string
    status: OrderStatus
    amount_paise: number
    amount_display: string
    currency: string
    reference: string | null
    upi_id: string | null
    account_number: string | null
    ifsc: string | null
    beneficiary_name: string | null
    paid_at: string | null
    payer: { name?: string | null; vpa?: string | null; method?: string | null } | null
    expires_at_iso: string | null
}

const POLL_MS = 5000
const SHOW_DELAY_BANNER_AFTER_SECONDS = 600 // 10 minutes

export function PayClient({ orderId }: { orderId: string }) {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [order, setOrder] = useState<OrderStatusResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState<string | null>(null)
    const [secondsWaiting, setSecondsWaiting] = useState(0)

    const pollRef = useRef<number | null>(null)
    const tickRef = useRef<number | null>(null)

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            router.replace(
                `/login?next=/vr-headset/checkout/pay/${encodeURIComponent(orderId)}`
            )
            return
        }

        let cancelled = false

        const fetchOnce = async (): Promise<OrderStatusResponse | null> => {
            try {
                const data = await apiFetch<OrderStatusResponse>(
                    `/orders/${encodeURIComponent(orderId)}/status`,
                    { auth: true }
                )
                if (!cancelled) setOrder(data)
                return data
            } catch (err) {
                if (cancelled) return null
                const msg =
                    err instanceof ApiError
                        ? err.message
                        : err instanceof Error
                          ? err.message
                          : "Could not load order."
                setError(msg)
                return null
            }
        }

        fetchOnce().then((d) => {
            if (cancelled) return
            if (d && d.status === "paid") return // no need to poll
            pollRef.current = window.setInterval(async () => {
                const latest = await fetchOnce()
                if (latest && latest.status === "paid" && pollRef.current) {
                    window.clearInterval(pollRef.current)
                    pollRef.current = null
                }
            }, POLL_MS)
        })

        tickRef.current = window.setInterval(() => {
            if (!cancelled) setSecondsWaiting((s) => s + 1)
        }, 1000)

        return () => {
            cancelled = true
            if (pollRef.current) window.clearInterval(pollRef.current)
            if (tickRef.current) window.clearInterval(tickRef.current)
        }
    }, [user, authLoading, router, orderId])

    // Fire the Google Ads purchase conversion once the backend confirms payment.
    // trackPurchaseConversion guards against double-counting on re-render/refresh.
    useEffect(() => {
        if (order?.status === "paid") {
            trackPurchaseConversion({
                orderId: order.order_id,
                transactionId: order.reference ?? order.order_id,
                value: order.amount_paise / 100,
                currency: order.currency || "INR",
            })
        }
    }, [order?.status, order?.order_id, order?.reference, order?.amount_paise, order?.currency])

    const copy = (key: string, value: string) => {
        if (!navigator?.clipboard) return
        navigator.clipboard.writeText(value).then(() => {
            setCopied(key)
            setTimeout(() => setCopied((k) => (k === key ? null : k)), 1800)
        })
    }

    if (authLoading || (!error && !order)) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </main>
        )
    }

    if (error || !order) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full flex items-start gap-3 glass rounded-2xl p-5 border border-destructive/40">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-destructive font-medium">Could not load order</p>
                        <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        <Link
                            href="/vr-headset/checkout"
                            className="text-xs text-primary hover:underline mt-3 inline-block"
                        >
                            ← Back to checkout
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    // Paid — show confirmation
    if (order.status === "paid") {
        return (
            <main className="min-h-screen pt-16 px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="glass rounded-[2.5rem] p-10 md:p-14 ornate-border text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif mb-4">Payment received</h1>
                        <p className="text-muted-foreground text-base md:text-lg mb-8">
                            Thank you. Your order is confirmed and a receipt is on its way to your email.
                        </p>
                        <div className="inline-flex items-center gap-3 glass rounded-full px-5 py-3 mb-8">
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                                Reference
                            </span>
                            <span className="font-mono font-medium text-primary">{order.reference}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/account"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full divine-button shadow-(--saffron-glow)"
                            >
                                View my orders
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                            >
                                Back to home
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
        )
    }

    // Awaiting payment — show instructions
    const upiId = order.upi_id || ""
    const reference = order.reference || ""
    const amountForUpi = (order.amount_paise / 100).toFixed(2)
    const upiDeepLink = upiId
        ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
              "Divya Darshan 360"
          )}&am=${amountForUpi}&cu=INR&tn=${encodeURIComponent(reference)}`
        : ""
    const qrSrc = upiDeepLink
        ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
              upiDeepLink
          )}`
        : ""

    const showDelayBanner = secondsWaiting >= SHOW_DELAY_BANNER_AFTER_SECONDS

    return (
        <main className="min-h-screen pt-10 pb-20 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto mb-6">
                <Link
                    href="/vr-headset/checkout"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to checkout
                </Link>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl mx-auto"
            >
                <div className="text-center mb-8">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-3 block">
                        Pay via UPI
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tighter">
                        ₹{order.amount_display}
                    </h1>
                    <p className="text-muted-foreground text-sm mt-3">
                        Reference{" "}
                        <span className="font-mono text-foreground/90">{reference}</span>
                    </p>
                </div>

                <div className="glass rounded-3xl p-6 md:p-8 ornate-border">
                    {/* QR + UPI button */}
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div className="flex flex-col items-center justify-center">
                            {qrSrc ? (
                                <img
                                    src={qrSrc}
                                    alt="UPI QR code"
                                    className="w-60 h-60 rounded-2xl bg-white p-2 shadow-md"
                                />
                            ) : (
                                <div className="w-60 h-60 rounded-2xl bg-muted flex items-center justify-center text-sm text-muted-foreground">
                                    QR unavailable
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-3">
                                Scan with any UPI app
                            </p>
                        </div>

                        <div className="flex flex-col justify-center gap-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Scan the QR or tap below to open your UPI app pre-filled with
                                the correct amount + reference.
                            </p>
                            {upiDeepLink && (
                                <a
                                    href={upiDeepLink}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full divine-button shadow-(--saffron-glow)"
                                >
                                    <Smartphone className="w-4 h-4" />
                                    <span className="font-serif tracking-wide">
                                        Open UPI app
                                    </span>
                                </a>
                            )}
                            <p className="text-[11px] text-muted-foreground text-center">
                                Works with GPay, PhonePe, Paytm, BHIM, CRED.
                            </p>
                        </div>
                    </div>

                    {/* Manual fields */}
                    <div className="border-t border-white/10 pt-6">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
                            <Wallet className="w-3.5 h-3.5" />
                            Or pay manually via UPI / bank transfer
                        </div>
                        <Row
                            label="UPI ID"
                            value={upiId}
                            copyKey="upi"
                            copied={copied}
                            onCopy={copy}
                            mono
                        />
                        <Row
                            label="Account no."
                            value={order.account_number || ""}
                            copyKey="acc"
                            copied={copied}
                            onCopy={copy}
                            mono
                        />
                        <Row
                            label="IFSC"
                            value={order.ifsc || ""}
                            copyKey="ifsc"
                            copied={copied}
                            onCopy={copy}
                            mono
                        />
                        <Row
                            label="Beneficiary"
                            value={order.beneficiary_name || ""}
                            copyKey="ben"
                            copied={copied}
                            onCopy={copy}
                        />
                        <Row
                            label="Reference"
                            value={reference}
                            copyKey="ref"
                            copied={copied}
                            onCopy={copy}
                            mono
                            hint='Add this in the UPI "note" field for instant confirmation.'
                        />
                    </div>
                </div>

                {/* Polling indicator */}
                <div className="mt-6 flex items-center justify-center gap-3 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    Waiting for payment…
                </div>

                {showDelayBanner && (
                    <div className="mt-6 max-w-2xl mx-auto flex items-start gap-3 glass rounded-2xl p-5 border border-amber-500/30">
                        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-medium text-amber-900 dark:text-amber-300">
                                Still waiting?
                            </p>
                            <p className="text-muted-foreground mt-1">
                                If you've already paid but this page hasn't updated, your payment
                                may need a manual check. We'll confirm by email within 24 hours.
                                Reference: <span className="font-mono">{reference}</span>
                            </p>
                        </div>
                    </div>
                )}
            </motion.div>
        </main>
    )
}

function Row({
    label,
    value,
    copyKey,
    copied,
    onCopy,
    mono,
    hint,
}: {
    label: string
    value: string
    copyKey: string
    copied: string | null
    onCopy: (k: string, v: string) => void
    mono?: boolean
    hint?: string
}) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-3 border-b border-white/10 last:border-b-0">
            <span className="text-xs uppercase tracking-wider text-muted-foreground/80 shrink-0 sm:w-36">
                {label}
            </span>
            <div className="flex-1 min-w-0 flex items-center gap-2">
                <span
                    className={`break-all flex-1 ${mono ? "font-mono text-sm" : "text-sm"} text-foreground/90`}
                >
                    {value}
                </span>
                <button
                    type="button"
                    onClick={() => onCopy(copyKey, value)}
                    className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                    title={`Copy ${label}`}
                >
                    {copied === copyKey ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                        <ClipboardCopy className="w-4 h-4 text-muted-foreground" />
                    )}
                </button>
            </div>
            {hint && (
                <p className="text-[11px] text-muted-foreground italic sm:basis-full sm:pl-36">
                    {hint}
                </p>
            )}
        </div>
    )
}

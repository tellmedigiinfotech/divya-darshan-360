"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, Truck, ShieldCheck } from "lucide-react"
import { apiFetch } from "@/lib/api"
import { trackPurchaseConversion } from "@/lib/gtag"

type OrderStatus = {
    found: boolean
    status?: string
    payment_method?: string
    amount_paise?: number
    receipt?: string
}

const POLL_INTERVAL_MS = 2500
const MAX_POLLS = 12 // ~30s — the order webhook usually lands within a few seconds.

export function SuccessClient() {
    const searchParams = useSearchParams()
    const [order, setOrder] = useState<OrderStatus | null>(null)
    const [stillWaiting, setStillWaiting] = useState(true)
    const firedRef = useRef(false)

    useEffect(() => {
        // Fastrr may append the order id to the redirect; otherwise use what we
        // stashed when the checkout token was generated.
        const fromUrl =
            searchParams?.get("order_id") ||
            searchParams?.get("orderId") ||
            searchParams?.get("id")
        let orderId = fromUrl || null
        if (!orderId) {
            try {
                orderId = sessionStorage.getItem("fastrr_pending_order")
            } catch {
                orderId = null
            }
        }
        if (!orderId) {
            setStillWaiting(false)
            return
        }

        let cancelled = false
        let polls = 0

        const poll = async () => {
            polls += 1
            try {
                const data = await apiFetch<OrderStatus>(
                    `/fastrr/order-status/${encodeURIComponent(orderId!)}`
                )
                if (cancelled) return
                if (data.found) {
                    setOrder(data)
                    setStillWaiting(false)
                    if (!firedRef.current) {
                        firedRef.current = true
                        trackPurchaseConversion({
                            orderId: orderId!,
                            transactionId: data.receipt || orderId!,
                            value: (data.amount_paise || 0) / 100,
                            currency: "INR",
                        })
                    }
                    try {
                        sessionStorage.removeItem("fastrr_pending_order")
                    } catch {
                        /* ignore */
                    }
                    return
                }
            } catch {
                /* transient — keep polling */
            }
            if (!cancelled && polls < MAX_POLLS) {
                setTimeout(poll, POLL_INTERVAL_MS)
            } else if (!cancelled) {
                setStillWaiting(false)
            }
        }
        poll()

        return () => {
            cancelled = true
        }
    }, [searchParams])

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass rounded-[2.5rem] p-10 md:p-14 ornate-border text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h1 className="text-3xl md:text-5xl font-serif mb-4">Order confirmed</h1>
                <p className="text-muted-foreground text-base md:text-lg mb-8">
                    Thank you for your order. We&apos;ll arrange delivery shortly and keep you posted.
                </p>

                {order?.receipt && (
                    <div className="inline-flex items-center gap-3 glass rounded-full px-5 py-3 mb-8">
                        <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Order</span>
                        <span className="font-mono font-medium text-primary">{order.receipt}</span>
                    </div>
                )}

                {stillWaiting && !order && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        Finalising your order…
                    </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
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

                <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-primary" /> Ships in 2–3 business days
                    </span>
                    <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-primary" /> 7-day replacement
                    </span>
                </div>
            </div>
        </div>
    )
}

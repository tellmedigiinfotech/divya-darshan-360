"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    AlertCircle,
    Box,
    Calendar,
    CheckCircle2,
    Clock,
    CreditCard,
    FileText,
    Loader2,
    Mail,
    MessageCircle,
    PauseCircle,
    XCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, ApiError } from "@/lib/api"

type OrderListItem = {
    razorpay_order_id: string
    receipt: string
    status: string
    amount: number
    amount_paid: number
    currency: string
    product_name: string
    quantity: number
    created_at: string | null
    paid_at: string | null
}

const STATUS_STYLES: Record<string, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
    paid: { label: "Confirmed", cls: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20", icon: CheckCircle2 },
    created: { label: "Pending", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: Clock },
    awaiting_payment: { label: "Pending", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20", icon: PauseCircle },
    failed: { label: "Failed", cls: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20", icon: XCircle },
    expired: { label: "Expired", cls: "bg-gray-500/15 text-gray-500 dark:text-gray-400 border-gray-500/20", icon: XCircle },
}

const PENDING_STATUSES = new Set(["created", "awaiting_payment"])

function formatTimestamp(value: string | null): string {
    if (!value) return ""
    // Pure-digit string → treat as epoch (seconds or ms).
    if (/^\d+$/.test(value)) {
        const numeric = Number.parseInt(value, 10)
        if (numeric > 0) {
            const ms = numeric < 1e12 ? numeric * 1000 : numeric
            return new Date(ms).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
            })
        }
    }
    // Otherwise parse as an ISO / RFC date string.
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        })
    }
    return value
}

export function AccountClient() {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [orders, setOrders] = useState<OrderListItem[] | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            router.replace("/login?next=/account")
            return
        }
        let cancelled = false
        ;(async () => {
            try {
                const list = await apiFetch<OrderListItem[]>("/customers/me/orders?limit=50", { auth: true })
                if (!cancelled) setOrders(list)
            } catch (err) {
                if (cancelled) return
                const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not load orders."
                setError(msg)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [user, authLoading, router])

    if (authLoading || (!error && orders === null)) {
        return (
            <div className="max-w-md mx-auto text-center text-muted-foreground py-16">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="flex items-start gap-3 glass rounded-2xl p-5 border border-destructive/40">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            </div>
        )
    }

    if (!orders || orders.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-2xl mx-auto"
            >
                <div className="glass rounded-3xl p-10 md:p-14 ornate-border text-center">
                    <Box className="w-12 h-12 text-primary/60 mx-auto mb-4" />
                    <h2 className="text-2xl font-serif mb-2">No orders yet</h2>
                    <p className="text-muted-foreground mb-8">When you place your first order, it'll appear here.</p>
                    <Link
                        href="/vr-headset"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full divine-button shadow-(--saffron-glow)"
                    >
                        <span className="font-serif tracking-wide">Browse VR Headset</span>
                        <span>→</span>
                    </Link>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {orders.map((order, idx) => {
                const status = STATUS_STYLES[order.status] || STATUS_STYLES.created
                const StatusIcon = status.icon
                const amountRupees = (order.status === "paid" ? order.amount_paid : order.amount) / 100
                const trackMsg = `Hi, I'd like to track my order ${order.razorpay_order_id} (${order.product_name}). Thank you!`
                const waHref = `https://wa.me/919049921850?text=${encodeURIComponent(trackMsg)}`
                const mailHref = `mailto:connect@youtellme.ai?subject=${encodeURIComponent(`Track order ${order.razorpay_order_id}`)}&body=${encodeURIComponent(trackMsg)}`
                return (
                    <motion.div
                        key={order.razorpay_order_id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: Math.min(idx, 6) * 0.05 }}
                        className="glass rounded-3xl p-5 md:p-6 ornate-border"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.cls}`}>
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        {status.label}
                                    </span>
                                    {(order.paid_at || order.created_at) && (
                                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {formatTimestamp(order.paid_at || order.created_at)}
                                        </span>
                                    )}
                                </div>
                                <p className="font-serif text-lg leading-tight">
                                    {order.product_name} <span className="text-muted-foreground">× {order.quantity}</span>
                                </p>
                                <p className="text-xs font-mono text-muted-foreground mt-1.5 truncate">
                                    {order.razorpay_order_id}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 md:gap-5 md:flex-col md:items-end">
                                <p className="text-xl font-serif text-primary md:order-1">
                                    ₹{amountRupees.toLocaleString("en-IN")}
                                </p>
                                {order.status === "paid" && (
                                    <Link
                                        href={`/account/orders/${encodeURIComponent(order.razorpay_order_id)}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all md:order-2"
                                    >
                                        <FileText className="w-4 h-4" />
                                        Receipt
                                    </Link>
                                )}
                                {PENDING_STATUSES.has(order.status) && (
                                    <Link
                                        href={`/vr-headset/checkout?resume=${encodeURIComponent(order.razorpay_order_id)}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full divine-button shadow-(--saffron-glow) text-sm font-medium md:order-2"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Continue payment
                                    </Link>
                                )}
                                {order.status === "expired" && (
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300/40 text-gray-500 text-sm font-medium md:order-2">
                                        <XCircle className="w-4 h-4" />
                                        Order expired
                                    </span>
                                )}
                            </div>
                        </div>
                        {order.status === "paid" && (
                            <div className="mt-4 pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p className="text-xs text-muted-foreground">
                                    Track this order — reach out to us:
                                </p>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={waHref}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500 hover:text-white transition-all"
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        WhatsApp
                                    </a>
                                    <a
                                        href={mailHref}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                        Email
                                    </a>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}

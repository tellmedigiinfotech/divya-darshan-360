"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, Loader2, Mail, MessageCircle, Printer, Truck } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, ApiError } from "@/lib/api"

type Address = {
    line1?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
    notes?: string
}

type OrderView = {
    razorpay_order_id: string
    receipt: string
    status: string
    amount: number
    amount_paid: number
    currency: string
    item: {
        sku: string
        name: string
        quantity: number
        unit_price_paise: number
        line_total_paise: number
    }
    customer: { full_name: string; phone: string; email: string | null }
    shipping_address: Address
    created_at: string | null
    paid_at: string | null
}

function formatTimestamp(value: string | null): string {
    if (!value) return "—"
    if (/^\d+$/.test(value)) {
        const numeric = Number.parseInt(value, 10)
        if (numeric > 0) {
            const ms = numeric < 1e12 ? numeric * 1000 : numeric
            return new Date(ms).toLocaleString("en-IN", {
                dateStyle: "long", timeStyle: "short",
            })
        }
    }
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })
    }
    return value
}

export function ReceiptClient({ orderId }: { orderId: string }) {
    const router = useRouter()
    const { user, loading: authLoading } = useAuth()
    const [order, setOrder] = useState<OrderView | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            router.replace(`/login?next=/account/orders/${encodeURIComponent(orderId)}`)
            return
        }
        let cancelled = false
        ;(async () => {
            try {
                const data = await apiFetch<OrderView>(`/orders/${encodeURIComponent(orderId)}`, { auth: true })
                if (!cancelled) setOrder(data)
            } catch (err) {
                if (cancelled) return
                const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not load receipt."
                setError(msg)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [user, authLoading, router, orderId])

    if (authLoading || (!error && !order)) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </main>
        )
    }

    if (error) {
        return (
            <main className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full flex items-start gap-3 glass rounded-2xl p-5 border border-destructive/40">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-destructive font-medium">Could not load receipt</p>
                        <p className="text-xs text-muted-foreground mt-1">{error}</p>
                        <Link href="/account" className="text-xs text-primary hover:underline mt-3 inline-block">
                            ← Back to orders
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    if (!order) return null

    const amountRupees = (order.status === "paid" ? order.amount_paid : order.amount) / 100
    const unitRupees = order.item.unit_price_paise / 100
    const lineTotalRupees = order.item.line_total_paise / 100
    const symbol = order.currency === "INR" ? "₹" : `${order.currency} `

    const handlePrint = () => {
        if (typeof window !== "undefined") window.print()
    }

    const trackMsg = `Hi, I'd like to track my order ${order.razorpay_order_id} (${order.item.name}). Thank you!`
    const waHref = `https://wa.me/919049921850?text=${encodeURIComponent(trackMsg)}`
    const mailHref = `mailto:connect@youtellme.ai?subject=${encodeURIComponent(`Track order ${order.razorpay_order_id}`)}&body=${encodeURIComponent(trackMsg)}`

    return (
        <main className="min-h-screen py-10 px-4 print:py-0 print:px-0 print:bg-white">
            {/* Toolbar — hidden during print */}
            <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
                <Link
                    href="/account"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to orders
                </Link>
                <button
                    type="button"
                    onClick={handlePrint}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full divine-button shadow-(--saffron-glow)"
                >
                    <Printer className="w-4 h-4" />
                    <span className="font-serif tracking-wide">Print / Save as PDF</span>
                </button>
            </div>

            {/* Receipt itself */}
            <article className="max-w-3xl mx-auto bg-white text-gray-900 rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden print:shadow-none print:rounded-none">
                <header
                    className="px-8 py-8 text-center text-white"
                    style={{ background: "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)" }}
                >
                    <p className="font-serif text-2xl tracking-tight">
                        Divya Darshan <em className="italic">360</em>
                    </p>
                    <p className="mt-2 text-xs tracking-[0.3em] uppercase opacity-90">Payment Receipt</p>
                </header>

                <div className="px-8 py-8 space-y-7">
                    <p className="text-sm">
                        Namaste {order.customer.full_name || "devotee"},
                        <br />
                        thank you for your order. This is your official receipt.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Order ID</p>
                            <p className="font-mono text-amber-700 break-all">{order.razorpay_order_id}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Receipt No.</p>
                            <p className="font-mono">{order.receipt}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Date</p>
                            <p>{formatTimestamp(order.paid_at || order.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Status</p>
                            <p className="font-medium uppercase tracking-wider text-green-700">{order.status}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200" />

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
                                <th className="text-left pb-3 font-medium">Item</th>
                                <th className="text-right pb-3 font-medium">Qty</th>
                                <th className="text-right pb-3 font-medium">Unit</th>
                                <th className="text-right pb-3 font-medium">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 font-serif">{order.item.name}</td>
                                <td className="py-2 text-right">{order.item.quantity}</td>
                                <td className="py-2 text-right">{symbol}{unitRupees.toLocaleString("en-IN")}</td>
                                <td className="py-2 text-right">{symbol}{lineTotalRupees.toLocaleString("en-IN")}</td>
                            </tr>
                            <tr className="text-gray-600">
                                <td colSpan={3} className="py-2 pt-3 text-right">Shipping</td>
                                <td className="py-2 pt-3 text-right text-green-700">Free</td>
                            </tr>
                            <tr className="border-t border-gray-200">
                                <td colSpan={3} className="py-3 text-right font-serif text-base">Total paid</td>
                                <td className="py-3 text-right font-serif text-lg text-amber-700">
                                    {symbol}{amountRupees.toLocaleString("en-IN")}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="border-t border-gray-200" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Customer</p>
                            <p>{order.customer.full_name || "—"}</p>
                            <p className="text-gray-600">{order.customer.phone}</p>
                            {order.customer.email && <p className="text-gray-600">{order.customer.email}</p>}
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">Shipping to</p>
                            <p>{order.shipping_address.line1}</p>
                            <p className="text-gray-600">
                                {order.shipping_address.city}
                                {order.shipping_address.state ? `, ${order.shipping_address.state}` : ""}
                                {order.shipping_address.pincode ? ` - ${order.shipping_address.pincode}` : ""}
                            </p>
                            <p className="text-gray-600">{order.shipping_address.country || "IN"}</p>
                            {order.shipping_address.notes && (
                                <p className="text-gray-500 italic mt-1">Note: {order.shipping_address.notes}</p>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                        <p>Ships in 2–3 business days · 7-day replacement · Free in India.</p>
                        <p className="hidden print:block mt-1">
                            Questions? Email <span className="font-medium">connect@youtellme.ai</span> or call +91 90499 21850.
                        </p>
                    </div>

                    <div className="print:hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/40 to-amber-50 p-5">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="shrink-0 w-10 h-10 rounded-full bg-amber-100 border border-amber-300/60 flex items-center justify-center">
                                <Truck className="w-5 h-5 text-amber-700" />
                            </div>
                            <div>
                                <p className="font-serif text-base text-amber-900 leading-tight">
                                    Track this order
                                </p>
                                <p className="text-xs text-amber-800/80 mt-1">
                                    Our team will share shipping & delivery updates. We typically reply within a few hours.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5 pl-13 sm:pl-0">
                            <a
                                href={waHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium shadow-lg shadow-green-500/25 hover:shadow-green-500/50 hover:-translate-y-0.5 transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat on WhatsApp
                            </a>
                            <a
                                href={mailHref}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-700 text-white text-sm font-medium shadow-lg shadow-amber-700/25 hover:bg-amber-800 hover:-translate-y-0.5 transition-all"
                            >
                                <Mail className="w-4 h-4" />
                                Send an Email
                            </a>
                        </div>
                        <p className="text-[11px] text-amber-800/70 mt-4 pt-3 border-t border-amber-200/60">
                            Or reach us at <span className="font-medium">connect@youtellme.ai</span> · <span className="font-medium">+91 90499 21850</span>
                        </p>
                    </div>
                </div>

                <footer className="px-8 py-4 bg-gray-900 text-center">
                    <p className="text-[10px] tracking-[0.2em] text-white/60">
                        DIVYADARSHAN360.COM · TELLME DIGI INFOTECH PVT LTD · Payments by Razorpay
                    </p>
                </footer>
            </article>

            <style>{`
                @media print {
                    body { background: white !important; }
                    article { box-shadow: none !important; border-radius: 0 !important; }
                    /* Hide the global AuthButton, Footer, and decorative bits during print */
                    .fixed, footer:not(article > footer), nav { display: none !important; }
                }
            `}</style>
        </main>
    )
}

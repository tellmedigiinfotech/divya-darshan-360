"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    AlertCircle,
    CheckCircle2,
    Copy,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    PackageCheck,
    Phone,
    Truck,
    User,
} from "lucide-react"
import { ApiError } from "@/lib/api"
import { adminFetch, clearAdminPassword, getAdminPassword } from "@/lib/admin-auth"

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
    item: { sku: string; name: string; quantity: number; unit_price_paise: number; line_total_paise: number }
    customer: { full_name: string; phone: string; email: string | null }
    shipping_address: Address
    created_at: string | null
    paid_at: string | null
    fulfillment_status: string | null
    tracking_number: string | null
    courier: string | null
    shipped_at: string | null
    delivered_at: string | null
    admin_notes: string | null
}

function formatTimestamp(value: string | null): string {
    if (!value) return "—"
    if (/^\d+$/.test(value)) {
        const numeric = Number.parseInt(value, 10)
        if (numeric > 0) {
            const ms = numeric < 1e12 ? numeric * 1000 : numeric
            return new Date(ms).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })
        }
    }
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })
    }
    return value
}

export function OrderDetailClient({ orderId }: { orderId: string }) {
    const router = useRouter()
    const [order, setOrder] = useState<OrderView | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [trackingNumber, setTrackingNumber] = useState("")
    const [courier, setCourier] = useState("")
    const [notes, setNotes] = useState("")
    const [submitting, setSubmitting] = useState<"ship" | "deliver" | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    const load = async () => {
        try {
            const data = await adminFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}`)
            setOrder(data)
            setTrackingNumber(data.tracking_number || "")
            setCourier(data.courier || "")
            setNotes(data.admin_notes || "")
        } catch (err) {
            if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
                clearAdminPassword()
                router.replace(`/admin/login?next=/admin/orders/${encodeURIComponent(orderId)}`)
                return
            }
            const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not load order."
            setError(msg)
        }
    }

    useEffect(() => {
        if (!getAdminPassword()) {
            router.replace(`/admin/login?next=/admin/orders/${encodeURIComponent(orderId)}`)
            return
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, orderId])

    if (!error && !order) {
        return (
            <div className="max-w-md mx-auto text-center py-16">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
            </div>
        )
    }

    if (error || !order) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="flex items-start gap-3 glass rounded-2xl p-5 border border-destructive/40">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error || "Order not found"}</p>
                </div>
            </div>
        )
    }

    const ship = async () => {
        if (!trackingNumber.trim() || !courier.trim()) {
            setActionError("Tracking number and courier are required.")
            return
        }
        setActionError(null)
        setSubmitting("ship")
        try {
            const updated = await adminFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}/ship`, {
                method: "POST",
                body: {
                    tracking_number: trackingNumber.trim(),
                    courier: courier.trim(),
                    notes: notes.trim() || null,
                },
            })
            setOrder(updated)
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Failed to update.")
        } finally {
            setSubmitting(null)
        }
    }

    const deliver = async () => {
        setActionError(null)
        setSubmitting("deliver")
        try {
            const updated = await adminFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}/deliver`, {
                method: "POST",
                body: { notes: notes.trim() || null },
            })
            setOrder(updated)
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Failed to update.")
        } finally {
            setSubmitting(null)
        }
    }

    const isPaid = order.status === "paid"
    const ff = isPaid ? order.fulfillment_status || "pending" : null
    const amountRupees = (isPaid ? order.amount_paid : order.amount) / 100

    const shipMsg = `Namaste ${order.customer.full_name || ""}, your Divya Darshan 360 order has been shipped via ${order.courier || "<courier>"}. Tracking: ${order.tracking_number || "<tracking>"}.`
    const waHref = `https://wa.me/${order.customer.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(shipMsg)}`
    const mailHref = `mailto:${order.customer.email || ""}?subject=${encodeURIComponent(`Your order ${order.razorpay_order_id} has shipped`)}&body=${encodeURIComponent(shipMsg)}`

    return (
        <div className="max-w-5xl mx-auto space-y-5">
            <div className="glass rounded-3xl p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Order</p>
                        <p className="font-mono text-sm break-all">{order.razorpay_order_id}</p>
                        <p className="text-xs text-muted-foreground mt-1">Receipt: {order.receipt}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-serif text-primary">₹{amountRupees.toLocaleString("en-IN")}</p>
                        <div className="mt-2 flex flex-wrap gap-1.5 justify-end">
                            <Badge tone={isPaid ? "green" : "amber"}>{order.status.toUpperCase()}</Badge>
                            {ff && <Badge tone={ff === "delivered" ? "emerald" : ff === "shipped" ? "blue" : "orange"}>{ff.toUpperCase()}</Badge>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm pt-4 border-t border-white/10">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Customer</p>
                        <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-muted-foreground" />{order.customer.full_name || "—"}</p>
                        <a href={`tel:${order.customer.phone}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                            <Phone className="w-3.5 h-3.5" />{order.customer.phone}
                        </a>
                        {order.customer.email && (
                            <a href={`mailto:${order.customer.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                                <Mail className="w-3.5 h-3.5" />{order.customer.email}
                            </a>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Shipping</p>
                        <p className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <span>
                                {order.shipping_address.line1}<br />
                                {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}<br />
                                {order.shipping_address.country || "IN"}
                            </span>
                        </p>
                        {order.shipping_address.notes && (
                            <p className="text-xs text-muted-foreground italic mt-2">Note: {order.shipping_address.notes}</p>
                        )}
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Item</p>
                        <p>{order.item.name} × {order.item.quantity}</p>
                        <p className="text-xs text-muted-foreground">SKU: {order.item.sku}</p>
                    </div>
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Timeline</p>
                        <p className="text-xs text-muted-foreground">Created: {formatTimestamp(order.created_at)}</p>
                        <p className="text-xs text-muted-foreground">Paid: {formatTimestamp(order.paid_at)}</p>
                        {order.shipped_at && <p className="text-xs text-muted-foreground">Shipped: {formatTimestamp(order.shipped_at)}</p>}
                        {order.delivered_at && <p className="text-xs text-muted-foreground">Delivered: {formatTimestamp(order.delivered_at)}</p>}
                    </div>
                </div>
            </div>

            {isPaid && (
                <div className="glass rounded-3xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-serif text-lg leading-tight">Fulfillment</h2>
                            <p className="text-xs text-muted-foreground">Mark as shipped or delivered. The customer will see this on their receipt.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field label="Courier">
                            <input
                                value={courier}
                                onChange={(e) => setCourier(e.target.value)}
                                placeholder="e.g. Delhivery, DTDC, India Post"
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
                            />
                        </Field>
                        <Field label="Tracking number">
                            <input
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="e.g. 1234567890"
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50"
                            />
                        </Field>
                        <div className="md:col-span-2">
                            <Field label="Notes (optional, admin-only)">
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={2}
                                    placeholder="Anything to remember about this order"
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 resize-none"
                                />
                            </Field>
                        </div>
                    </div>

                    {actionError && (
                        <div className="mt-3 flex items-start gap-2 text-xs text-destructive">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p>{actionError}</p>
                        </div>
                    )}

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={ship}
                            disabled={submitting !== null}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-blue-500 to-blue-600 text-white text-sm font-medium shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {submitting === "ship" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                            {ff === "shipped" ? "Update tracking" : "Mark as shipped"}
                        </button>
                        {ff !== "delivered" && (
                            <button
                                type="button"
                                onClick={deliver}
                                disabled={submitting !== null}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {submitting === "deliver" ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackageCheck className="w-4 h-4" />}
                                Mark as delivered
                            </button>
                        )}
                        {order.tracking_number && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof navigator !== "undefined" && navigator.clipboard) {
                                        navigator.clipboard.writeText(order.tracking_number || "")
                                    }
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                Copy tracking
                            </button>
                        )}
                    </div>

                    {ff === "shipped" && order.tracking_number && (
                        <div className="mt-5 pt-5 border-t border-white/10">
                            <p className="text-xs text-muted-foreground mb-2">Notify customer with this update:</p>
                            <div className="flex flex-wrap gap-2">
                                <a
                                    href={waHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-green-500 to-green-600 text-white text-sm font-medium shadow-md shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-0.5 transition-all"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp customer
                                </a>
                                {order.customer.email && (
                                    <a
                                        href={mailHref}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email customer
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {ff === "delivered" && (
                        <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-2 text-sm text-emerald-500">
                            <CheckCircle2 className="w-4 h-4" />
                            Marked delivered{order.delivered_at ? ` on ${formatTimestamp(order.delivered_at)}` : ""}.
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-1 block">{label}</span>
            {children}
        </label>
    )
}

function Badge({ tone, children }: { tone: "green" | "amber" | "blue" | "orange" | "emerald"; children: React.ReactNode }) {
    const cls = {
        green: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
        amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        orange: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
        emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    }[tone]
    return (
        <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
            {children}
        </span>
    )
}

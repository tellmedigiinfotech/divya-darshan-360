"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import {
    AlertCircle,
    Ban,
    CheckCircle2,
    Copy,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    PackageCheck,
    Phone,
    RotateCcw,
    Trash2,
    Truck,
    User,
    XCircle,
} from "lucide-react"
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
    payment_method: string | null
    razorpay_payment_id: string | null
    refund_id: string | null
    refund_amount: number | null
    refund_status: string | null
    refunded_at: string | null
    refund_reason: string | null
    cancelled_at: string | null
    cancellation_reason: string | null
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
    const { user, loading: authLoading } = useAuth()
    const [order, setOrder] = useState<OrderView | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [trackingNumber, setTrackingNumber] = useState("")
    const [courier, setCourier] = useState("")
    const [notes, setNotes] = useState("")
    const [submitting, setSubmitting] = useState<"ship" | "deliver" | "refund" | "cancel" | "delete" | null>(null)
    const [actionError, setActionError] = useState<string | null>(null)

    const [refundAmount, setRefundAmount] = useState("")
    const [refundReason, setRefundReason] = useState("")
    const [refundInstant, setRefundInstant] = useState(false)
    const [refundConfirm, setRefundConfirm] = useState(false)

    const [cancelReason, setCancelReason] = useState("")
    const [cancelConfirm, setCancelConfirm] = useState(false)

    const [deleteConfirm, setDeleteConfirm] = useState(false)

    const load = async () => {
        try {
            const data = await apiFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}`, { auth: true })
            setOrder(data)
            setTrackingNumber(data.tracking_number || "")
            setCourier(data.courier || "")
            setNotes(data.admin_notes || "")
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                notFound()
                return
            }
            const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not load order."
            setError(msg)
        }
    }

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            notFound()
        }
        load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading, orderId])

    if (authLoading || (!error && !order)) {
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
            const updated = await apiFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}/ship`, {
                method: "POST",
                auth: true,
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
            const updated = await apiFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}/deliver`, {
                method: "POST",
                auth: true,
                body: { notes: notes.trim() || null },
            })
            setOrder(updated)
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Failed to update.")
        } finally {
            setSubmitting(null)
        }
    }

    const refund = async () => {
        if (!order) return
        if (refundReason.trim().length < 2) {
            setActionError("Please enter a reason for the refund.")
            return
        }
        const rupees = refundAmount.trim() ? Number(refundAmount.trim()) : NaN
        const fullRupees = order.amount_paid / 100
        const amount_paise =
            refundAmount.trim() === "" || rupees === fullRupees
                ? null
                : Math.round(rupees * 100)
        if (amount_paise !== null && (Number.isNaN(rupees) || rupees < 1 || rupees * 100 > order.amount_paid)) {
            setActionError(`Refund amount must be between Re 1 and Rs ${fullRupees}.`)
            return
        }
        setActionError(null)
        setSubmitting("refund")
        try {
            const updated = await apiFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}/refund`, {
                method: "POST",
                auth: true,
                body: {
                    amount_paise,
                    reason: refundReason.trim(),
                    instant: refundInstant,
                },
            })
            setOrder(updated)
            setRefundConfirm(false)
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Refund failed.")
        } finally {
            setSubmitting(null)
        }
    }

    const cancel = async () => {
        if (cancelReason.trim().length < 2) {
            setActionError("Please enter a reason for cancellation.")
            return
        }
        setActionError(null)
        setSubmitting("cancel")
        try {
            const updated = await apiFetch<OrderView>(`/admin/orders/${encodeURIComponent(orderId)}/cancel`, {
                method: "POST",
                auth: true,
                body: { reason: cancelReason.trim() },
            })
            setOrder(updated)
            setCancelConfirm(false)
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Cancel failed.")
        } finally {
            setSubmitting(null)
        }
    }

    const remove = async () => {
        setActionError(null)
        setSubmitting("delete")
        try {
            await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}/delete`, {
                method: "POST",
                auth: true,
            })
            // Order is gone — return to the dashboard list.
            router.push("/admin")
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Delete failed.")
            setSubmitting(null)
        }
    }

    const isPaid = order.status === "paid"
    const isCod = order.status === "cod_pending"
    const isFulfillable = isPaid || isCod
    const ff = isFulfillable ? order.fulfillment_status || "pending" : null
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
                            <Badge tone={order.status === "refunded" || order.status === "cancelled" ? "red" : isPaid ? "green" : isCod ? "blue" : "amber"}>
                                {isCod ? "COD" : order.status.toUpperCase()}
                            </Badge>
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

            {isFulfillable && (
                <div className="glass rounded-3xl p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-serif text-lg leading-tight">Fulfillment</h2>
                            <p className="text-xs text-muted-foreground">
                                {isCod
                                    ? "Cash on Delivery — marking delivered will also record cash collected and flip status to Paid."
                                    : "Mark as shipped or delivered. The customer will see this on their receipt."}
                            </p>
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
                                {isCod ? "Mark delivered + cash collected" : "Mark as delivered"}
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

            {/* Cancel panel — only for COD orders that haven't been delivered yet.
                Cancelled orders show the cancellation summary instead. */}
            {(isCod || order.status === "cancelled") && (
                <CancelPanel
                    order={order}
                    cancelReason={cancelReason}
                    setCancelReason={setCancelReason}
                    cancelConfirm={cancelConfirm}
                    setCancelConfirm={setCancelConfirm}
                    submitting={submitting}
                    actionError={actionError}
                    onCancel={cancel}
                />
            )}

            {/* Refund panel — only meaningful for Razorpay-paid orders.
                Already-refunded orders show the refund summary instead. */}
            {order.razorpay_payment_id && order.status !== "cod_pending" && (
                <RefundPanel
                    order={order}
                    refundAmount={refundAmount}
                    setRefundAmount={setRefundAmount}
                    refundReason={refundReason}
                    setRefundReason={setRefundReason}
                    refundInstant={refundInstant}
                    setRefundInstant={setRefundInstant}
                    refundConfirm={refundConfirm}
                    setRefundConfirm={setRefundConfirm}
                    submitting={submitting}
                    actionError={actionError}
                    onRefund={refund}
                />
            )}

            {/* Danger zone — permanently remove the order from the dashboard.
                Use for test/spam orders; genuine orders should be cancelled or refunded. */}
            <div className="glass rounded-3xl p-6 md:p-8 border border-red-500/20">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h2 className="font-serif text-lg leading-tight">Delete order</h2>
                        <p className="text-xs text-muted-foreground">
                            Permanently removes this order and its linked records. This cannot be undone — use only for test or spam orders.
                        </p>
                    </div>
                </div>

                {submitting !== "delete" && actionError && (
                    <div className="mb-4 flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        {actionError}
                    </div>
                )}

                {!deleteConfirm ? (
                    <button
                        type="button"
                        onClick={() => setDeleteConfirm(true)}
                        disabled={submitting !== null}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-500 text-sm font-medium hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete this order
                    </button>
                ) : (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] p-4">
                        <p className="text-sm font-medium mb-1">Delete order {order.receipt}?</p>
                        <p className="text-xs text-muted-foreground mb-4">
                            This permanently removes the order. There is no undo.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={remove}
                                disabled={submitting !== null}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-all disabled:opacity-50"
                            >
                                {submitting === "delete" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Yes, delete permanently
                            </button>
                            <button
                                type="button"
                                onClick={() => setDeleteConfirm(false)}
                                disabled={submitting !== null}
                                className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                            >
                                Keep order
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function CancelPanel({
    order,
    cancelReason,
    setCancelReason,
    cancelConfirm,
    setCancelConfirm,
    submitting,
    actionError,
    onCancel,
}: {
    order: OrderView
    cancelReason: string
    setCancelReason: (v: string) => void
    cancelConfirm: boolean
    setCancelConfirm: (v: boolean) => void
    submitting: "ship" | "deliver" | "refund" | "cancel" | "delete" | null
    actionError: string | null
    onCancel: () => void
}) {
    const alreadyCancelled = order.status === "cancelled"

    return (
        <div className="glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Ban className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h2 className="font-serif text-lg leading-tight">Cancel order</h2>
                    <p className="text-xs text-muted-foreground">
                        Use this when the customer doesn&apos;t confirm COD, refuses delivery, or the order can&apos;t be fulfilled.
                    </p>
                </div>
            </div>

            {alreadyCancelled ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-4 text-sm">
                    <div className="flex items-center gap-2 text-red-500 font-medium mb-1.5">
                        <XCircle className="w-4 h-4" />
                        Order cancelled
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                        {order.cancelled_at && <p>When: <span className="text-foreground">{formatTimestamp(order.cancelled_at)}</span></p>}
                        {order.cancellation_reason && <p className="italic">Reason: <span className="text-foreground not-italic">{order.cancellation_reason}</span></p>}
                    </div>
                </div>
            ) : (
                <>
                    <Field label="Reason for cancellation (recorded against the order)">
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            rows={2}
                            placeholder="e.g. Customer didn&apos;t confirm on call / refused delivery / out of stock"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-red-500/50 resize-none"
                        />
                    </Field>

                    {actionError && (
                        <div className="mt-3 flex items-start gap-2 text-xs text-destructive">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <p>{actionError}</p>
                        </div>
                    )}

                    {!cancelConfirm ? (
                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={() => setCancelConfirm(true)}
                                disabled={submitting !== null}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-red-500/40 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Ban className="w-4 h-4" />
                                Cancel this order…
                            </button>
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/[0.05] p-4">
                            <p className="text-sm font-medium mb-1">Confirm cancellation</p>
                            <p className="text-xs text-muted-foreground mb-3">
                                This will mark the order as <b>Cancelled</b> in your dashboard and on the
                                customer&apos;s /account page. It cannot be reopened.
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    disabled={submitting !== null}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting === "cancel" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                    Yes, cancel order
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setCancelConfirm(false)}
                                    disabled={submitting === "cancel"}
                                    className="px-4 py-2 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Keep order
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

function RefundPanel({
    order,
    refundAmount,
    setRefundAmount,
    refundReason,
    setRefundReason,
    refundInstant,
    setRefundInstant,
    refundConfirm,
    setRefundConfirm,
    submitting,
    actionError,
    onRefund,
}: {
    order: OrderView
    refundAmount: string
    setRefundAmount: (v: string) => void
    refundReason: string
    setRefundReason: (v: string) => void
    refundInstant: boolean
    setRefundInstant: (v: boolean) => void
    refundConfirm: boolean
    setRefundConfirm: (v: boolean) => void
    submitting: "ship" | "deliver" | "refund" | "cancel" | "delete" | null
    actionError: string | null
    onRefund: () => void
}) {
    const fullRupees = order.amount_paid / 100
    const alreadyRefunded = order.status === "refunded" || !!order.refund_id

    return (
        <div className="glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h2 className="font-serif text-lg leading-tight">Refund</h2>
                    <p className="text-xs text-muted-foreground">
                        Issue a Razorpay refund to the customer's original payment method.
                    </p>
                </div>
            </div>

            {alreadyRefunded ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 text-sm">
                    <div className="flex items-center gap-2 text-emerald-500 font-medium mb-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Refund processed
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <p>Amount: <span className="text-foreground">₹{((order.refund_amount || 0) / 100).toLocaleString("en-IN")}</span></p>
                        <p>Status: <span className="text-foreground">{order.refund_status || "—"}</span></p>
                        {order.refund_id && <p className="font-mono text-[11px] break-all sm:col-span-2">Refund ID: {order.refund_id}</p>}
                        {order.refunded_at && <p className="sm:col-span-2">When: {formatTimestamp(order.refunded_at)}</p>}
                        {order.refund_reason && <p className="sm:col-span-2 italic">Reason: {order.refund_reason}</p>}
                    </div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Field label={`Amount (₹) — leave blank for full ₹${fullRupees}`}>
                            <input
                                type="number"
                                inputMode="decimal"
                                min="1"
                                max={fullRupees}
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                placeholder={`${fullRupees}`}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-red-500/50"
                            />
                        </Field>
                        <label className="flex items-center gap-2 self-end pb-2 text-xs text-muted-foreground cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={refundInstant}
                                onChange={(e) => setRefundInstant(e.target.checked)}
                                className="accent-red-500"
                            />
                            Instant refund (if eligible — UPI/cards only)
                        </label>
                        <div className="md:col-span-2">
                            <Field label="Reason (visible internally, sent to Razorpay notes)">
                                <textarea
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    rows={2}
                                    placeholder="e.g. Customer requested cancellation"
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-red-500/50 resize-none"
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

                    {!refundConfirm ? (
                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={() => setRefundConfirm(true)}
                                disabled={submitting !== null}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-medium shadow-md shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Issue refund…
                            </button>
                        </div>
                    ) : (
                        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/[0.05] p-4">
                            <p className="text-sm font-medium mb-1">Confirm refund</p>
                            <p className="text-xs text-muted-foreground mb-3">
                                ₹{refundAmount.trim() ? Number(refundAmount).toLocaleString("en-IN") : fullRupees.toLocaleString("en-IN")} will be
                                refunded to the customer&apos;s original payment method via Razorpay
                                {refundInstant ? " (attempted instantly)" : " (5–7 business days)"}.
                                This cannot be undone.
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onRefund}
                                    disabled={submitting !== null}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting === "refund" ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                                    Yes, refund now
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRefundConfirm(false)}
                                    disabled={submitting === "refund"}
                                    className="px-4 py-2 rounded-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </>
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

function Badge({ tone, children }: { tone: "green" | "amber" | "blue" | "orange" | "emerald" | "red"; children: React.ReactNode }) {
    const cls = {
        green: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
        amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
        blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
        orange: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
        emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
        red: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    }[tone]
    return (
        <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full border ${cls}`}>
            {children}
        </span>
    )
}

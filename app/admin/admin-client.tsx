"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    ClipboardList,
    Filter,
    Loader2,
    LogOut,
    Mail,
    MapPin,
    MessageCircle,
    Package,
    PackageCheck,
    Phone,
    Search,
    Truck,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, ApiError } from "@/lib/api"

type AdminOrder = {
    razorpay_order_id: string
    receipt: string
    status: string
    fulfillment_status: string | null
    payment_method: string | null
    amount: number
    amount_paid: number
    currency: string
    product_name: string
    quantity: number
    customer_name: string
    customer_phone: string
    customer_email: string | null
    city: string | null
    pincode: string | null
    tracking_number: string | null
    courier: string | null
    created_at: string | null
    paid_at: string | null
    shipped_at: string | null
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
    paid: { label: "Paid", cls: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30" },
    created: { label: "Pending", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    awaiting_payment: { label: "Awaiting UPI", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30" },
    cod_pending: { label: "COD", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30" },
    refunded: { label: "Refunded", cls: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
    cancelled: { label: "Cancelled", cls: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
    failed: { label: "Failed", cls: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30" },
    expired: { label: "Expired", cls: "bg-gray-500/15 text-gray-500 dark:text-gray-400 border-gray-500/30" },
}

const FULFILLMENT_STYLES: Record<string, { label: string; cls: string; Icon: typeof Package }> = {
    pending: { label: "To ship", cls: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30", Icon: Package },
    shipped: { label: "Shipped", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30", Icon: Truck },
    delivered: { label: "Delivered", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30", Icon: PackageCheck },
}

function formatDate(value: string | null): string {
    if (!value) return ""
    if (/^\d+$/.test(value)) {
        const numeric = Number.parseInt(value, 10)
        if (numeric > 0) {
            const ms = numeric < 1e12 ? numeric * 1000 : numeric
            return new Date(ms).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        }
    }
    const d = new Date(value)
    if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
    }
    return value
}

type StatusFilter = "all" | "paid" | "created" | "awaiting_payment" | "cod_pending" | "refunded" | "cancelled" | "failed" | "expired"
type FulfillmentFilter = "all" | "pending" | "shipped" | "delivered"

export function AdminClient() {
    const router = useRouter()
    const { user, loading: authLoading, signOut: firebaseSignOut } = useAuth()
    const [orders, setOrders] = useState<AdminOrder[] | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("paid")
    const [fulfillmentFilter, setFulfillmentFilter] = useState<FulfillmentFilter>("all")
    const [search, setSearch] = useState("")

    const handleSignOut = async () => {
        await firebaseSignOut()
        router.replace("/admin/login")
    }

    useEffect(() => {
        if (authLoading) return
        if (!user) {
            // Treat unauthenticated /admin visits as if the route doesn't exist.
            notFound()
        }
        let cancelled = false
        setError(null)
        setOrders(null)
        ;(async () => {
            try {
                const qs = new URLSearchParams()
                if (statusFilter !== "all") qs.set("status", statusFilter)
                qs.set("limit", "200")
                const list = await apiFetch<AdminOrder[]>(`/admin/orders?${qs.toString()}`, { auth: true })
                if (!cancelled) setOrders(list)
            } catch (err) {
                if (cancelled) return
                if (err instanceof ApiError && err.status === 404) {
                    notFound()
                    return
                }
                const msg = err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Could not load orders."
                setError(msg)
            }
        })()
        return () => {
            cancelled = true
        }
    }, [user, authLoading, statusFilter])

    const filtered = useMemo(() => {
        if (!orders) return []
        const term = search.trim().toLowerCase()
        return orders.filter((o) => {
            if (fulfillmentFilter !== "all") {
                const fs = o.fulfillment_status || "pending"
                if (fs !== fulfillmentFilter) return false
            }
            if (term) {
                const hay = [
                    o.razorpay_order_id,
                    o.receipt,
                    o.customer_name,
                    o.customer_phone,
                    o.customer_email,
                    o.tracking_number,
                    o.city,
                    o.pincode,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase()
                if (!hay.includes(term)) return false
            }
            return true
        })
    }, [orders, fulfillmentFilter, search])

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

    const total = orders?.length || 0
    const counts = {
        toShip: orders?.filter((o) => o.status === "paid" && (o.fulfillment_status || "pending") === "pending").length || 0,
        shipped: orders?.filter((o) => o.fulfillment_status === "shipped").length || 0,
        delivered: orders?.filter((o) => o.fulfillment_status === "delivered").length || 0,
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total" value={total} Icon={ClipboardList} />
                <StatCard label="To ship" value={counts.toShip} Icon={Package} tone="orange" />
                <StatCard label="Shipped" value={counts.shipped} Icon={Truck} tone="blue" />
                <StatCard label="Delivered" value={counts.delivered} Icon={PackageCheck} tone="emerald" />
            </div>

            {/* Filters */}
            <div className="glass rounded-2xl p-4 flex flex-col lg:flex-row gap-3 lg:items-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Filter className="w-4 h-4" />
                    Filters:
                </div>
                <div className="flex flex-wrap gap-1.5">
                    <FilterChip active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>All status</FilterChip>
                    <FilterChip active={statusFilter === "paid"} onClick={() => setStatusFilter("paid")}>Paid</FilterChip>
                    <FilterChip active={statusFilter === "cod_pending"} onClick={() => setStatusFilter("cod_pending")}>COD</FilterChip>
                    <FilterChip active={statusFilter === "created"} onClick={() => setStatusFilter("created")}>Pending</FilterChip>
                    <FilterChip active={statusFilter === "refunded"} onClick={() => setStatusFilter("refunded")}>Refunded</FilterChip>
                    <FilterChip active={statusFilter === "cancelled"} onClick={() => setStatusFilter("cancelled")}>Cancelled</FilterChip>
                    <FilterChip active={statusFilter === "failed"} onClick={() => setStatusFilter("failed")}>Failed</FilterChip>
                    <FilterChip active={statusFilter === "expired"} onClick={() => setStatusFilter("expired")}>Expired</FilterChip>
                </div>
                <div className="hidden lg:block w-px h-6 bg-white/10" />
                <div className="flex flex-wrap gap-1.5">
                    <FilterChip active={fulfillmentFilter === "all"} onClick={() => setFulfillmentFilter("all")}>All fulfillment</FilterChip>
                    <FilterChip active={fulfillmentFilter === "pending"} onClick={() => setFulfillmentFilter("pending")}>To ship</FilterChip>
                    <FilterChip active={fulfillmentFilter === "shipped"} onClick={() => setFulfillmentFilter("shipped")}>Shipped</FilterChip>
                    <FilterChip active={fulfillmentFilter === "delivered"} onClick={() => setFulfillmentFilter("delivered")}>Delivered</FilterChip>
                </div>
                <div className="lg:ml-auto relative w-full lg:w-auto lg:min-w-[260px]">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search ID, name, phone, tracking…"
                        className="w-full pl-9 pr-3 py-2 rounded-full bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-colors"
                    />
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="glass rounded-3xl p-10 text-center text-muted-foreground">
                    <ClipboardList className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm">No orders match these filters.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => (
                        <OrderRow key={order.razorpay_order_id} order={order} />
                    ))}
                </div>
            )}
        </div>
    )
}

function StatCard({
    label,
    value,
    Icon,
    tone,
}: {
    label: string
    value: number
    Icon: typeof Package
    tone?: "orange" | "blue" | "emerald"
}) {
    const toneCls =
        tone === "orange"
            ? "text-orange-500"
            : tone === "blue"
              ? "text-blue-500"
              : tone === "emerald"
                ? "text-emerald-500"
                : "text-primary"
    return (
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${toneCls}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-serif leading-none mt-0.5">{value}</p>
            </div>
        </div>
    )
}

function FilterChip({
    active,
    onClick,
    children,
}: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            }`}
        >
            {children}
        </button>
    )
}

function OrderRow({ order }: { order: AdminOrder }) {
    const status = STATUS_STYLES[order.status] || STATUS_STYLES.created
    const isFulfillable = order.status === "paid" || order.status === "cod_pending"
    const ffKey = isFulfillable ? order.fulfillment_status || "pending" : null
    const fulfillment = ffKey ? FULFILLMENT_STYLES[ffKey] : null
    const FfIcon = fulfillment?.Icon
    const amountRupees = (order.status === "paid" ? order.amount_paid : order.amount) / 100

    return (
        <div className="glass rounded-2xl p-4 md:p-5 hover:bg-white/[0.07] transition-colors">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${status.cls}`}>
                            {status.label}
                        </span>
                        {fulfillment && FfIcon && (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${fulfillment.cls}`}>
                                <FfIcon className="w-3 h-3" />
                                {fulfillment.label}
                            </span>
                        )}
                        {(order.paid_at || order.created_at) && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {formatDate(order.paid_at || order.created_at)}
                            </span>
                        )}
                    </div>
                    <p className="font-serif text-base leading-tight">
                        {order.product_name} <span className="text-muted-foreground">× {order.quantity}</span>
                    </p>
                    <p className="text-[11px] font-mono text-muted-foreground mt-1 truncate">{order.razorpay_order_id}</p>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
                            <span className="text-foreground/90 truncate">{order.customer_name || "—"}</span>
                        </div>
                        <a
                            href={`tel:${order.customer_phone}`}
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-primary"
                        >
                            <Phone className="w-3 h-3 shrink-0" />
                            {order.customer_phone}
                        </a>
                        {order.customer_email && (
                            <a
                                href={`mailto:${order.customer_email}`}
                                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary min-w-0"
                            >
                                <Mail className="w-3 h-3 shrink-0" />
                                <span className="truncate">{order.customer_email}</span>
                            </a>
                        )}
                        {(order.city || order.pincode) && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="w-3 h-3 shrink-0" />
                                {[order.city, order.pincode].filter(Boolean).join(" · ")}
                            </span>
                        )}
                        {order.tracking_number && (
                            <span className="flex items-center gap-1.5 text-blue-500 font-medium">
                                <Truck className="w-3 h-3 shrink-0" />
                                {order.courier ? `${order.courier} · ` : ""}{order.tracking_number}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-3 lg:flex-col lg:items-end">
                    <p className="text-xl font-serif text-primary">₹{amountRupees.toLocaleString("en-IN")}</p>
                    <div className="flex items-center gap-2">
                        {order.customer_phone && (
                            <a
                                href={`https://wa.me/${order.customer_phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                                    `Namaste ${order.customer_name || ""}, your Divya Darshan 360 order ${order.razorpay_order_id} update:`,
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500 hover:text-white transition-all"
                            >
                                <MessageCircle className="w-3.5 h-3.5" />
                                WhatsApp
                            </a>
                        )}
                        <Link
                            href={`/admin/orders/${encodeURIComponent(order.razorpay_order_id)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                            Manage
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShoppingBag,
    User,
    MapPin,
    CreditCard,
    Phone,
    Mail,
    Minus,
    Plus,
    ShieldCheck,
    Truck,
    PartyPopper,
    Copy,
    Check,
    MessageCircle,
    Loader2,
    AlertCircle,
    LogOut,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAuth } from "@/components/auth-provider"
import { PhoneOtpForm } from "@/components/phone-otp-form"
import { apiFetch, ApiError } from "@/lib/api"

const PRODUCT_SKU = "mobile-vr-box"
const UNIT_PRICE = 599
const ORIGINAL_PRICE = 999
const MERCHANT_PHONE = "919049921850"
const MERCHANT_EMAIL = "connect@youtellme.ai"
const MERCHANT_CC = "sairaj@tellmedigi.com"

type PaymentMethod = "razorpay" | "cod_whatsapp"

type Form = {
    fullName: string
    phone: string
    email: string
    address: string
    city: string
    state: string
    pincode: string
    qty: number
    payment: PaymentMethod
    notes: string
}

const initialForm: Form = {
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    qty: 1,
    payment: "razorpay",
    notes: "",
}

type Errors = Partial<Record<keyof Form, string>>

type Submitted = {
    orderId: string
    method: PaymentMethod
    paymentId?: string
}

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => {
            open: () => void
            on: (event: string, handler: (resp: unknown) => void) => void
        }
    }
}

function validate(form: Form): Errors {
    const errors: Errors = {}
    if (!form.fullName.trim()) errors.fullName = "Please enter your full name"
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, "")))
        errors.phone = "Enter a valid 10-digit Indian mobile number"
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        errors.email = "Enter a valid email address"
    if (!form.address.trim() || form.address.trim().length < 8)
        errors.address = "Please enter your full address"
    if (!form.city.trim()) errors.city = "City is required"
    if (!form.state.trim()) errors.state = "State is required"
    if (!/^\d{6}$/.test(form.pincode.trim()))
        errors.pincode = "Enter a valid 6-digit pincode"
    return errors
}

function generateCodOrderId() {
    const stamp = Date.now().toString(36).toUpperCase().slice(-6)
    const rand = Math.floor(Math.random() * 999)
        .toString(36)
        .toUpperCase()
        .padStart(2, "0")
    return `DD360-${stamp}${rand}`
}

export function CheckoutClient() {
    const { user, loading: authLoading, configError, customer, signOut } = useAuth()
    const [form, setForm] = useState<Form>(initialForm)
    const [errors, setErrors] = useState<Errors>({})
    const [submitted, setSubmitted] = useState<Submitted | null>(null)
    const [copied, setCopied] = useState(false)
    const [busy, setBusy] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return
        setForm((f) => {
            const patch: Partial<Form> = {}
            const phoneDigits =
                user.phoneNumber?.replace(/^\+91/, "").replace(/\D/g, "") || ""
            if (!f.phone && phoneDigits.length === 10) patch.phone = phoneDigits
            if (!f.fullName && customer?.full_name) patch.fullName = customer.full_name
            if (!f.email && customer?.email) patch.email = customer.email
            const addr = customer?.last_shipping_address
            if (addr) {
                if (!f.address && addr.line1) patch.address = addr.line1
                if (!f.city && addr.city) patch.city = addr.city
                if (!f.state && addr.state) patch.state = addr.state
                if (!f.pincode && addr.pincode) patch.pincode = addr.pincode
            }
            return Object.keys(patch).length ? { ...f, ...patch } : f
        })
    }, [user, customer])

    const subtotal = UNIT_PRICE * form.qty
    const youSave = (ORIGINAL_PRICE - UNIT_PRICE) * form.qty
    const total = subtotal

    const update = <K extends keyof Form>(key: K, value: Form[K]) => {
        setForm((f) => ({ ...f, [key]: value }))
        setErrors((e) => ({ ...e, [key]: undefined }))
        setServerError(null)
    }

    const buildOrderText = (orderId: string) => {
        const lines = [
            `🪔 *New Mobile VR Box Order*`,
            `Order ID: ${orderId}`,
            ``,
            `*Customer*`,
            `Name: ${form.fullName}`,
            `Phone: ${form.phone}`,
            ...(form.email ? [`Email: ${form.email}`] : []),
            ``,
            `*Shipping Address*`,
            form.address,
            `${form.city}, ${form.state} - ${form.pincode}`,
            ``,
            `*Order*`,
            `Mobile VR Box × ${form.qty}`,
            `Subtotal: ₹${subtotal}`,
            `Shipping: Free`,
            `Total: ₹${total}`,
            ``,
            `*Payment*`,
            "Cash on Delivery",
            ...(form.notes.trim() ? [``, `*Notes*`, form.notes.trim()] : []),
        ]
        return lines.join("\n")
    }

    const placeCodOrder = () => {
        const orderId = generateCodOrderId()
        const waUrl = `https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(buildOrderText(orderId))}`
        window.open(waUrl, "_blank", "noopener,noreferrer")
        setSubmitted({ orderId, method: "cod_whatsapp" })
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const placeRazorpayOrder = async () => {
        if (!window.Razorpay) {
            setServerError(
                "Payment library is still loading. Please wait a moment and try again."
            )
            return
        }
        setBusy(true)
        setServerError(null)
        try {
            const order = await apiFetch<{
                razorpay_order_id: string
                razorpay_key_id: string
                amount: number
                currency: string
                receipt: string
                product_name: string
            }>("/orders/create_order", {
                method: "POST",
                auth: true,
                body: {
                    item: { sku: PRODUCT_SKU, quantity: form.qty },
                    customer: {
                        full_name: form.fullName,
                        phone: form.phone,
                        email: form.email || null,
                    },
                    shipping_address: {
                        line1: form.address,
                        city: form.city,
                        state: form.state,
                        pincode: form.pincode,
                        country: "IN",
                        notes: form.notes,
                    },
                },
            })

            const rzp = new window.Razorpay({
                key: order.razorpay_key_id,
                amount: order.amount,
                currency: order.currency,
                order_id: order.razorpay_order_id,
                name: "Divya Darshan 360",
                description: order.product_name,
                prefill: {
                    name: form.fullName,
                    email: form.email || undefined,
                    contact: form.phone,
                },
                notes: { receipt: order.receipt },
                theme: { color: "#d4af37" },
                modal: {
                    ondismiss: () => {
                        setBusy(false)
                    },
                },
                handler: async (resp: {
                    razorpay_order_id: string
                    razorpay_payment_id: string
                    razorpay_signature: string
                }) => {
                    try {
                        await apiFetch("/orders/verify_payment", {
                            method: "POST",
                            auth: true,
                            body: resp,
                        })
                        setSubmitted({
                            orderId: resp.razorpay_order_id,
                            method: "razorpay",
                            paymentId: resp.razorpay_payment_id,
                        })
                        if (typeof window !== "undefined") {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                    } catch (err) {
                        const message =
                            err instanceof ApiError
                                ? err.message
                                : err instanceof Error
                                  ? err.message
                                  : "We could not verify the payment. Please contact support."
                        setServerError(message)
                    } finally {
                        setBusy(false)
                    }
                },
            })

            rzp.on("payment.failed", (resp: unknown) => {
                const r = resp as { error?: { description?: string } }
                setServerError(
                    r?.error?.description || "Payment failed. Please try again."
                )
                setBusy(false)
            })

            rzp.open()
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Something went wrong while creating the order."
            setServerError(message)
            setBusy(false)
        }
    }

    const placeOrder = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors = validate(form)
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            const firstField = Object.keys(newErrors)[0]
            const el = document.querySelector<HTMLInputElement>(`[name="${firstField}"]`)
            el?.focus()
            return
        }

        if (form.payment === "razorpay") {
            placeRazorpayOrder()
        } else {
            placeCodOrder()
        }
    }

    const copyOrderId = async () => {
        if (!submitted) return
        try {
            await navigator.clipboard.writeText(submitted.orderId)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // ignore
        }
    }

    const mailtoFallback = useMemo(() => {
        if (!submitted) return ""
        const orderText =
            submitted.method === "cod_whatsapp"
                ? buildOrderText(submitted.orderId)
                : `Online order confirmed.\nOrder ID: ${submitted.orderId}${submitted.paymentId ? `\nPayment ID: ${submitted.paymentId}` : ""}`
        return `mailto:${MERCHANT_EMAIL}?cc=${MERCHANT_CC}&subject=${encodeURIComponent(
            `Order ${submitted.orderId} — Mobile VR Box`
        )}&body=${encodeURIComponent(orderText)}`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitted])

    if (configError) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="flex items-start gap-3 glass rounded-2xl p-5 border border-destructive/40">
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-destructive mb-1">Sign-in is not available</p>
                        <p className="text-muted-foreground">
                            {configError} Set <code className="font-mono">NEXT_PUBLIC_FIREBASE_*</code> in
                            <code className="font-mono"> .env.local</code> and restart the dev server.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (authLoading) {
        return (
            <div className="max-w-md mx-auto text-center text-muted-foreground py-16">
                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
            </div>
        )
    }

    if (!user) {
        return (
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <p className="text-sm text-muted-foreground">
                        Please sign in with your mobile number to place an order.
                    </p>
                </div>
                <PhoneOtpForm
                    title="Sign in to continue checkout"
                    description="We'll send a 6-digit OTP to your phone. Your past orders stay linked to your number."
                />
            </div>
        )
    }

    if (submitted) {
        const isOnline = submitted.method === "razorpay"
        return (
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative glass rounded-[3rem] p-10 md:p-16 ornate-border overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 animate-pulse-slow" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[120px] translate-y-1/2 animate-pulse-slow" />

                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border border-primary/30 mb-8">
                            <PartyPopper className="w-10 h-10 text-primary" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-serif mb-5 leading-tight">
                            {isOnline ? "Payment received" : "Your order has been placed"}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
                            {isOnline
                                ? "Your payment was successful. We'll arrange delivery and reach out shortly with shipment details."
                                : "We've opened WhatsApp with your order details. Please send the message so our team can confirm your order. We'll reach out shortly to arrange delivery."}
                        </p>

                        <div className="inline-flex items-center gap-3 glass rounded-full px-5 py-3 mb-10">
                            <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Order ID</span>
                            <span className="font-mono font-medium text-primary">{submitted.orderId}</span>
                            <button
                                type="button"
                                onClick={copyOrderId}
                                className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
                                aria-label="Copy order ID"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-primary" />
                                ) : (
                                    <Copy className="w-4 h-4 text-muted-foreground" />
                                )}
                            </button>
                        </div>

                        {submitted.paymentId && (
                            <p className="text-xs text-muted-foreground mb-8">
                                Payment ID: <span className="font-mono">{submitted.paymentId}</span>
                            </p>
                        )}

                        {!isOnline && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <a
                                    href={`https://wa.me/${MERCHANT_PHONE}?text=${encodeURIComponent(buildOrderText(submitted.orderId))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 divine-button rounded-full px-8 py-4 shadow-(--saffron-glow)"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    <span className="font-serif tracking-wide">Send via WhatsApp</span>
                                </a>
                                <a
                                    href={mailtoFallback}
                                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                >
                                    <Mail className="w-5 h-5" />
                                    <span className="font-serif tracking-wide">Send via Email</span>
                                </a>
                            </div>
                        )}

                        <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-primary" /> Ships within 24 hours
                            </span>
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" /> 7-day replacement
                            </span>
                        </div>

                        <div className="mt-10">
                            <Link
                                href="/vr-headset"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                ← Continue exploring
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <form onSubmit={placeOrder} className="max-w-6xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-8" noValidate>
            {/* LEFT — form sections */}
            <div className="space-y-6">
                {/* Contact */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="glass rounded-3xl p-6 md:p-8 ornate-border"
                >
                    <div className="flex items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-serif">Contact details</h2>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                void signOut()
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                            title={user.phoneNumber || "Signed in"}
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">
                                {user.phoneNumber ? `Signed in · ${user.phoneNumber}` : "Sign out"}
                            </span>
                            <span className="sm:hidden">Sign out</span>
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <Label htmlFor="fullName" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Full name *
                            </Label>
                            <Input
                                id="fullName"
                                name="fullName"
                                value={form.fullName}
                                onChange={(e) => update("fullName", e.target.value)}
                                placeholder="e.g. Sushila Devi"
                                aria-invalid={!!errors.fullName}
                                className="h-12 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                            />
                            {errors.fullName && (
                                <p className="text-xs text-destructive mt-1.5">{errors.fullName}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Phone (WhatsApp) *
                            </Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    inputMode="numeric"
                                    value={form.phone}
                                    onChange={(e) => update("phone", e.target.value)}
                                    placeholder="10-digit mobile number"
                                    aria-invalid={!!errors.phone}
                                    className="h-12 pl-10 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs text-destructive mt-1.5">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Email <span className="text-muted-foreground/60 normal-case">(optional)</span>
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    placeholder="you@example.com"
                                    aria-invalid={!!errors.email}
                                    className="h-12 pl-10 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-destructive mt-1.5">{errors.email}</p>
                            )}
                        </div>
                    </div>
                </motion.section>

                {/* Shipping */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="glass rounded-3xl p-6 md:p-8 ornate-border"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif">Shipping address</h2>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                            <Label htmlFor="address" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Address *
                            </Label>
                            <Textarea
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={(e) => update("address", e.target.value)}
                                placeholder="House no., street, area, landmark"
                                rows={3}
                                aria-invalid={!!errors.address}
                                className="rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                            />
                            {errors.address && (
                                <p className="text-xs text-destructive mt-1.5">{errors.address}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="city" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                City *
                            </Label>
                            <Input
                                id="city"
                                name="city"
                                value={form.city}
                                onChange={(e) => update("city", e.target.value)}
                                placeholder="e.g. Pune"
                                aria-invalid={!!errors.city}
                                className="h-12 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                            />
                            {errors.city && (
                                <p className="text-xs text-destructive mt-1.5">{errors.city}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="state" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                State *
                            </Label>
                            <Input
                                id="state"
                                name="state"
                                value={form.state}
                                onChange={(e) => update("state", e.target.value)}
                                placeholder="e.g. Maharashtra"
                                aria-invalid={!!errors.state}
                                className="h-12 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                            />
                            {errors.state && (
                                <p className="text-xs text-destructive mt-1.5">{errors.state}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="pincode" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Pincode *
                            </Label>
                            <Input
                                id="pincode"
                                name="pincode"
                                inputMode="numeric"
                                maxLength={6}
                                value={form.pincode}
                                onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
                                placeholder="6-digit pincode"
                                aria-invalid={!!errors.pincode}
                                className="h-12 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                            />
                            {errors.pincode && (
                                <p className="text-xs text-destructive mt-1.5">{errors.pincode}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="notes" className="mb-2 inline-block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Notes <span className="text-muted-foreground/60 normal-case">(optional)</span>
                            </Label>
                            <Input
                                id="notes"
                                name="notes"
                                value={form.notes}
                                onChange={(e) => update("notes", e.target.value)}
                                placeholder="Anything we should know"
                                className="h-12 rounded-xl bg-white/60 border-primary/20 focus-visible:ring-primary/30"
                            />
                        </div>
                    </div>
                </motion.section>

                {/* Payment */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="glass rounded-3xl p-6 md:p-8 ornate-border"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-serif">Payment method</h2>
                    </div>

                    <RadioGroup
                        value={form.payment}
                        onValueChange={(v) => update("payment", v as PaymentMethod)}
                        className="grid sm:grid-cols-2 gap-4"
                    >
                        <Label
                            htmlFor="pay-razorpay"
                            className={`cursor-pointer rounded-2xl border p-5 transition-all ${form.payment === "razorpay"
                                ? "border-primary/60 bg-primary/10 shadow-md shadow-primary/10"
                                : "border-primary/15 bg-white/40 hover:border-primary/40"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <RadioGroupItem value="razorpay" id="pay-razorpay" className="mt-1" />
                                <div>
                                    <p className="font-serif text-base">Pay online (Razorpay)</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        UPI, cards, netbanking, wallets. Secure payment via Razorpay.
                                    </p>
                                </div>
                            </div>
                        </Label>

                        <Label
                            htmlFor="pay-cod"
                            className={`cursor-pointer rounded-2xl border p-5 transition-all ${form.payment === "cod_whatsapp"
                                ? "border-primary/60 bg-primary/10 shadow-md shadow-primary/10"
                                : "border-primary/15 bg-white/40 hover:border-primary/40"
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <RadioGroupItem value="cod_whatsapp" id="pay-cod" className="mt-1" />
                                <div>
                                    <p className="font-serif text-base">Cash on Delivery</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Order confirmation via WhatsApp. Pay ₹{total} in cash when your headset arrives.
                                    </p>
                                </div>
                            </div>
                        </Label>
                    </RadioGroup>
                </motion.section>

                {serverError && (
                    <div className="flex items-start gap-3 glass rounded-2xl p-4 border border-destructive/40">
                        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{serverError}</p>
                    </div>
                )}
            </div>

            {/* RIGHT — order summary */}
            <aside className="lg:sticky lg:top-8 self-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-[2.5rem] p-1 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/20 shadow-2xl shadow-primary/20"
                >
                    <div className="glass rounded-[2.3rem] p-6 md:p-7 ornate-border">
                        <h2 className="text-xl font-serif mb-5">Your order</h2>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15 flex items-center justify-center">
                                <img
                                    src="/vr_set1.png"
                                    alt="Mobile VR Box"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-serif text-base truncate">Mobile VR Box</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Universal · Cardboard-style
                                </p>
                                <p className="text-sm text-primary font-medium mt-1">
                                    ₹{UNIT_PRICE}{" "}
                                    <span className="text-muted-foreground line-through text-xs ml-1">
                                        ₹{ORIGINAL_PRICE}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Qty</span>
                            <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white/60 backdrop-blur-md p-1">
                                <button
                                    type="button"
                                    onClick={() => update("qty", Math.max(1, form.qty - 1))}
                                    aria-label="Decrease quantity"
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 text-foreground transition-colors disabled:opacity-40"
                                    disabled={form.qty <= 1}
                                >
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center font-serif text-base">{form.qty}</span>
                                <button
                                    type="button"
                                    onClick={() => update("qty", Math.min(10, form.qty + 1))}
                                    aria-label="Increase quantity"
                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 text-foreground transition-colors disabled:opacity-40"
                                    disabled={form.qty >= 10}
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-5 space-y-3 text-sm">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-primary font-medium">Free</span>
                            </div>
                            <AnimatePresence initial={false}>
                                {youSave > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex justify-between text-primary"
                                    >
                                        <span>You save</span>
                                        <span>−₹{youSave}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div className="border-t border-white/10 pt-4 flex justify-between items-baseline">
                                <span className="text-base font-serif">Total</span>
                                <span className="text-2xl font-serif text-primary">₹{total}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">Inclusive of all taxes</p>
                        </div>

                        <button
                            type="submit"
                            disabled={busy}
                            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full divine-button shadow-(--saffron-glow) text-base disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {busy ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="font-serif tracking-wide">Processing…</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="w-4 h-4" />
                                    <span className="font-serif tracking-wide">
                                        {form.payment === "razorpay" ? `Pay ₹${total}` : `Place Order · ₹${total}`}
                                    </span>
                                </>
                            )}
                        </button>

                        <div className="mt-5 flex flex-col gap-2.5 text-xs text-muted-foreground">
                            <span className="flex items-center gap-2">
                                <Truck className="w-3.5 h-3.5 text-primary" /> Ships within 24 hours · Free in India
                            </span>
                            <span className="flex items-center gap-2">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 7-day replacement guarantee
                            </span>
                            <span className="flex items-center gap-2">
                                <MessageCircle className="w-3.5 h-3.5 text-primary" />
                                {form.payment === "razorpay"
                                    ? "Payment is secured by Razorpay"
                                    : "Order is confirmed via WhatsApp"}
                            </span>
                        </div>
                    </div>
                </motion.div>
            </aside>
        </form>
    )
}

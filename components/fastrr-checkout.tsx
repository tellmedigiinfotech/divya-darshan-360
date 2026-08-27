"use client"

import { useState } from "react"
import Script from "next/script"
import { Loader2, ShoppingBag, Minus, Plus, ShieldCheck, Truck, BadgeIndianRupee } from "lucide-react"
import { apiFetch, ApiError } from "@/lib/api"

// Online price (COD adds a handling fee inside Fastrr's checkout).
const UNIT_PRICE = 699
const ORIGINAL_PRICE = 2999
const SELLER_DOMAIN = "divyadarshan360.com"

declare global {
    interface Window {
        HeadlessCheckout?: {
            addToCart: (event: unknown, token: string, opts?: { fallbackUrl?: string }) => void
        }
    }
}

export function FastrrCheckout() {
    const [qty, setQty] = useState(1)
    const [busy, setBusy] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [scriptReady, setScriptReady] = useState(false)

    const subtotal = UNIT_PRICE * qty
    const youSave = (ORIGINAL_PRICE - UNIT_PRICE) * qty

    const launch = async (e: React.MouseEvent) => {
        setError(null)
        if (typeof window === "undefined" || !window.HeadlessCheckout) {
            setError("Checkout is still loading — please try again in a moment.")
            return
        }
        setBusy(true)
        try {
            const res = await apiFetch<{ token: string; order_id?: string }>(
                "/fastrr/checkout-token",
                { method: "POST", body: { quantity: qty } }
            )
            if (!res.token) throw new Error("Could not start checkout.")
            // Remember the Fastrr order id so the success page can fire the conversion.
            try {
                if (res.order_id) sessionStorage.setItem("fastrr_pending_order", res.order_id)
            } catch {
                // sessionStorage may be unavailable; the success page falls back to URL params.
            }
            window.HeadlessCheckout.addToCart(e.nativeEvent, res.token, {
                fallbackUrl: `https://${SELLER_DOMAIN}/vr-headset`,
            })
        } catch (err) {
            setError(
                err instanceof ApiError
                    ? err.message
                    : err instanceof Error
                      ? err.message
                      : "Could not start checkout. Please try again."
            )
        } finally {
            setBusy(false)
        }
    }

    return (
        <div className="max-w-md mx-auto">
            {/* Fastrr checkout assets */}
            <link rel="stylesheet" href="https://checkout-ui.shiprocket.com/assets/styles/shopify.css" />
            <input type="hidden" value={SELLER_DOMAIN} id="sellerDomain" readOnly />
            <Script
                src="https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js"
                strategy="afterInteractive"
                onLoad={() => setScriptReady(true)}
            />

            <div className="relative rounded-[2.5rem] p-1 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/20 shadow-2xl shadow-primary/20">
                <div className="glass rounded-[2.3rem] p-6 md:p-8 ornate-border">
                    {/* Product */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/15">
                            <img src="/vr_set1.png" alt="Mobile VR Box" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-serif text-lg truncate">Mobile VR Box</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Universal · Cardboard-style</p>
                            <p className="text-sm text-primary font-medium mt-1">
                                ₹{UNIT_PRICE}{" "}
                                <span className="text-muted-foreground line-through text-xs ml-1">₹{ORIGINAL_PRICE}</span>
                            </p>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Qty</span>
                        <div className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-white/60 backdrop-blur-md p-1">
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.max(1, q - 1))}
                                disabled={qty <= 1}
                                aria-label="Decrease quantity"
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                            >
                                <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center font-serif text-base">{qty}</span>
                            <button
                                type="button"
                                onClick={() => setQty((q) => Math.min(10, q + 1))}
                                disabled={qty >= 10}
                                aria-label="Increase quantity"
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/10 transition-colors disabled:opacity-40"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-5 space-y-3 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                            <span>Subtotal ({qty})</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <span>Shipping</span>
                            <span className="text-primary font-medium">Free</span>
                        </div>
                        {youSave > 0 && (
                            <div className="flex justify-between text-primary">
                                <span>You save</span>
                                <span>−₹{youSave}</span>
                            </div>
                        )}
                    </div>

                    {/* Prepaid nudge */}
                    <div className="mt-5 flex items-start gap-2.5 rounded-2xl border border-green-500/30 bg-green-500/[0.08] px-4 py-3">
                        <BadgeIndianRupee className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-green-800 dark:text-green-300">
                            Pay online to save the Cash-on-Delivery handling fee. Final total is shown in secure checkout.
                        </p>
                    </div>

                    {error && <p className="text-sm text-destructive mt-4">{error}</p>}

                    {/* Launch */}
                    <button
                        id="buyNow"
                        type="button"
                        onClick={launch}
                        disabled={busy || !scriptReady}
                        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full divine-button shadow-(--saffron-glow) text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {busy ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="font-serif tracking-wide">Starting…</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-4 h-4" />
                                <span className="font-serif tracking-wide">
                                    {scriptReady ? "Proceed to secure checkout" : "Loading checkout…"}
                                </span>
                            </>
                        )}
                    </button>

                    <div className="mt-5 flex flex-col gap-2.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 text-primary" /> Ships in 2–3 business days · Free in India
                        </span>
                        <span className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> 7-day replacement · UPI, cards & COD
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Google Ads conversion tracking.
//
// Get these two values from your Google Ads account:
//   Tools → Conversions → (your "Purchase" conversion action) → Tag setup.
//   - AW_CONVERSION_ID:    "AW-XXXXXXXXXX"
//   - AW_PURCHASE_LABEL:   the label shown next to send_to, e.g. "AbC-D_efG-h12_3-45"
//
// The Google Ads global tag is loaded in app/layout.tsx alongside GA4.

export const AW_CONVERSION_ID = "AW-10933884289"
// Label from the "VR Headset Purchase" conversion action in the AW-10933884289 account.
export const AW_PURCHASE_LABEL = "AiigCITIzsccEIGr190o"

type GtagFn = (...args: unknown[]) => void

declare global {
    interface Window {
        gtag?: GtagFn
        dataLayer?: unknown[]
    }
}

/**
 * Fire a Google Ads purchase conversion exactly once per order.
 *
 * Call this only when the backend has confirmed the order is paid.
 * Uses sessionStorage keyed by orderId so a page refresh / re-mount on the
 * "Payment received" screen does not report the same sale twice.
 */
export function trackPurchaseConversion(params: {
    orderId: string
    /** Order reference — used as the conversion transaction_id for dedupe. */
    transactionId: string
    /** Order value in major units (e.g. rupees, not paise). */
    value: number
    currency?: string
}) {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return

    const guardKey = `aw_conv_fired_${params.orderId}`
    try {
        if (sessionStorage.getItem(guardKey)) return
        sessionStorage.setItem(guardKey, "1")
    } catch {
        // sessionStorage unavailable (private mode etc.) — fall through and fire anyway.
    }

    window.gtag("event", "conversion", {
        send_to: `${AW_CONVERSION_ID}/${AW_PURCHASE_LABEL}`,
        value: params.value,
        currency: params.currency ?? "INR",
        transaction_id: params.transactionId,
    })
}

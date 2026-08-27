import type { Metadata } from "next"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { siteUrl } from "@/lib/seo-config"
import { BackgroundLotus } from "@/components/background-lotus"
import { SuccessClient } from "./success-client"

export const metadata: Metadata = {
    title: "Order Confirmed | Divya Darshan 360",
    description: "Your Mobile VR Box order is confirmed.",
    alternates: { canonical: `${siteUrl}/vr-headset/checkout/success` },
    robots: { index: false, follow: false },
}

export default function CheckoutSuccessPage() {
    return (
        <main className="min-h-screen relative overflow-hidden selection:bg-primary/30 pt-16 px-6">
            <BackgroundLotus className="top-[5%] right-[-15%]" size={500} opacity={0.12} duration={200} />
            <BackgroundLotus className="bottom-[5%] left-[-10%]" size={400} opacity={0.1} duration={240} delay={10} />

            <Suspense
                fallback={
                    <div className="max-w-md mx-auto text-center text-muted-foreground py-16">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </div>
                }
            >
                <SuccessClient />
            </Suspense>
        </main>
    )
}

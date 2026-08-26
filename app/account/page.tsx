import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { siteUrl } from "@/lib/seo-config"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"
import { AccountClient } from "./account-client"

const pageUrl = `${siteUrl}/account`

export const metadata: Metadata = {
    title: "My Account | Divya Darshan 360",
    description: "View your orders and download receipts.",
    alternates: { canonical: pageUrl },
    robots: { index: false, follow: false },
}

export default function AccountPage() {
    return (
        <main className="min-h-screen relative overflow-hidden selection:bg-primary/30">
            <FloatingDiya className="absolute top-[10%] left-[5%] scale-110 hidden md:block" />
            <FloatingDiya className="absolute bottom-[12%] right-[8%] scale-90 hidden md:block" />
            <BackgroundLotus className="top-[5%] right-[-15%]" size={500} opacity={0.1} duration={220} />
            <BackgroundLotus className="bottom-[5%] left-[-10%]" size={400} opacity={0.08} duration={260} delay={8} />

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 py-2 text-muted-foreground hover:text-secondary-600 transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </div>

            <section className="relative pt-8 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center mb-10">
                    <span className="text-secondary-600 tracking-[0.3em] uppercase text-sm mb-3 block">My Account</span>
                    <h1 className="text-[1.75rem] md:text-[2.5rem] font-serif tracking-tighter">Your orders</h1>
                </div>
                <AccountClient />
            </section>
        </main>
    )
}

import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { siteUrl } from "@/lib/seo-config"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"
import { LoginClient } from "./login-client"

const pageUrl = `${siteUrl}/login`

export const metadata: Metadata = {
    title: "Sign in | Divya Darshan 360",
    description: "Sign in with your phone number to manage orders and continue your spiritual journey.",
    alternates: { canonical: pageUrl },
    robots: {
        index: false,
        follow: true,
    },
    openGraph: {
        type: "website",
        url: pageUrl,
        siteName: "Divya Darshan 360",
        title: "Sign in | Divya Darshan 360",
        description: "Phone OTP sign-in for Divya Darshan 360.",
    },
}

export default function LoginPage() {
    return (
        <main className="min-h-screen relative overflow-hidden selection:bg-primary/30">
            <FloatingDiya className="absolute top-[12%] left-[6%] scale-110 hidden md:block" />
            <FloatingDiya className="absolute bottom-[14%] right-[8%] scale-90 hidden md:block" />

            <BackgroundLotus className="top-[5%] right-[-15%]" size={500} opacity={0.12} duration={200} />
            <BackgroundLotus className="bottom-[5%] left-[-10%]" size={400} opacity={0.1} duration={240} delay={10} />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-15">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary blur-[120px] animate-glow" />
                <div className="absolute bottom-40 right-10 w-80 h-80 bg-accent blur-[100px] animate-glow" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </div>

            <section className="relative pt-10 pb-16 md:pb-24 px-6">
                <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">
                        Sign in
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif tracking-tighter leading-tight">
                        Welcome to <span className="text-primary italic">Divya Darshan 360</span>
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mt-4">
                        Sign in with your phone number to place orders, view your purchase history, and continue your spiritual journey.
                    </p>
                </div>

                <LoginClient />
            </section>
        </main>
    )
}

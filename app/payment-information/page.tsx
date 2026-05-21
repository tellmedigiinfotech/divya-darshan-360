import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Wallet } from "lucide-react"
import { siteUrl } from "@/lib/seo-config"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"

const pageUrl = `${siteUrl}/payment-information`

export const metadata: Metadata = {
    title: "Payment Information | Divya Darshan 360",
    description:
        "Beneficiary, bank account, IFSC, and UPI details for Divya Darshan 360. Payments processed by Razorpay.",
    alternates: { canonical: pageUrl },
    openGraph: {
        type: "website",
        url: pageUrl,
        siteName: "Divya Darshan 360",
        title: "Payment Information | Divya Darshan 360",
        description: "Beneficiary, bank account, IFSC, and UPI details. Payments processed by Razorpay.",
    },
}

const ROWS: { label: string; value: string; mono?: boolean }[] = [
    { label: "Beneficiary name", value: "TELLME DIGIINFOTECH PRIVATE LIMITED" },
    { label: "Account number", value: "2223006306876848", mono: true },
    { label: "IFSC code", value: "UTIB000RAZP", mono: true },
    { label: "UPI address", value: "rpy.payto000009179099666@icici", mono: true },
]

export default function PaymentInformationPage() {
    return (
        <main className="min-h-screen relative overflow-hidden selection:bg-primary/30">
            <FloatingDiya className="absolute top-[10%] left-[5%] scale-110 hidden md:block" />
            <FloatingDiya className="absolute bottom-[12%] right-[8%] scale-90 hidden md:block" />
            <BackgroundLotus className="top-[5%] right-[-15%]" size={500} opacity={0.1} duration={220} />
            <BackgroundLotus className="bottom-[5%] left-[-10%]" size={400} opacity={0.08} duration={260} delay={8} />

            <div className="relative z-10 max-w-3xl mx-auto px-6 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </div>

            <section className="relative pt-8 pb-20 px-6">
                <div className="max-w-3xl mx-auto text-center mb-10">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-3 block">Compliance</span>
                    <h1 className="text-4xl md:text-5xl font-serif tracking-tighter">
                        Payment <span className="text-primary italic">information</span>
                    </h1>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mt-4">
                        Official payment details for Divya Darshan 360, processed securely by Razorpay.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="glass rounded-[2rem] p-7 md:p-10 ornate-border">
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
                            <Wallet className="w-4 h-4" />
                            Payee details
                        </div>
                        <div className="space-y-5">
                            {ROWS.map((row) => (
                                <div
                                    key={row.label}
                                    className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 pb-5 border-b border-white/10 last:border-b-0 last:pb-0"
                                >
                                    <span className="text-xs uppercase tracking-wider text-muted-foreground/80 shrink-0 sm:w-48">
                                        {row.label}
                                    </span>
                                    <span
                                        className={`text-foreground/90 break-all ${row.mono ? "font-mono text-base" : "font-medium text-base"}`}
                                    >
                                        {row.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 flex items-start gap-3 text-sm text-muted-foreground">
                        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p>
                            All website checkout payments are processed securely by{" "}
                            <span className="text-foreground/90 font-medium">Razorpay</span>. The account number and UPI
                            address above are also accepted for direct bank transfers or UPI payments outside the
                            website checkout. Funds are credited to the same account in either case.
                        </p>
                    </div>

                    <div className="mt-12 text-center text-sm text-muted-foreground">
                        Questions about a payment?{" "}
                        <a
                            href="mailto:connect@youtellme.ai"
                            className="text-primary hover:text-primary/80 transition-colors"
                        >
                            connect@youtellme.ai
                        </a>
                        {" "}or call{" "}
                        <a
                            href="tel:9049921850"
                            className="text-primary hover:text-primary/80 transition-colors"
                        >
                            +91 9049 9218 50
                        </a>
                        .
                    </div>
                </div>
            </section>
        </main>
    )
}

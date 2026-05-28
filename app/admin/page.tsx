import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AdminClient } from "./admin-client"

export const metadata: Metadata = {
    title: "Admin — Orders | Divya Darshan 360",
    description: "Internal orders dashboard.",
    robots: { index: false, follow: false },
}

export default function AdminPage() {
    return (
        <main className="min-h-screen relative overflow-hidden selection:bg-primary/30">
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to site
                </Link>
            </div>

            <section className="relative pt-6 pb-20 px-6">
                <div className="max-w-7xl mx-auto mb-8">
                    <span className="text-primary tracking-[0.3em] uppercase text-xs mb-2 block">Admin</span>
                    <h1 className="text-3xl md:text-4xl font-serif tracking-tighter">Orders dashboard</h1>
                </div>
                <AdminClient />
            </section>
        </main>
    )
}

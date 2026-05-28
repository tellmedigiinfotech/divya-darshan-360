import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { OrderDetailClient } from "./order-detail-client"

export const metadata: Metadata = {
    title: "Admin — Order detail | Divya Darshan 360",
    description: "Internal order detail.",
    robots: { index: false, follow: false },
}

export default async function AdminOrderDetailPage({
    params,
}: {
    params: Promise<{ orderId: string }>
}) {
    const { orderId } = await params
    return (
        <main className="min-h-screen relative overflow-hidden">
            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-8">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to orders
                </Link>
            </div>
            <section className="relative pt-6 pb-20 px-6">
                <OrderDetailClient orderId={orderId} />
            </section>
        </main>
    )
}

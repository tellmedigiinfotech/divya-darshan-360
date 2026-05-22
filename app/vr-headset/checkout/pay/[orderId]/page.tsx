import type { Metadata } from "next"
import { PayClient } from "./pay-client"

export const metadata: Metadata = {
    title: "Pay via UPI | Divya Darshan 360",
    description: "Complete your Mobile VR Box payment via UPI or bank transfer.",
    robots: { index: false, follow: false },
}

export default async function PayPage({
    params,
}: {
    params: Promise<{ orderId: string }>
}) {
    const { orderId } = await params
    return <PayClient orderId={decodeURIComponent(orderId)} />
}

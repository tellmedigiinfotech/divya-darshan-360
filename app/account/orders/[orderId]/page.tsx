import type { Metadata } from "next"
import { ReceiptClient } from "./receipt-client"

export const metadata: Metadata = {
    title: "Order Receipt | Divya Darshan 360",
    robots: { index: false, follow: false },
}

export default async function ReceiptPage({
    params,
}: {
    params: Promise<{ orderId: string }>
}) {
    const { orderId } = await params
    return <ReceiptClient orderId={decodeURIComponent(orderId)} />
}

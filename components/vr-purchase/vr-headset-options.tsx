"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Flame, ShoppingBag, Truck, ShieldCheck } from "lucide-react"
import Link from "next/link"

const product = {
    name: "Mobile VR Box",
    tagline: "One headset · One price · Universal compatibility",
    price: "₹699",
    originalPrice: "₹2999",
    images: ["/vr_set2.png", "/vr_set.png"],
    perks: [
        { icon: Truck, label: "Free shipping" },
        { icon: ShieldCheck, label: "7-day replacement" },
    ],
}

const LAUNCH_STOCK = 100
// 63 or 64 sold — picked once per page load so the number feels organic
// without changing while the visitor scrolls.
function pickSold() {
    return 63 + Math.floor(Math.random() * 2)
}

export function VrHeadsetOptions() {
    const orderHref = "/vr-headset/checkout"
    const [activeImage, setActiveImage] = useState(0)
    const [sold, setSold] = useState(64)

    useEffect(() => {
        setSold(pickSold())
        const id = setInterval(() => {
            setActiveImage((i) => (i + 1) % product.images.length)
        }, 3500)
        return () => clearInterval(id)
    }, [])

    const remaining = LAUNCH_STOCK - sold
    const soldPct = Math.round((sold / LAUNCH_STOCK) * 100)

    return (
        <section id="headsets" className="py-24 md:py-32 px-6 relative scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative rounded-[3rem] p-1 bg-gradient-to-br from-primary/40 via-accent/40 to-primary/20 shadow-2xl shadow-primary/20"
                >
                    <div className="glass rounded-[2.8rem] ornate-border overflow-hidden">
                        <div className="grid lg:grid-cols-2 gap-0">
                            {/* Image side */}
                            <div className="relative aspect-square lg:aspect-auto overflow-hidden bg-gradient-to-br from-primary/15 via-accent/10 to-transparent flex items-center justify-center p-10 group">
                                {/* Ambient orbs */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/30 rounded-full blur-[100px] group-hover:bg-primary/40 transition-colors duration-700" />
                                <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/30 rounded-full blur-[80px] animate-pulse-slow" />

                                {/* Concentric ring */}
                                <div className="absolute inset-12 rounded-full border border-primary/15 animate-spin-slow" />
                                <div className="absolute inset-24 rounded-full border border-accent/20 animate-spin-reverse-slow" />

                                <div className="relative z-10 w-2/3 h-2/3 flex items-center justify-center">
                                    <AnimatePresence mode="wait">
                                        <motion.img
                                            key={product.images[activeImage]}
                                            src={product.images[activeImage]}
                                            alt={product.name}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.6, ease: "easeInOut" }}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Carousel dots */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                                    {product.images.map((src, idx) => (
                                        <button
                                            key={src}
                                            type="button"
                                            onClick={() => setActiveImage(idx)}
                                            aria-label={`Show image ${idx + 1}`}
                                            className={`h-2 rounded-full transition-all duration-300 ${
                                                activeImage === idx
                                                    ? "w-8 bg-primary shadow-[0_0_10px_var(--color-primary)]"
                                                    : "w-2 bg-primary/30 hover:bg-primary/60"
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Get it on Google Play */}
                                <a
                                    href="https://play.google.com/store/apps/details?id=com.tellme.tellme360"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Get the Divya Darshan 360 app on Google Play"
                                    className="absolute top-6 right-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black text-white text-[11px] font-medium shadow-lg shadow-black/30 hover:bg-black/85 hover:-translate-y-0.5 transition-all z-20"
                                >
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                                        <path fill="#00d7b5" d="M3.6 1.7a1.9 1.9 0 0 0-.9 1.6v17.4a1.9 1.9 0 0 0 .9 1.6l9.9-10.3z"/>
                                        <path fill="#ffce00" d="M16.8 8.6 13.5 12l3.3 3.4 4.6-2.6c1-.6 1-2 0-2.6z"/>
                                        <path fill="#ff6b6b" d="M13.5 12 3.6 22.3a1.9 1.9 0 0 0 2 .1l11.2-6.4z"/>
                                        <path fill="#4d99ff" d="M3.6 1.7a1.9 1.9 0 0 1 2-.1l11.2 6.4-3.3 4z"/>
                                    </svg>
                                    <span className="leading-none">
                                        <span className="block text-[8.5px] opacity-80 uppercase tracking-wider">Get it on</span>
                                        <span className="block text-[12px] font-semibold">Google Play</span>
                                    </span>
                                </a>

                                {/* Floating spec chips */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-6 left-6 glass rounded-2xl px-4 py-3 shadow-xl z-20"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Compatibility</p>
                                    <p className="font-serif text-base text-primary">All Smartphones</p>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                                    className="absolute bottom-6 right-6 glass rounded-2xl px-4 py-3 shadow-xl z-20 text-right"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Comfort</p>
                                    <p className="font-serif text-base text-primary">Comfortable for elderly</p>
                                </motion.div>
                            </div>

                            {/* Details side */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.2em] shadow-lg shadow-primary/30 mb-6">
                                    <Flame className="w-3.5 h-3.5" />
                                    Limited Launch · Only {LAUNCH_STOCK} units
                                </div>

                                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">{product.tagline}</p>
                                <h3 className="text-3xl md:text-4xl font-serif mb-8">{product.name}</h3>

                                {/* Price */}
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-5xl font-serif text-foreground">{product.price}</span>
                                    <span className="text-lg text-muted-foreground line-through">
                                        {product.originalPrice}
                                    </span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold ml-1">
                                        Save 77%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-6">Inclusive of all taxes · Free delivery in India</p>

                                {/* Scarcity meter */}
                                <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/[0.04] px-4 py-3.5">
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="inline-flex items-center gap-1.5 text-primary font-semibold">
                                            <Flame className="w-3.5 h-3.5" />
                                            Only {remaining} left of {LAUNCH_STOCK}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {sold} sold
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-white/8 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${soldPct}%` }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            viewport={{ once: true }}
                                            className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-2">
                                        Launch offer ends when all {LAUNCH_STOCK} units are sold.
                                    </p>
                                </div>

                                {/* CTA */}
                                <Link
                                    href={orderHref}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full divine-button shadow-(--saffron-glow) text-lg"
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="font-serif tracking-wide">Buy Now · {product.price}</span>
                                </Link>

                                {/* Perks */}
                                <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-x-6 gap-y-3">
                                    {product.perks.map((p) => (
                                        <span
                                            key={p.label}
                                            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-muted-foreground"
                                        >
                                            <p.icon className="w-4 h-4 text-primary" />
                                            {p.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

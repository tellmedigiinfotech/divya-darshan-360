"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ShoppingBag, Star, Truck, ShieldCheck, Smartphone } from "lucide-react"
import Link from "next/link"

const product = {
    name: "Mobile VR Box",
    tagline: "One headset · One price · Universal compatibility",
    price: "₹599",
    originalPrice: "₹999",
    images: ["/vr_set2.png", "/vr_set.png"],
    rating: "4.8",
    features: [
        "Works with all Android & iOS smartphones (4.7\"–6.5\")",
        "Cardboard-style viewer with anti-glare lenses",
        "Soft adjustable head strap — comfortable for elderly",
        "Lightweight & travel-friendly design",
        "Perfectly tuned for the Divya Darshan 360 app",
    ],
    perks: [
        { icon: Truck, label: "Free shipping" },
        { icon: ShieldCheck, label: "7-day replacement" },
        { icon: Smartphone, label: "Works with all phones" },
    ],
}

export function VrHeadsetOptions() {
    const orderHref = "/vr-headset/checkout"
    const [activeImage, setActiveImage] = useState(0)

    useEffect(() => {
        const id = setInterval(() => {
            setActiveImage((i) => (i + 1) % product.images.length)
        }, 3500)
        return () => clearInterval(id)
    }, [])

    return (
        <section id="headsets" className="py-24 md:py-32 px-6 relative scroll-mt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Our Headset</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">
                        Meet the <span className="text-primary italic">Mobile VR Box</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        One simple, beautifully crafted headset — built for every devotee, every smartphone, and every divine darshan.
                    </p>
                </div>

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

                                {/* Rating badge */}
                                <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-xs font-medium shadow-lg z-20">
                                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                    {product.rating} · Trusted by devotees
                                </div>

                                {/* Floating spec chip */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute bottom-6 left-6 glass rounded-2xl px-4 py-3 shadow-xl z-20"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Compatibility</p>
                                    <p className="font-serif text-base text-primary">All Smartphones</p>
                                </motion.div>
                            </div>

                            {/* Details side */}
                            <div className="p-8 md:p-12 flex flex-col justify-center">
                                <div className="inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.2em] shadow-lg shadow-primary/30 mb-6">
                                    <Star className="w-3.5 h-3.5 fill-primary-foreground" />
                                    Limited Launch Offer
                                </div>

                                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">{product.tagline}</p>
                                <h3 className="text-3xl md:text-4xl font-serif mb-6">{product.name}</h3>

                                <ul className="space-y-3 mb-8">
                                    {product.features.map((feat) => (
                                        <li key={feat} className="flex items-start gap-3 text-sm md:text-base text-muted-foreground">
                                            <span className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-primary" />
                                            </span>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Price */}
                                <div className="flex items-baseline gap-3 mb-3">
                                    <span className="text-5xl font-serif text-foreground">{product.price}</span>
                                    <span className="text-lg text-muted-foreground line-through">
                                        {product.originalPrice}
                                    </span>
                                    <span className="text-xs uppercase tracking-[0.2em] text-primary font-semibold ml-1">
                                        Save 40%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-8">Inclusive of all taxes · Free delivery in India</p>

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

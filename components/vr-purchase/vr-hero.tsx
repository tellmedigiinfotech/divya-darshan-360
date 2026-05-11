"use client"

import { motion } from "framer-motion"
import { Sparkles, ShoppingBag } from "lucide-react"
import Link from "next/link"

export function VrHero() {
    return (
        <section className="relative pt-32 md:pt-40 pb-24 md:pb-32 px-6 overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-25">
                <div className="absolute top-10 left-10 w-96 h-96 bg-primary blur-[140px] animate-glow" />
                <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent blur-[120px] animate-glow" />
            </div>

            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* Left – copy */}
                <div className="text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-10 backdrop-blur-md"
                    >
                        <Sparkles className="w-4 h-4" />
                        Immersive Spiritual VR Hardware
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                        className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif tracking-tighter mb-6 leading-[0.95] text-balance"
                    >
                        Bring Divine
                        <span className="text-primary italic block">Darshan Home in VR</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25, duration: 0.8 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-light"
                    >
                        Experience temples and spiritual journeys in immersive
                        <span className="text-primary font-medium"> 360° virtual reality</span>.
                        From the comfort of your home, feel the divine presence — one breath at a time.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start"
                    >
                        <Link
                            href="#headsets"
                            className="group divine-button rounded-full px-9 py-5 inline-flex items-center gap-3 text-lg shadow-(--saffron-glow)"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-serif tracking-wide">Buy VR Headset</span>
                        </Link>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="mt-14 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-sm text-muted-foreground"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Free Shipping in India
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            7-Day Replacement
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                            Works with Divya Darshan 360
                        </span>
                    </motion.div>
                </div>

                {/* Right – floating VR mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 1 }}
                    className="relative"
                >
                    <div className="relative aspect-square max-w-[680px] mx-auto">
                        {/* Ambient glow */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-3xl animate-pulse-slow" />

                        {/* Glass plate holding the headset */}
                        <div className="absolute inset-2 glass rounded-[3rem] ornate-border overflow-hidden flex items-center justify-center group">
                            <video
                                src="/vr_demo_video.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                preload="auto"
                                aria-label="Devotee experiencing VR temple darshan"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />
                            <div className="absolute top-6 left-6 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl" />
                            <div className="absolute bottom-6 right-6 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

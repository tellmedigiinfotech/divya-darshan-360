"use client"

import { motion } from "framer-motion"
import { ShoppingBag, MessageCircle } from "lucide-react"
import Link from "next/link"

export function VrFinalCta() {
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative glass rounded-[3rem] p-10 md:p-16 ornate-border overflow-hidden text-center"
                >
                    {/* Ambient orbs */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 animate-pulse-slow" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[120px] translate-y-1/2 animate-pulse-slow" />

                    {/* Decorative corners */}
                    <div className="absolute top-6 left-6 w-20 h-20 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl" />
                    <div className="absolute top-6 right-6 w-20 h-20 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl" />
                    <div className="absolute bottom-6 left-6 w-20 h-20 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl" />
                    <div className="absolute bottom-6 right-6 w-20 h-20 border-b-2 border-r-2 border-primary/30 rounded-br-3xl" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <span className="text-primary tracking-[0.3em] uppercase text-sm mb-6 block">Begin the Journey</span>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-8 leading-tight text-balance">
                            Start Your Spiritual{" "}
                            <span className="text-primary italic">VR Journey</span>{" "}
                            Today
                        </h2>

                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-2xl mx-auto">
                            The temple is no longer a journey away. With one headset, divine darshan can be a
                            daily ritual — for you, your parents, your children.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                            <Link
                                href="/vr-headset/checkout"
                                className="group divine-button rounded-full px-9 py-5 inline-flex items-center gap-3 text-lg shadow-(--saffron-glow)"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span className="font-serif tracking-wide">Buy Now · ₹599</span>
                            </Link>

                            <Link
                                href="mailto:connect@youtellme.ai?cc=sairaj@tellmedigi.com&subject=VR%20Headset%20Enquiry"
                                className="group inline-flex items-center gap-3 px-8 py-5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-lg hover:shadow-primary/30"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="text-lg font-serif tracking-tight">Contact Us</span>
                            </Link>
                        </div>

                        <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            🕉 Free Shipping · 7-Day Replacement · Secure Checkout
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

"use client"

import { motion } from "framer-motion"
import { Package, Truck, Smartphone, Sparkles } from "lucide-react"

const steps = [
    {
        n: "01",
        title: "Buy Headset",
        desc: "Pick the headset that fits you and place your order in seconds.",
        icon: Package,
    },
    {
        n: "02",
        title: "Receive Device",
        desc: "Free shipping in India. Your headset arrives sacred-ready, fully assembled.",
        icon: Truck,
    },
    {
        n: "03",
        title: "Open Divya Darshan 360",
        desc: "Download the free app, slide your phone in, and choose your darshan.",
        icon: Smartphone,
    },
    {
        n: "04",
        title: "Start Temple Experience",
        desc: "Close your eyes, take a breath, and step into the divine presence.",
        icon: Sparkles,
    },
]

export function VrHowItWorks() {
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse-slow" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Simple Journey</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">How It Works</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Four gentle steps from order to your first divine darshan in VR.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden lg:block absolute top-24 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
                        {steps.map((s, i) => (
                            <motion.div
                                key={s.n}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="relative group text-center"
                            >
                                {/* Number badge with icon */}
                                <div className="relative mx-auto w-24 h-24 mb-6">
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/30 via-accent/30 to-primary/10 blur-xl group-hover:blur-2xl transition-all duration-500" />
                                    <div className="relative w-full h-full glass rounded-full flex items-center justify-center ornate-border group-hover:scale-110 transition-transform duration-500">
                                        <s.icon className="w-9 h-9 text-primary" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground font-serif text-sm flex items-center justify-center shadow-lg shadow-primary/30">
                                        {s.n}
                                    </div>
                                </div>

                                <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">
                                    {s.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm max-w-xs mx-auto">
                                    {s.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

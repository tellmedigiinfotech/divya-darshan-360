"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"

export function DemoVideo() {
    return (
        <section className="py-20 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-serif mb-4">Experience the Divine</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Watch how Divya Darshan 360 brings the temple directly to your home
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative aspect-video max-w-4xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group cursor-pointer"
                >
                    {/* Background Image Placeholder */}
                    <div className="absolute inset-0">
                        <img
                            src="/spiritual-app-home-screen-darshan.jpg"
                            alt="App Demo Preview"
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />
                    </div>

                    {/* Interactive Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Pulse Effects */}
                            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping opacity-75" />
                            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse blur-xl" />

                            <div className="relative w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]">
                                    <Play className="w-8 h-8 text-black fill-black ml-1" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overlay Text */}
                    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                        <div className="px-4 py-2 rounded-full glass inline-flex items-center gap-2 text-sm font-medium text-white/90">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Watch Demo
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

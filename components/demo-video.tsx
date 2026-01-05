"use client"

import { motion } from "framer-motion"

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
                    className="relative aspect-video max-w-4xl mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-white/10"
                >
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/6gDBq8M_JOg?si=8iZ5s6z3z5z3z5z3"
                        title="Divya Darshan 360 Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </motion.div>
            </div>
        </section>
    )
}

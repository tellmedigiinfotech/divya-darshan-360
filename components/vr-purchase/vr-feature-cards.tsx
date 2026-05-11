"use client"

import { motion } from "framer-motion"
import { Eye, Compass, HandHeart, Users, Focus as Lotus } from "lucide-react"

const features = [
    {
        title: "Immersive Temple Experience",
        desc: "Step inside Jyotirlingas, Shakti Peethas and Sai Baba's Shirdi as if you were standing before the deity.",
        icon: Eye,
    },
    {
        title: "360° Spiritual Journeys",
        desc: "Look around freely — every corner, every aarti flame, every detail captured in cinematic 360°.",
        icon: Compass,
    },
    {
        title: "Easy to Use",
        desc: "Slip on the headset, open the Divya Darshan 360 app, and the divine moment begins. No setup required.",
        icon: HandHeart,
    },
    {
        title: "Perfect for Elderly & Families",
        desc: "Designed for everyone — from grandparents seeking darshan to families sharing a sacred moment together.",
        icon: Users,
    },
]

export function VrFeatureCards() {
    return (
        <section className="py-24 md:py-32 px-6 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse-slow" />

            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Why VR</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">Why You Need a VR Headset</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Phones bring the picture. A VR headset brings the presence. This is what truly transforms a 360° video into divine darshan.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="glass p-8 rounded-3xl group hover:border-primary/50 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                        >
                            <Lotus className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/15 transition-colors duration-500" />

                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500 relative z-10">
                                <f.icon className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-serif mb-3 relative z-10 group-hover:text-primary transition-colors">
                                {f.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm relative z-10">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

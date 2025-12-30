"use client"

import { motion } from "framer-motion"
import { Eye, Music, Calendar, Sparkles, Sun, Smartphone, Focus as Lotus } from "lucide-react"

const features = [
  {
    title: "360° Divine Darshan",
    desc: "Experience temples as if you were standing right in front of the deity.",
    icon: Eye,
  },
  {
    title: "Exclusive Aarties",
    desc: "Sacred rituals filmed to make you feel present in the divine moment.",
    icon: Music,
  },
  {
    title: "Daily Panchang",
    desc: "Stay connected with Tithi, Nakshatra, and auspicious times.",
    icon: Calendar,
  },
  {
    title: "Deity Blessings",
    desc: "Receive divine grace and blessings from your favorite deities.",
    icon: Sparkles,
  },
  {
    title: "Day Special",
    desc: "Curated content for festivals and special spiritual days.",
    icon: Sun,
  },
  {
    title: "Mobile VR Journey",
    desc: "The ultimate spiritual video app for your mobile VR experience.",
    icon: Smartphone,
  },
]

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="glass p-8 rounded-3xl group hover:border-primary/50 transition-all duration-500 relative overflow-hidden"
        >
          <Lotus className="absolute -bottom-4 -right-4 w-24 h-24 text-primary/5 group-hover:text-primary/10 transition-colors" />

          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
            <f.icon className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-3 relative z-10">{f.title}</h3>
          <p className="text-muted-foreground leading-relaxed relative z-10">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  )
}

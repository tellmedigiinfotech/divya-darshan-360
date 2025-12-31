"use client"

import { motion } from "framer-motion"
import { Layers, Sparkles, Mountain } from "lucide-react"

const categories = [
  {
    title: "Jyotirlingas",
    subtitle: "12 Sacred Shrines",
    image: "/sacred-jyotirlinga-shiva-temple-360-view.jpg",
    color: "from-orange-500/20",
    icon: Sparkles,
    count: "Premium Collection",
    description: "Sacred Shiva Temples",
  },
  {
    title: "Ashtavinayak",
    subtitle: "8 Ganesh Shrines",
    image: "/ashtavinayak-ganesh-temple-spiritual-darshan.jpg",
    color: "from-yellow-500/20",
    icon: Layers,
    count: " exclusive Series",
    description: "Eight Divine Forms",
  },
  {
    title: "Shakti Peeths",
    subtitle: "Divine Mother",
    image: "/shakti-peeth-divine-goddess-temple-sacred-atmosphe.jpg",
    color: "from-red-500/20",
    icon: Mountain, // Using Mountain as generic spiritual icon or similar
    count: "Devi Darshan",
    description: "Goddess Temples",
  },
]

export function ExperienceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
      {categories.map((cat, i) => (
        <motion.div
          key={cat.title}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="group relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-default"
        >
          {/* Image Background */}
          <div className="absolute inset-0 bg-zinc-900">
            <img
              src={cat.image || "/placeholder.svg"}
              alt={cat.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            />
          </div>

          {/* Gradients */}
          <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-60 mix-blend-overlay`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end relative z-10">
            {/* Top Badge */}
            <div className="absolute top-6 left-6">
              <div className="glass px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                <cat.icon className="w-3 h-3 text-primary" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/90 font-bold">
                  {cat.count}
                </span>
              </div>
            </div>

            {/* Description Animation */}
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium border-b border-primary/30 pb-1">
                  {cat.description}
                </span>
              </div>

              <h3 className="text-4xl font-serif text-white mb-3 leading-none tracking-tight">
                {cat.title}
              </h3>

              <p className="text-white/70 text-lg font-light flex items-center gap-3">
                <span className="w-8 h-[1px] bg-primary/50 block"></span>
                {cat.subtitle}
              </p>
            </div>

            {/* Decorative Overlay Border */}
            <div className="absolute inset-4 rounded-[2rem] border border-white/5 pointer-events-none group-hover:border-primary/20 transition-colors duration-500" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

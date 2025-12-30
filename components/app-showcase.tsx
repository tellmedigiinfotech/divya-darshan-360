"use client"

import { motion } from "framer-motion"

export function AppShowcase() {
  const images = [
    "/screenshots/WhatsApp Image 2025-12-30 at 3.03.17 PM (1).jpeg",
    "/screenshots/WhatsApp Image 2025-12-30 at 3.03.17 PM.jpeg",
    "/screenshots/WhatsApp Image 2025-12-30 at 3.03.18 PM (1).jpeg",
    "/screenshots/WhatsApp Image 2025-12-30 at 3.03.18 PM.jpeg",
  ]

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            viewport={{ once: true }}
            className={`group relative aspect-[9/19] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-4 ${i % 2 === 1 ? "md:translate-y-12" : ""
              }`}
          >
            <img
              src={img || "/placeholder.svg"}
              alt={`App screenshot ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Divine glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Subtle border to define the shape */}
            <div className="absolute inset-0 rounded-[2rem] border border-white/10 group-hover:border-primary/30 transition-colors pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

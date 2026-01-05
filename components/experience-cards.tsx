"use client"

import { motion } from "framer-motion"
import { Play, MapPin, Calendar, Star } from "lucide-react"

const experiences = [
  {
    id: 1,
    title: "Jyotirlingas",
    location: "Sacred India",
    date: "Divine Shiva Darshan",
    rating: "5.0",
    image: "/sacred-jyotirlinga-shiva-temple-360-view.jpg",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 2,
    title: "Ashtavinayak Yatra",
    location: "Maharashtra",
    date: "Ganesh Blessings",
    rating: "4.9",
    image: "/ashtavinayak-ganesh-temple-spiritual-darshan.jpg",
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    id: 3,
    title: "Shakti Peethas",
    location: "Indian Subcontinent",
    date: "Devi Worship",
    rating: "5.0",
    image: "/shakti-peeth-divine-goddess-temple-sacred-atmosphe.jpg",
    color: "from-rose-500/20 to-pink-500/20"
  },
  {
    id: 4,
    title: "Sai Baba Mandir",
    location: "Shirdi",
    date: "Faith & Patience",
    rating: "4.9",
    image: "/sai-baba-shirdi.png",
    color: "from-yellow-400/20 to-orange-400/20"
  },
  {
    id: 5,
    title: "Many More...",
    location: "Exclusive Access",
    date: "Only on App",
    rating: "5.0",
    image: "/many-more-temples.png",
    color: "from-purple-500/20 to-violet-500/20"
  }
]

export function ExperienceCards() {
  return (
    <div className="flex flex-wrap justify-center gap-8 px-4 max-w-7xl mx-auto">
      {experiences.map((exp, i) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="group relative w-full md:w-[calc(33.333%-2rem)] aspect-[3/4] rounded-[2.5rem] overflow-hidden cursor-pointer"
        >
          {/* Background Gradient/Image Placeholder */}
          <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
          <img
            src={exp.image}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Glass Effect Overlay */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="flex items-center gap-2 text-xs font-medium text-primary/80 mb-3 uppercase tracking-wider">
                <MapPin className="w-3 h-3" />
                {exp.location}
              </div>

              <h3 className="text-2xl font-serif text-white mb-2 leading-tight group-hover:text-primary transition-colors duration-300">
                {exp.title}
              </h3>

              <div className="flex items-center justify-between mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <div className="flex items-center gap-4 text-xs text-zinc-300">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exp.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {exp.rating}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-white/5 rounded-[2.5rem] group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  )
}

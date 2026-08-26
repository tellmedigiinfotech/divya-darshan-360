"use client"

import { motion } from "framer-motion"
import { Play, MapPin, Calendar, Star } from "lucide-react"

// Card art lives in public/Sacred Journeys. The folder name has a space, so the
// paths are percent-encoded here rather than relying on the browser to do it.
//
// The "-web" files are downscaled copies. Two of the originals were camera
// frames (45MB / 18MB) being rendered into a 384x512 box; the full-resolution
// versions are kept on disk but gitignored, since they are ~64MB of weight for
// no visible gain.
const experiences = [
  {
    id: 1,
    title: "Jyotirlingas",
    location: "Sacred India",
    date: "Divine Shiva Darshan",
    rating: "5.0",
    image: "/Sacred%20Journeys/Jyotirlingas.jpg",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    id: 2,
    title: "Ashtavinayak Yatra",
    location: "Maharashtra",
    date: "Ganesh Blessings",
    rating: "4.9",
    image: "/Sacred%20Journeys/Ashtavinayak%20Yatra.jpg",
    color: "from-amber-500/20 to-yellow-500/20"
  },
  {
    id: 3,
    title: "Shakti Peethas",
    location: "Indian Subcontinent",
    date: "Devi Worship",
    rating: "5.0",
    image: "/Sacred%20Journeys/Shakti%20Peethas-web.jpg",
    color: "from-rose-500/20 to-pink-500/20"
  },
  {
    id: 4,
    title: "Sai Baba Mandir",
    location: "Shirdi",
    date: "Faith & Patience",
    rating: "4.9",
    image: "/Sacred%20Journeys/Sai%20Baba%20Mandir-web.jpg",
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
          className="group relative w-full md:w-[calc(33.333%-2rem)] aspect-[3/4] rounded-3xl overflow-hidden cursor-pointer"
        >
          {/* Tinted placeholder, visible only while the photo loads */}
          <div className={`absolute inset-0 bg-gradient-to-br ${exp.color}`} />
          <img
            src={exp.image}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Dark scrim only — carries the white caption text. Nothing lightens
              the photo, or the pale page background washes it out. */}
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
          <div className="absolute inset-0 border-2 border-white/5 rounded-3xl group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  )
}

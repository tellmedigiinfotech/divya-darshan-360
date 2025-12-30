"use client"

import { motion } from "framer-motion"

const experiences = [
  {
    title: "Jyotirlingas",
    time: "18:00 MIN",
    image: "/sacred-jyotirlinga-shiva-temple-360-view.jpg",
    color: "from-orange-500/20",
    isExclusive: true,
    description: "Sacred Shiva Temples",
  },
  {
    title: "Ashtavinayak",
    time: "15:30 MIN",
    image: "/ashtavinayak-ganesh-temple-spiritual-darshan.jpg",
    color: "from-yellow-500/20",
    isExclusive: true,
    description: "Eight Ganesh Shrines",
  },
  {
    title: "Shakti Peeths",
    time: "20:45 MIN",
    image: "/shakti-peeth-divine-goddess-temple-sacred-atmosphe.jpg",
    color: "from-red-500/20",
    isExclusive: true,
    description: "Divine Goddess Temples",
  },
]

export function ExperienceCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
      {experiences.map((exp, i) => (
        <motion.div
          key={exp.title}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: i * 0.2 }}
          viewport={{ once: true }}
          className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <img
            src={exp.image || "/placeholder.svg"}
            alt={exp.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${exp.color} to-transparent opacity-60`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          <div className="absolute inset-0 p-8 flex flex-col justify-end">
            <div className="absolute top-8 left-8">
              {exp.isExclusive && (
                <span className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] tracking-[0.2em] uppercase text-primary font-bold">
                  Platform Exclusive
                </span>
              )}
            </div>
            <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-xs tracking-[0.2em] uppercase text-primary font-medium">{exp.description}</span>
            </div>
            <h3 className="text-3xl font-serif text-white mb-2 leading-tight">{exp.title}</h3>
            <div className="flex items-center gap-4 text-white/60 text-sm">
              <span>{exp.time}</span>
              <div className="w-1 h-1 rounded-full bg-white/30" />
              <span>360° VR</span>
            </div>
            {/* <CHANGE> Removed the play button as these are category cards, not video players */}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

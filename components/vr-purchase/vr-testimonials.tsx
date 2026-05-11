"use client"

import { motion } from "framer-motion"
import { Quote, Star } from "lucide-react"

type Testimonial = {
    name: string
    role: string
    location: string
    text: string
    avatar: string
    rating: number
}

const testimonials: Testimonial[] = [
    {
        name: "Sushila Devi",
        role: "Elderly Devotee",
        location: "Pune, Maharashtra",
        text: "At 72, I cannot travel anymore. With this VR headset, I visited Kashi Vishwanath again. Tears came to my eyes — it felt as if I was truly there.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
    },
    {
        name: "Sharma Family",
        role: "Family of Four",
        location: "Bengaluru, Karnataka",
        text: "Every Sunday morning, our whole family does darshan together using this headset. Our children now know our temples better than ever.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
    },
    {
        name: "Ramesh Kulkarni",
        role: "Temple Devotee",
        location: "Nashik, Maharashtra",
        text: "The Ashtavinayak yatra in 360° is divine. I have been to all eight in person — but with this VR, the experience is just as devotional.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
    },
    {
        name: "Anita Rao",
        role: "Working Professional",
        location: "Mumbai, Maharashtra",
        text: "Mornings begin with aarti now. The headset is so light my mother uses it daily. It has brought peace to our home.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
    },
]

export function VrTestimonials() {
    return (
        <section className="py-24 md:py-32 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <span className="text-primary tracking-[0.3em] uppercase text-sm mb-4 block">Sacred Stories</span>
                    <h2 className="text-4xl md:text-6xl font-serif mb-6">Voices of Devotion</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        From elderly grandparents to growing families — real stories from devotees who brought the divine home.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {testimonials.map((t, i) => (
                        <motion.figure
                            key={t.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="glass rounded-3xl p-8 md:p-10 ornate-border relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500"
                        >
                            <Quote className="absolute top-6 right-6 w-16 h-16 text-primary/10 group-hover:text-primary/20 transition-colors duration-500" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {Array.from({ length: t.rating }).map((_, idx) => (
                                    <Star key={idx} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>

                            <blockquote className="text-lg md:text-xl font-serif leading-relaxed mb-8 text-balance">
                                &ldquo;{t.text}&rdquo;
                            </blockquote>

                            <figcaption className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0 bg-primary/10">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-serif text-base">{t.name}</p>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        {t.role} · {t.location}
                                    </p>
                                </div>
                            </figcaption>
                        </motion.figure>
                    ))}
                </div>
            </div>
        </section>
    )
}

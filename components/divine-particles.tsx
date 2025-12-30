"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface Particle {
    id: number
    x: number
    y: number
    size: number
    duration: number
    delay: number
}

export function DivineParticles({ count = 30 }: { count?: number }) {
    const [particles, setParticles] = useState<Particle[]>([])

    useEffect(() => {
        // Generate static particles on client side to avoid hydration mismatch
        const newParticles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: Math.random() * 100, // percentage
            size: Math.random() * 3 + 1, // 1px to 4px
            duration: Math.random() * 20 + 10, // 10s to 30s
            delay: Math.random() * 5,
        }))
        setParticles(newParticles)
    }, [count])

    if (particles.length === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-primary/40 blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -100], // Move up by 100px
                        opacity: [0, 0.8, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: p.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    )
}

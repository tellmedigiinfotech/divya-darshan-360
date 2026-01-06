"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BackgroundLotusProps {
    className?: string
    size?: number | string
    opacity?: number
    duration?: number
    delay?: number
}

export function BackgroundLotus({
    className,
    size = 500,
    opacity = 0.3,
    duration = 200,
    delay = 0
}: BackgroundLotusProps) {
    return (
        <div
            className={cn("pointer-events-none absolute", className)}
            style={{
                width: size,
                height: size,
                opacity: opacity
            }}
        >
            <div className="absolute inset-0">
                <svg className="w-0 h-0 absolute">
                    <defs>
                        <linearGradient id={`lotus-stroke-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#d4af37" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            {/* Layer 1: Outer Lotus - Smooth Curve */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: duration, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: delay }}
                className="absolute inset-0"
            >
                <svg viewBox="0 0 800 800" className="w-full h-full text-primary">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <g key={`bg-petal-outer-${i}`} transform={`rotate(${(i * 360) / 16} 400 400)`}>
                            <path
                                d="M400 100 C 430 150, 440 220, 400 300 C 360 220, 370 150, 400 100 Z"
                                fill="none"
                                stroke={`url(#lotus-stroke-${size})`}
                                strokeWidth="1.5"
                                className="opacity-60"
                            />
                            <circle cx="400" cy="95" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </g>
                    ))}
                </svg>
            </motion.div>

            {/* Layer 2: Inner Lotus - Counter Rotate */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: duration * 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear", delay: delay }}
                className="absolute inset-[20%]"
            >
                <svg viewBox="0 0 800 800" className="w-full h-full text-accent">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <g key={`bg-petal-inner-${i}`} transform={`rotate(${(i * 360) / 12} 400 400)`}>
                            <path
                                d="M400 180 C 440 230, 450 300, 400 380 C 350 300, 360 230, 400 180 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="opacity-50"
                            />
                            <circle cx="400" cy="175" r="4" fill="currentColor" opacity="0.6" />
                        </g>
                    ))}
                </svg>
            </motion.div>
        </div>
    )
}

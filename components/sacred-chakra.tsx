"use client"

import { motion } from "framer-motion"

export function SacredChakra() {
  return (
    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] pointer-events-none opacity-[0.8]">
      <div className="absolute inset-0">
        <svg className="w-0 h-0 absolute">
          <defs>
            {/* Gradient for smooth artistic strokes */}
            <linearGradient id="artistic-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="var(--primary)" />
            </linearGradient>

            {/* Soft Glow for the lines */}
            <filter id="smooth-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Layer 1: Outer Lotus - Large, Sweeping Curves (32 Petals) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 300, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 800 800" className="w-full h-full text-primary">
          {Array.from({ length: 32 }).map((_, i) => (
            <g key={`petal-outer-${i}`} transform={`rotate(${(i * 360) / 32} 400 400)`}>
              {/* Main Smooth Curve - No Veins */}
              <path
                d="M400 100 
                   C 430 150, 440 220, 400 300 
                   C 360 220, 370 150, 400 100 Z"
                fill="none"
                stroke="url(#artistic-gradient)"
                strokeWidth="0.8"
                className="opacity-70"
              />
              {/* Secondary Inner Curve - purely decorative, follows shape */}
              <path
                d="M400 120 
                   C 420 160, 425 210, 400 270 
                   C 375 210, 380 160, 400 120 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                className="opacity-40"
              />

              {/* Artistic Tip - A simple elegant dot */}
              <circle cx="400" cy="95" r="2" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Layer 2: Middle Lotus - Wide & Elegant (16 Petals) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 200, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-[10%]"
      >
        <svg viewBox="0 0 800 800" className="w-full h-full text-primary">
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={`petal-mid-${i}`} transform={`rotate(${(i * 360) / 16} 400 400)`}>
              {/* Wide Elegant Curve */}
              <path
                d="M400 180 
                   C 440 230, 450 300, 400 380 
                   C 350 300, 360 230, 400 180 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="opacity-80"
              />
              {/* Decorative Flourish at base */}
              <path
                d="M400 330 Q 410 350 400 370 Q 390 350 400 330"
                fill="none"
                stroke="#d4af37"
                strokeWidth="0.6"
                opacity="0.6"
              />

              {/* Tip Detail */}
              <circle cx="400" cy="175" r="3" fill="var(--primary)" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="4s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Layer 3: Inner Core - Intricate & Smooth (12 Petals) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-[25%]"
      >
        <svg viewBox="0 0 800 800" className="w-full h-full text-accent">
          {Array.from({ length: 12 }).map((_, i) => (
            <g key={`petal-inner-${i}`} transform={`rotate(${(i * 360) / 12} 400 400)`}>
              {/* Sharp, smooth petal */}
              <path
                d="M400 250 
                   Q 425 300 400 380 
                   Q 375 300 400 250"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.8"
                opacity="0.6"
              />
              <circle cx="400" cy="245" r="1.5" fill="currentColor" />
            </g>
          ))}

          {/* Central Decorative Circles */}
          <circle cx="400" cy="400" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 3" opacity="0.5" />
          <circle cx="400" cy="400" r="130" fill="none" stroke="currentColor" strokeWidth="0.3" opacity="0.3" />
        </svg>
      </motion.div>

      {/* Center Light */}
      <div className="absolute inset-[48%] rounded-full bg-primary/20 blur-[15px] animate-pulse-slow" />
    </div>
  )
}

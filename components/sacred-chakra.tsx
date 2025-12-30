"use client"

import { motion } from "framer-motion"

export function SacredChakra() {
  return (
    <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] pointer-events-none opacity-[0.2]">
      {/* Outer Golden Lotus Ring - Slow & Divine */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 150, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(255,215,0,0.2)]">
          {/* 32 Large Ornate Golden Petals */}
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i * 360) / 32
            return (
              <g key={`lotus-outer-${i}`} transform={`rotate(${angle} 100 100)`}>
                <path
                  d="M100 0 C108 30 108 60 100 90 C92 60 92 30 100 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.15"
                  className="opacity-40"
                />
                <path
                  d="M100 10 C105 40 105 70 100 85 C95 70 95 40 100 10"
                  fill="currentColor"
                  className="opacity-10"
                />
              </g>
            )
          })}
        </svg>
      </motion.div>

      {/* Middle Lotus Ring - Counter Rotation */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 100, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="absolute inset-[15%]"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-primary/60">
          {/* 24 Detailed Petals */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24
            return (
              <g key={`lotus-mid-${i}`} transform={`rotate(${angle} 100 100)`}>
                <path
                  d="M100 20 C106 50 106 80 100 95 C94 80 94 50 100 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.1"
                />
              </g>
            )
          })}
        </svg>
      </motion.div>

      {/* Inner Sacred Chakra - Fast with Pulse */}
      <motion.div
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
          scale: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
        }}
        className="absolute inset-[30%]"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#B8860B]">
          {/* Central Ornate Mandala */}
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12
            return (
              <g key={`lotus-inner-${i}`} transform={`rotate(${angle} 100 100)`}>
                <path
                  d="M100 30 C115 50 115 70 100 90 C85 70 85 50 100 30"
                  fill="currentColor"
                  opacity="0.2"
                  stroke="currentColor"
                  strokeWidth="0.4"
                />
              </g>
            )
          })}
          <circle cx="100" cy="100" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
          <path
            d="M90 100 A10 10 0 0 1 110 100 A10 10 0 0 1 90 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.8"
          />
        </svg>
      </motion.div>

      {/* Core Divine Glow */}
      <div className="absolute inset-[42%] bg-primary/20 rounded-full blur-[80px] animate-pulse-slow" />
    </div>
  )
}

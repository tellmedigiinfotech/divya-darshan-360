"use client"

import { motion } from "framer-motion"

interface FloatingDiyaProps {
    className?: string
}

export function FloatingDiya({ className = "" }: FloatingDiyaProps) {
    return (
        <motion.div
            className={`pointer-events-none ${className}`}
            animate={{
                y: [0, -12, 0],
                rotate: [-1, 1, -1],
            }}
            transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <div className="relative w-16 h-20">
                {/* Ambient light glow - largest outer glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-orange-400/10 blur-3xl rounded-full" />

                {/* Flame Container */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    {/* Outer flame glow */}
                    <motion.div
                        className="absolute -inset-4 bg-orange-400/30 blur-2xl rounded-full"
                        animate={{
                            scale: [1, 1.3, 1.1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.35, 0.45, 0.3],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Secondary glow ring */}
                    <motion.div
                        className="absolute -inset-2 bg-yellow-400/20 blur-xl rounded-full"
                        animate={{
                            scale: [1, 1.2, 0.95, 1.15, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    {/* Outer flame - red/orange */}
                    <motion.div
                        className="relative"
                        animate={{
                            scaleY: [1, 1.15, 0.9, 1.1, 1],
                            scaleX: [1, 0.95, 1.05, 0.98, 1],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className="w-5 h-10 rounded-full"
                            style={{
                                background: "linear-gradient(to top, #ea580c 0%, #f97316 30%, #fb923c 60%, #fdba74 100%)",
                                boxShadow: "0 0 20px rgba(249, 115, 22, 0.6), 0 0 40px rgba(251, 146, 60, 0.3)",
                                clipPath: "ellipse(50% 100% at 50% 100%)",
                                transform: "scaleX(0.7)",
                            }}
                        />
                    </motion.div>

                    {/* Inner flame - yellow/white core */}
                    <motion.div
                        className="absolute top-3 left-1/2 -translate-x-1/2"
                        animate={{
                            scaleY: [1, 1.2, 0.85, 1.1, 1],
                            scaleX: [1, 0.9, 1.1, 0.95, 1],
                        }}
                        transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.1,
                        }}
                    >
                        <div
                            className="w-3 h-6 rounded-full"
                            style={{
                                background: "linear-gradient(to top, #fbbf24 0%, #fde047 40%, #fef9c3 70%, #ffffff 100%)",
                                boxShadow: "0 0 10px rgba(253, 224, 71, 0.8)",
                                clipPath: "ellipse(50% 100% at 50% 100%)",
                                transform: "scaleX(0.6)",
                            }}
                        />
                    </motion.div>

                    {/* Flame tip - white hot center */}
                    <motion.div
                        className="absolute top-4 left-1/2 -translate-x-1/2"
                        animate={{
                            scaleY: [1, 1.3, 0.8, 1.15, 1],
                            opacity: [0.9, 1, 0.7, 0.95, 0.9],
                        }}
                        transition={{
                            duration: 0.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div
                            className="w-1.5 h-3 rounded-full bg-white"
                            style={{
                                boxShadow: "0 0 8px rgba(255, 255, 255, 0.9), 0 0 15px rgba(254, 249, 195, 0.6)",
                            }}
                        />
                    </motion.div>

                    {/* Wick */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-full" />
                </div>

                {/* Oil surface with shimmer */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-10 h-3 bg-gradient-to-b from-amber-900/80 to-amber-950 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent"
                        animate={{
                            x: [-20, 20, -20],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                {/* Diya body - traditional brass look */}
                <div className="absolute top-11 left-1/2 -translate-x-1/2">
                    {/* Main bowl */}
                    <div
                        className="w-14 h-6 rounded-b-[100%] rounded-t-sm relative overflow-hidden"
                        style={{
                            background: "linear-gradient(135deg, #d97706 0%, #b45309 25%, #92400e 50%, #78350f 75%, #451a03 100%)",
                            boxShadow: "inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(251,191,36,0.2)",
                        }}
                    >
                        {/* Metallic shine effect */}
                        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />
                        <div className="absolute top-1 left-1 w-2 h-2 bg-amber-300/30 rounded-full blur-sm" />

                        {/* Decorative pattern */}
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1 h-1 rounded-full bg-amber-400/30" />
                            ))}
                        </div>
                    </div>

                    {/* Spout/lip of the diya */}
                    <div
                        className="absolute -right-1 top-0 w-3 h-2 rounded-r-full"
                        style={{
                            background: "linear-gradient(90deg, #b45309 0%, #d97706 100%)",
                        }}
                    />

                    {/* Base/stem */}
                    <div
                        className="w-8 h-2 mx-auto mt-0.5 rounded-b-lg"
                        style={{
                            background: "linear-gradient(180deg, #92400e 0%, #78350f 50%, #451a03 100%)",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                    />

                    {/* Bottom plate */}
                    <div
                        className="w-10 h-1 mx-auto rounded-b-lg"
                        style={{
                            background: "linear-gradient(180deg, #78350f 0%, #451a03 100%)",
                        }}
                    />
                </div>

                {/* Ground reflection/glow */}
                <motion.div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full"
                    style={{
                        background: "radial-gradient(ellipse, rgba(251,146,60,0.3) 0%, transparent 70%)",
                    }}
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scaleX: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </motion.div>
    )
}

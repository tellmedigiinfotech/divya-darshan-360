import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: {
    default: "Divya Darshan 360 | Experience Divine VR Darshan",
    template: "%s | Divya Darshan 360",
  },
  description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom. Experience divine darshan from anywhere in the world.",
  keywords: [
    "Divya Darshan 360",
    "Divya Darshan",
    "VR temple darshan",
    "360 temple experience",
    "virtual reality temples",
    "Hindu temple VR",
    "spiritual VR experience",
    "temple aarti VR",
    "divine darshan",
    "virtual temple visit",
    "sacred places VR",
    "spiritual technology",
    "immersive temple experience",
    "360 degree temple tour",
    "virtual darshan",
    "online temple visit",
    "VR pilgrimage",
    "digital temple experience",
    "Hindu temples online",
    "spiritual VR app",
    "temple virtual tour",
    "sacred sites VR",
    "devotional VR",
    "temple 360 video",
    "virtual worship",
    "online aarti",
    "temple livestream",
    "spiritual immersion",
    "VR religious experience",
    "Hindu devotional VR",
    "temple darshan online",
    "sacred VR journey",
    "immersive spirituality",
    "virtual pilgrimage experience",
    "temple exploration VR",
    "divine experience VR",
    "spiritual meditation VR",
    "Hindu culture VR",
    "temple architecture VR",
    "religious tourism VR",
    "sanctuary VR",
    "temple prayers VR",
    "spiritual enlightenment VR",
    "devotional technology",
    "sacred space VR",
  ],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`}>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

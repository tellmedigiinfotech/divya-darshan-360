import type { Metadata } from "next"
import { getAllTemples } from "@/lib/blog-server"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"
import { BlogClient } from "./blog-client"
import { siteUrl } from "@/lib/seo-config"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// This will be populated at build time
const temples = getAllTemples()

/**
 * This page exported no metadata at all, so the hub for all 122 temple guides
 * inherited the generic site-wide title and description from the root layout —
 * the same ones the home page uses. It is the main entry point into our largest
 * body of content and the target of the /blog -> /blogs redirect, so it needs
 * its own.
 */
export const metadata: Metadata = {
	title: "Temple Darshan Blog | Guides to 120+ Hindu Temples",
	description:
		"Detailed pilgrimage guides to over 120 Hindu temples across India — the 12 Jyotirlingas, 18 Shakti Peethas, 8 Ashtavinayaka and major popular temples. Timings, darshan procedures, dress code, how to reach, special poojas and facilities.",
	keywords: [
		"temple guide India",
		"Jyotirlinga temples list",
		"Shakti Peetha temples",
		"Ashtavinayaka darshan",
		"temple timings India",
		"how to reach temple",
		"darshan booking",
		"pilgrimage guide",
	],
	alternates: {
		// /blog permanently redirects here (see next.config.mjs), so this is the
		// canonical form of the listing.
		canonical: `${siteUrl}/blogs`,
	},
	openGraph: {
		type: "website",
		url: `${siteUrl}/blogs`,
		siteName: "Divya Darshan 360",
		title: "Temple Darshan Blog | Guides to 120+ Hindu Temples",
		description:
			"Pilgrimage guides to over 120 Hindu temples across India — timings, darshan procedures, dress code, how to reach and special poojas.",
	},
	twitter: {
		card: "summary_large_image",
		title: "Temple Darshan Blog | Divya Darshan 360",
		description:
			"Pilgrimage guides to over 120 Hindu temples across India — timings, darshan, how to reach and more.",
	},
}

export default function BlogPage() {
  const categoryOrder = ["popular", "jyothirlinga", "shaktipeet", "Ashtavinayaka"];
  
  // Sort temples based on the category order
  const sortedTemples = [...temples].sort((a, b) => {
    const aIndex = categoryOrder.indexOf(a.category);
    const bIndex = categoryOrder.indexOf(b.category);
    const orderA = aIndex === -1 ? 999 : aIndex;
    const orderB = bIndex === -1 ? 999 : bIndex;
    return orderA - orderB;
  });

  const categories = ["all", ...categoryOrder];

  return (
    <main className="min-h-screen relative overflow-hidden">
      <BackgroundLotus className="top-[5%] right-[-10%]" size={600} opacity={0.15} duration={180} />
      <BackgroundLotus className="top-[35%] left-[-15%]" size={500} opacity={0.1} duration={220} delay={10} />
      <FloatingDiya className="absolute top-[15%] left-[10%] scale-150 hidden md:block" />
      <FloatingDiya className="absolute bottom-[20%] right-[15%] scale-125 hidden md:block" />

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary blur-[120px] animate-glow" />
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-secondary blur-[100px] animate-glow" />
      </div>

      {/* Header */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 py-2 text-muted-foreground hover:text-secondary-600 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 bg-primary/10 text-secondary-600 text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
            Sacred Temple Blogs
          </div>

          <h1 className="text-[2rem] md:text-[3rem] font-serif tracking-tighter mb-6 leading-tight">
            Temple <span className="text-secondary-600 italic">Darshan</span> Blog
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover the divine essence of sacred temples across India. Explore detailed information, 
            spiritual significance, and practical guidance for your pilgrimage journey.
          </p>

          <BlogClient temples={sortedTemples} categories={categories} />
        </div>
      </section>
    </main>
  )
}

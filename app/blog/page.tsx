import { getAllTemples } from "@/lib/blog-server"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"
import { BlogClient } from "./blog-client"

// This will be populated at build time
const temples = getAllTemples()

export default function BlogPage() {
  const categories = ["all", ...Array.from(new Set(temples.map(t => t.category)))]

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
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
            Sacred Temple Blogs
          </div>

          <h1 className="text-5xl md:text-7xl font-serif tracking-tighter mb-6 leading-tight">
            Temple <span className="text-primary italic">Darshan</span> Blog
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Discover the divine essence of sacred temples across India. Explore detailed information, 
            spiritual significance, and practical guidance for your pilgrimage journey.
          </p>

          <BlogClient temples={temples} categories={categories} />
        </div>
      </section>
    </main>
  )
}

import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MapPin, Clock, Phone, Calendar } from "lucide-react"
import { getAllTemples, getTempleByCategoryAndSlug } from "@/lib/blog-server"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"
import type { Metadata } from "next"
import { categoryDisplayMap } from "@/lib/blog-types"

interface PageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

export async function generateStaticParams() {
  const temples = getAllTemples()
  return temples.map((temple) => ({
    category: temple.category,
    slug: temple.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params
  const temple = getTempleByCategoryAndSlug(category, slug)
  
  if (!temple) {
    return {
      title: "Temple Not Found",
    }
  }

  return {
    title: temple.title,
    description: temple.excerpt,
    openGraph: {
      title: temple.title,
      description: temple.excerpt,
      images: [temple.imageUrl],
    },
  }
}

function formatContent(content: string): React.ReactElement {
  const sections: React.ReactElement[] = []
  const lines = content.split('\n').filter(line => line.trim())
  
  let currentSection: string[] = []
  let currentTitle = ""
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Check if this is a section title (numbered or lettered)
    const sectionMatch = line.match(/^(\d+\.|([A-Z]\.))\s*(.+)$/)
    
    if (sectionMatch && line.length < 100) {
      // Save previous section
      if (currentTitle && currentSection.length > 0) {
        sections.push(
          <div key={sections.length} className="mb-8">
            <h3 className="text-2xl font-serif mb-4 text-primary">{currentTitle}</h3>
            <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
              {currentSection.map((para, idx) => (
                <p key={idx} className="mb-4">{para}</p>
              ))}
            </div>
          </div>
        )
      }
      
      // Start new section
      currentTitle = line.replace(/^(\d+\.|([A-Z]\.))\s*/, '')
      currentSection = []
    } else if (line.length > 0) {
      currentSection.push(line)
    }
  }
  
  // Add last section
  if (currentTitle && currentSection.length > 0) {
    sections.push(
      <div key={sections.length} className="mb-8">
        <h3 className="text-2xl font-serif mb-4 text-primary">{currentTitle}</h3>
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
          {currentSection.map((para, idx) => (
            <p key={idx} className="mb-4">{para}</p>
          ))}
        </div>
      </div>
    )
  }
  
  // If no sections were created, just return paragraphs
  if (sections.length === 0) {
    const paragraphs = content.split('\n\n').filter(p => p.trim())
    return (
      <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="mb-4">{para.trim()}</p>
        ))}
      </div>
    )
  }
  
  return <>{sections}</>
}

export default async function TempleBlogPage({ params }: PageProps) {
  const { category, slug } = await params
  const temple = getTempleByCategoryAndSlug(category, slug)

  if (!temple) {
    notFound()
  }

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

      {/* Back Button */}
      <section className="relative pt-24 pb-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
              {categoryDisplayMap[temple.category] || temple.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-serif tracking-tighter mb-8 leading-tight">
            {temple.title}
          </h1>

          {/* Image Placeholder */}
          <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-primary/20 to-accent/20 border border-white/20">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-8xl opacity-30">🕉️</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/80 text-sm">Temple Image Placeholder - Replace with actual image URL</p>
            </div>
          </div>

          {/* Key Information */}
          <div className="glass rounded-3xl p-8 mb-12 border border-white/20">
            <div className="grid md:grid-cols-2 gap-6">
              {temple.mainDeity && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🕉️</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Main Deity</h3>
                    <p className="text-lg font-serif">{temple.mainDeity}</p>
                  </div>
                </div>
              )}

             

              {temple.timings && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Timings</h3>
                    <p className="text-lg">{temple.timings}</p>
                  </div>
                </div>
              )}

              {temple.contact && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact</h3>
                    <p className="text-lg">{temple.contact}</p>
                  </div>
                </div>
              )}

              {temple.address && (
                <div className="flex items-start gap-4 md:col-span-2">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Address</h3>
                    <p className="text-lg">{temple.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <article className="glass rounded-3xl p-8 md:p-12 border border-white/20">
            <div className="prose prose-invert max-w-none">
              {formatContent(temple.content)}
            </div>
          </article>

          {/* Call to Action */}
          <div className="mt-12 glass rounded-3xl p-8 border border-white/20 text-center">
            <h3 className="text-2xl font-serif mb-4">Experience Divine Darshan</h3>
            <p className="text-muted-foreground mb-6">
              Immerse yourself in the spiritual essence of this sacred temple through our 360° VR experience.
            </p>
            <Link
              href="https://play.google.com/store/apps/details?id=com.tellme.tellme360&pcampaignid=web_share"
              target="_blank"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Download Divya Darshan 360 App
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

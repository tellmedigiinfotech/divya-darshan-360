import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { siteUrl } from "@/lib/seo-config"
import { BackgroundLotus } from "@/components/background-lotus"
import { FloatingDiya } from "@/components/floating-diya"
import { DivineParticles } from "@/components/divine-particles"
import { VrHero } from "@/components/vr-purchase/vr-hero"
import { VrFeatureCards } from "@/components/vr-purchase/vr-feature-cards"
import { VrHeadsetOptions } from "@/components/vr-purchase/vr-headset-options"
import { VrHowItWorks } from "@/components/vr-purchase/vr-how-it-works"
import { VrTestimonials } from "@/components/vr-purchase/vr-testimonials"
import { VrFaq } from "@/components/vr-purchase/vr-faq"
import { vrFaqs } from "@/components/vr-purchase/vr-faqs-data"
import { VrFinalCta } from "@/components/vr-purchase/vr-final-cta"

const pageUrl = `${siteUrl}/vr-headset`

export const metadata: Metadata = {
    title: "Buy VR Headset | Bring Divine Darshan Home in VR",
    description:
        "Shop premium VR headsets to experience temples and spiritual journeys in immersive 360° virtual reality. Designed for elderly users, families, and devotees of Divya Darshan 360.",
    keywords: [
        "Buy VR Headset",
        "VR Headset India",
        "Spiritual VR Headset",
        "Temple VR Headset",
        "Divya Darshan VR",
        "360 Temple Headset",
        "Cardboard VR Headset",
        "Mobile VR Box",
        "VR for elderly",
        "Hindu Temple VR",
    ],
    alternates: {
        canonical: pageUrl,
    },
    openGraph: {
        type: "website",
        url: pageUrl,
        siteName: "Divya Darshan 360",
        title: "Buy VR Headset | Bring Divine Darshan Home in VR",
        description:
            "Premium VR headsets for immersive 360° temple darshan. Designed for devotees, families, and elderly users.",
        images: [
            {
                url: "/vr-divine-experience.png",
                width: 1200,
                height: 630,
                alt: "Divya Darshan 360 VR Headset",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Buy VR Headset | Divya Darshan 360",
        description: "Premium VR headsets for immersive 360° temple darshan.",
        images: ["/vr-divine-experience.png"],
    },
}

export default function VrHeadsetPage() {
    const productSchema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Mobile VR Box",
        description:
            "Cardboard-style mobile VR box that works with all Android and iOS smartphones — designed for immersive 360° temple darshan with the Divya Darshan 360 app.",
        brand: { "@type": "Brand", name: "Divya Darshan 360" },
        image: `${siteUrl}/vr-divine-experience.png`,
        offers: {
            "@type": "Offer",
            price: "599",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: pageUrl,
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "120",
            bestRating: "5",
            worstRating: "1",
        },
    }

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: vrFaqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
            },
        })),
    }

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: siteUrl,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Buy VR Headset",
                item: pageUrl,
            },
        ],
    }

    return (
        <main className="min-h-screen relative overflow-hidden selection:bg-primary/30">
            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            {/* Atmospheric background — matches landing page */}
            <DivineParticles />

            <FloatingDiya className="absolute top-[45%] right-[10%] scale-110 hidden md:block" />
            <FloatingDiya className="absolute bottom-[15%] left-[15%] scale-90 hidden md:block" />

            <BackgroundLotus className="top-[3%] right-[-10%]" size={600} opacity={0.15} duration={180} />
            <BackgroundLotus className="top-[40%] left-[-15%]" size={500} opacity={0.1} duration={220} delay={10} />
            <BackgroundLotus className="bottom-[10%] right-[-5%]" size={400} opacity={0.15} duration={200} delay={20} />

            {/* Back link */}
            <div className="relative z-20 max-w-7xl mx-auto px-6 pt-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </div>

            {/* Sections */}
            <VrHero />
            <VrFeatureCards />
            <VrHeadsetOptions />
            <VrHowItWorks />
            <VrTestimonials />
            <VrFaq />
            <VrFinalCta />
        </main>
    )
}

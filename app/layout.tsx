import type React from "react"
import type { Metadata } from "next"
import type { Viewport } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Script from "next/script"

import { seoKeywords, siteUrl, defaultMetadata } from "@/lib/seo-config"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/components/auth-provider"
import { AuthButton } from "@/components/auth-button"
import { SiteLogo } from "@/components/site-logo"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: defaultMetadata.title,
	description: defaultMetadata.description,
	keywords: seoKeywords,
	authors: [
		{
			name: "TellMe Digi Infotech Pvt Ltd",
			url: siteUrl,
		},
	],
	creator: "TellMe Digi Infotech Pvt Ltd",
	publisher: "TellMe Digi Infotech Pvt Ltd",
	category: "Spiritual Technology",
	classification: "Spiritual VR Application",
	generator: "Next.js",
	applicationName: "Divya Darshan 360",
	referrer: "origin-when-cross-origin",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: siteUrl,
		siteName: "Divya Darshan 360",
		title: "Divya Darshan 360 | Experience Divine VR Darshan",
		description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom. Experience divine darshan from anywhere in the world.",
		images: [
			{
				url: "/vr-divine-experience.png",
				width: 1200,
				height: 630,
				alt: "Divya Darshan 360 - Immersive VR Temple Experience",
				type: "image/png",
			},
			{
				url: "/spiritual-app-home-screen-darshan.jpg",
				width: 1200,
				height: 630,
				alt: "Divya Darshan 360 - Spiritual Home Screen",
				type: "image/jpeg",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Divya Darshan 360 | Experience Divine VR Darshan",
		description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom.",
		images: ["/vr-divine-experience.png"],
		creator: "@divyadarshan360",
		site: "@divyadarshan360",
	},
	alternates: {
		canonical: siteUrl,
	},
	icons: {
		icon: [
			{
				url: "/icons/favicon-16x16.png",
				sizes: "16x16",
				type: "image/png",
			},
			{
				url: "/icons/favicon-32x32.png",
				sizes: "32x32",
				type: "image/png",
			},
			{
				url: "/icons/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				url: "/icons/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				url: "/icons/favicon.ico",
				sizes: "any",
			},
		],
		apple: "/icons/apple-touch-icon.png",
		shortcut: "/icons/favicon.ico",
	},
	manifest: "/icons/site.webmanifest",
	other: {
		"mobile-web-app-capable": "yes",
		"apple-mobile-web-app-capable": "yes",
		"apple-mobile-web-app-status-bar-style": "black-translucent",
	},
	// Moved `colorScheme` and `themeColor` to `viewport` export (Next.js 16+)
	verification: {
		google: "UOrO6_Fuc9keS685cxQVjNrYxwPNoFkfCjTsaZXhizA",
	},
}

export const viewport: Viewport = {
	colorScheme: "dark light",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
		{ media: "(prefers-color-scheme: dark)", color: "#8b5cf6" },
	],
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	// const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://divyadarshan360.com" (Removed, using imported)


	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Divya Darshan 360",
		alternateName: "Divya Darshan",
		url: siteUrl,
		logo: `${siteUrl}/icons/android-chrome-512x512.png`,
		description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom.",
		areaServed: {
			"@type": "GeoShape",
			"box": "World"
		},
		foundingOrganization: {
			"@type": "Organization",
			name: "TellMe Digi Infotech Pvt Ltd",
		},
		//sameAs: [
		// Add social media URLs when available
		// "https://www.facebook.com/divyadarshan360",
		// "https://www.instagram.com/divyadarshan360",
		// "https://twitter.com/divyadarshan360",
		//],
		contactPoint: {
			"@type": "ContactPoint",
			contactType: "Customer Service",
			availableLanguage: ["English", "Hindi"],
		},
	}

	const softwareApplicationSchema = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Divya Darshan 360",
		applicationCategory: "EntertainmentApplication",
		operatingSystem: "Android",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		// aggregateRating removed — it asserted 4.5 from 100 ratings, a figure
		// not sourced from anywhere and not shown on the site. Same policy
		// problem as the Product rating on /vr-headset (see the note there).
		//
		// The app does have a real Play Store rating. To use it, surface it on
		// the page and populate this block from that number rather than a
		// hardcoded constant.
		description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom.",
		screenshot: `${siteUrl}/spiritual-app-home-screen-darshan.jpg`,
		url: "https://play.google.com/store/apps/details?id=com.tellme.tellme360",
		downloadUrl: "https://play.google.com/store/apps/details?id=com.tellme.tellme360",
	}

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Divya Darshan 360",
		url: siteUrl,
		description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom.",
		publisher: {
			"@type": "Organization",
			name: "TellMe Digi Infotech Pvt Ltd",
		},
		// potentialAction/SearchAction removed: it advertised a sitewide search
		// endpoint at /search?q=, and no such route exists. Declaring a sitelinks
		// searchbox that 404s is worse than declaring none. Reinstate this only
		// alongside a real search page.
	}

	// A BreadcrumbList used to be emitted here containing a single "Home" item,
	// on every page of the site. A one-item breadcrumb describes no trail, and
	// because it lived in the root layout it claimed the same trail for /blogs,
	// /vr-headset and every temple page alike. Breadcrumbs are per-page by
	// definition — /vr-headset builds a real two-level one itself, and the
	// static temple pages carry their own.

	return (
		<html lang="en" className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`}>
			<body className={`font-sans antialiased`}>

				{/* Google Analytics */}
				<Script
					src="https://www.googletagmanager.com/gtag/js?id=G-W2TMQG62D2"
					strategy="afterInteractive"
				/>
				<Script id="google-analytics" strategy="afterInteractive">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-W2TMQG62D2');
						// Google Ads — purchase conversion tracking.
						gtag('config', 'AW-11000001902');
						`}
				</Script>

				{/* Structured Data */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
				/>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
				/>
				{/*
				  VideoObject removed.

				  It was emitted from the root layout, so every page on the site
				  declared it — while the video itself is embedded on none of
				  them: <DemoVideo /> is commented out in app/page.tsx. Google
				  requires the video to be present on the page that marks it up.

				  The metadata was wrong besides. It described a product demo
				  ("Experience the Divine with Divya Darshan 360"), but video
				  6gDBq8M_JOg is "Ganges River, Varanasi Virtual Tour", uploaded
				  2019-04-25 — not the 2024-01-01T08:00:00+08:00 the block
				  claimed, and +08:00 is not India time either.

				  If the demo video goes back on the home page, add a VideoObject
				  to app/page.tsx (not here) with that video's real title,
				  description, uploadDate and duration.
				*/}
				{/*
				  FAQPage moved to components/faq-section.tsx.

				  It was emitted from the root layout, so every route on the site
				  declared the same three questions — including /vr-headset,
				  which publishes its own product FAQ, leaving two competing
				  FAQPage entities on one page. The FAQ content itself is only
				  rendered on the home page (FaqSection, used by app/page.tsx),
				  and Google requires FAQPage markup to sit on the page that
				  shows the answers.

				  It also listed three questions to the accordion's five, with
				  answers cut to about half their visible length. Both now come
				  from components/faq-data.ts.
				*/}

				<AuthProvider>
					<SiteLogo />
					<AuthButton />
					{children}
					<Footer />
				</AuthProvider>
				<Analytics />
			</body>
		</html>
	)
}

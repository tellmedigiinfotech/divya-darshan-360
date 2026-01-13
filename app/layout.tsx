import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Script from "next/script"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://divyadarshan360.com"

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "Divya Darshan 360 | Experience Divine VR Darshan",
		template: "%s | Divya Darshan 360",
	},
	description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom. Experience divine darshan from anywhere in the world.",
	keywords: [
		"Divya Darshan 360",
		"Divya Darshan",
		"Durlabh Darshan",
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
	colorScheme: "dark light",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#8b5cf6" },
		{ media: "(prefers-color-scheme: dark)", color: "#8b5cf6" },
	],
	//verification: {
	//google: "UOrO6_Fuc9keS685cxQVjNrYxwPNoFkfCjTsaZXhizA",
	//},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://divyadarshan360.com"

	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Divya Darshan 360",
		alternateName: "Divya Darshan",
		url: siteUrl,
		logo: `${siteUrl}/icons/android-chrome-512x512.png`,
		description: "Immersive 360° virtual reality experiences of sacred Hindu temples, aartis, and spiritual wisdom.",
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
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.5",
			ratingCount: "100",
			bestRating: "5",
			worstRating: "1",
		},
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
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: `${siteUrl}/search?q={search_term_string}`,
			},
			"query-input": "required name=search_term_string",
		},
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
		],
	}

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
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
				/>

				{children}
				<Analytics />
			</body>
		</html>
	)
}

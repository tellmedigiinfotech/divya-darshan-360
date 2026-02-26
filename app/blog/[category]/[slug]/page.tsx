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

function renderLineContent(line: string): React.ReactNode {
	return line
}

function formatContent(content: string): React.ReactElement {
	const sections: React.ReactElement[] = []
	const rawLines = content.split('\n')

	// First pass: identify top-level section boundaries
	// Top-level sections are numbered 1-29 and appear at the start of the line
	interface Section {
		titleNum: number
		title: string
		lines: string[]
	}

	const topSections: Section[] = []
	let currentSection: Section | null = null
	const introLines: string[] = []

	for (let i = 0; i < rawLines.length; i++) {
		const line = rawLines[i]
		const trimmed = line.trim()

		// Match top-level numbered sections: "1.", "2.", "3." etc. at the start
		const topSectionMatch = trimmed.match(/^(\d+)\.\s*(.*)$/)

		if (topSectionMatch) {
			const num = parseInt(topSectionMatch[1])

			// Heuristic to detect top-level sections:
			// Top-level section numbers should be sequential from the last top section
			const lastTopNum: number = currentSection
				? currentSection.titleNum
				: (topSections.length > 0 ? topSections[topSections.length - 1].titleNum : 0)

			// A line is a top-level section if:
			// 1. Its number is exactly lastTopNum + 1 (sequential)
			// 2. Or it's the first numbered item (num <= 2 and no sections yet)
			// 3. Or the number is close to sequential (within +2, catching minor gaps)
			const isTopLevel = (
				(topSections.length === 0 && currentSection === null && num <= 2) ||
				(num === lastTopNum + 1) ||
				(num > lastTopNum && num <= lastTopNum + 2 && num > 1 && lastTopNum > 0)
			)

			if (isTopLevel) {
				// Save previous section
				if (currentSection) {
					topSections.push(currentSection)
				}
				currentSection = {
					titleNum: num,
					title: trimmed,
					lines: [],
				}
				continue
			}
		}

		if (currentSection) {
			currentSection.lines.push(trimmed)
		} else {
			if (trimmed.length > 0) {
				introLines.push(trimmed)
			}
		}
	}

	// Push the last section
	if (currentSection) {
		topSections.push(currentSection)
	}

	// Skip intro lines - they contain temple name/URL already shown in hero section

	// Second pass: render each top-level section with proper sub-structure
	for (let s = 0; s < topSections.length; s++) {
		const section = topSections[s]
		const titleText = section.title.replace(/^\d+\.\s*/, '').trim()

		// Skip sections 1 and 2 (Name and Full Address) - already shown in Key Information card
		// Also skip sections that are purely about contact info shown above
		const lowerTitle = titleText.toLowerCase()
		if (
			section.titleNum <= 2 ||
			lowerTitle.startsWith('name:') ||
			lowerTitle.startsWith('full address') ||
			lowerTitle === 'name' ||
			lowerTitle === 'address'
		) {
			continue
		}

		const contentElements: React.ReactElement[] = []
		let i = 0

		while (i < section.lines.length) {
			const line = section.lines[i]

			// Skip empty lines
			if (line.length === 0) {
				i++
				continue
			}

			// Check for lettered sub-headings: "A.", "B.", "C." etc.
			const letteredMatch = line.match(/^([A-Z])\.\s*(.+)$/)
			if (letteredMatch && line.length < 150) {
				contentElements.push(
					<h4
						key={`sub-${s}-${i}`}
						className="text-lg font-semibold mt-6 mb-3 text-primary/80"
					>
						{letteredMatch[2]}
					</h4>
				)
				i++
				continue
			}

			// Check for numbered sub-items: "1.", "2.", "3." etc inside a section
			const numberedSubMatch = line.match(/^(\d+)\.\s*(.+)$/)
			if (numberedSubMatch) {
				// Collect consecutive numbered items as a styled list
				const listItems: { num: string; text: string; subItems: string[] }[] = []
				while (i < section.lines.length) {
					const currentLine = section.lines[i]
					if (currentLine.length === 0) { i++; continue }
					const numMatch = currentLine.match(/^(\d+)\.\s*(.+)$/)
					if (numMatch) {
						listItems.push({ num: numMatch[1], text: numMatch[2], subItems: [] })
						i++
						// Collect sub-items (starting with * or indented)
						while (i < section.lines.length) {
							const subLine = section.lines[i]
							if (subLine.length === 0) { i++; continue }
							if (
								subLine.startsWith('*') ||
								subLine.startsWith('   ') ||
								subLine.startsWith('\t')
							) {
								listItems[listItems.length - 1].subItems.push(
									subLine.replace(/^\s*\*\s*/, '').replace(/^\s+/, '')
								)
								i++
							} else {
								break
							}
						}
					} else {
						break
					}
				}

				if (listItems.length > 0) {
					contentElements.push(
						<ol
							key={`ol-${s}-${i}`}
							className="list-none space-y-4 my-4"
						>
							{listItems.map((item, idx) => (
								<li key={idx} className="flex flex-col">
									<div className="flex items-start gap-3">
										<span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/20 text-primary text-sm font-semibold flex items-center justify-center mt-0.5">
											{item.num}
										</span>
										<span className="text-foreground/90 font-medium">
											{renderLineContent(item.text)}
										</span>
									</div>
									{item.subItems.length > 0 && (
										<ul className="ml-10 mt-2 space-y-1.5">
											{item.subItems.map((sub, subIdx) => (
												<li
													key={subIdx}
													className="text-muted-foreground text-sm flex items-start gap-2"
												>
													<span className="text-primary/60 mt-1.5 flex-shrink-0">•</span>
													<span>{renderLineContent(sub)}</span>
												</li>
											))}
										</ul>
									)}
								</li>
							))}
						</ol>
					)
				}
				continue
			}

			// Check for bullet points: lines starting with "*"
			if (line.startsWith('*')) {
				const bulletItems: string[] = []
				while (i < section.lines.length && section.lines[i].startsWith('*')) {
					bulletItems.push(section.lines[i].replace(/^\*\s*/, ''))
					i++
				}
				contentElements.push(
					<ul key={`ul-${s}-${i}`} className="space-y-2 my-4 ml-1">
						{bulletItems.map((item, idx) => (
							<li
								key={idx}
								className="text-muted-foreground flex items-start gap-2.5"
							>
								<span className="text-primary mt-1.5 flex-shrink-0">•</span>
								<span>{renderLineContent(item)}</span>
							</li>
						))}
					</ul>
				)
				continue
			}

			// Check for sub-headings: lines that end with ":" and are relatively short
			if (line.endsWith(':') && line.length < 80 && !line.startsWith('*')) {
				contentElements.push(
					<h5
						key={`subh-${s}-${i}`}
						className="text-base font-semibold mt-5 mb-2 text-foreground/90"
					>
						{renderLineContent(line.replace(/:$/, ''))}
					</h5>
				)
				i++
				continue
			}

			// Regular paragraph line
			contentElements.push(
				<p key={`p-${s}-${i}`} className="mb-3 text-muted-foreground leading-relaxed">
					{renderLineContent(line)}
				</p>
			)
			i++
		}

		sections.push(
			<div key={`section-${s}`} className="mb-10">
				<h3 className="text-2xl font-serif mb-4 text-primary border-b border-primary/20 pb-2">
					{renderLineContent(titleText || section.title)}
				</h3>
				<div className="prose prose-invert max-w-none">
					{contentElements}
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

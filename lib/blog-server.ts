import "server-only"

import fs from "fs"
import path from "path"
import { categoryFolderMap } from "@/lib/blog-types"
import type { TempleBlog } from "@/lib/blog-types"

/** True when the post's pre-rendered page actually exists on disk. */
function hasRenderedPage(temple: TempleBlog): boolean {
	const folder = categoryFolderMap[temple.category] || temple.category
	return fs.existsSync(
		path.join(process.cwd(), "public", "blog", "temple", folder, temple.slug, "index.html")
	)
}

/**
 * Posts listed in blogs.json that have a rendered page.
 *
 * An entry without an index.html would otherwise be advertised in sitemap.xml
 * and linked from /blogs while serving a 404 — which Google reports as
 * "Submitted URL not found" and which wastes crawl budget. Deriving the list
 * from what actually exists keeps the sitemap honest as posts are added.
 */
export function getAllTemples(): TempleBlog[] {
	const metadataPath = path.join(process.cwd(), "public", "blog", "blogs.json")
	if (!fs.existsSync(metadataPath)) {
		return []
	}

	try {
		const content = fs.readFileSync(metadataPath, "utf-8")
		const temples = JSON.parse(content) as TempleBlog[]
		const published = temples.filter(hasRenderedPage)
		const skipped = temples.length - published.length
		if (skipped > 0) {
			console.warn(
				`blogs.json lists ${skipped} post(s) with no rendered page; excluded from listings and sitemap.`
			)
		}
		return published
	} catch (e) {
		console.error("Error parsing blogs.json", e)
		return []
	}
}

export function getTempleByCategoryAndSlug(category: string, slug: string): TempleBlog | null {
	const temples = getAllTemples()
	return temples.find((temple) => temple.slug === slug && temple.category === category) || null
}

export function getTempleBySlug(slug: string): TempleBlog | null {
	const temples = getAllTemples()
	return temples.find((temple) => temple.slug === slug) || null
}

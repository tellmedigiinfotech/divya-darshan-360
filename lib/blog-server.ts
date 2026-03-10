import "server-only"

import fs from "fs"
import path from "path"
import type { TempleBlog } from "@/lib/blog-types"

export function getAllTemples(): TempleBlog[] {
	const metadataPath = path.join(process.cwd(), "public", "blog", "blogs.json")
	if (!fs.existsSync(metadataPath)) {
		return []
	}

	try {
		const content = fs.readFileSync(metadataPath, "utf-8")
		return JSON.parse(content) as TempleBlog[]
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

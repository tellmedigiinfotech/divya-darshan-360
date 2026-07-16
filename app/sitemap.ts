import fs from "fs"
import path from "path"
import { MetadataRoute } from "next"
import { getAllTemples } from "@/lib/blog-server"
import { categoryFolderMap } from "@/lib/blog-types"
import { siteUrl } from "@/lib/seo-config"

/**
 * Real last-modified date for a temple post, read from its pre-rendered
 * index.html on disk.
 *
 * Reporting `new Date()` for every URL told Google all 122 posts changed on
 * every sitemap fetch, which teaches it to distrust our lastmod entirely.
 * Falling back to the build date only happens if the file can't be stat'ed.
 */
function templeLastModified(categoryFolder: string, slug: string, fallback: Date): Date {
	try {
		const file = path.join(process.cwd(), "public", "blog", "temple", categoryFolder, slug, "index.html")
		return fs.statSync(file).mtime
	} catch {
		return fallback
	}
}

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = siteUrl
	const currentDate = new Date()

	// Main pages with their SEO priorities
	const routes: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/privacy`,
			lastModified: currentDate,
			changeFrequency: "monthly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/blogs`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/vr-headset`,
			lastModified: currentDate,
			changeFrequency: "weekly",
			priority: 0.9,
		},
	]

	// Add all blog posts
	const temples = getAllTemples()
	const blogRoutes: MetadataRoute.Sitemap = temples.map((temple) => {
		const categoryFolder = categoryFolderMap[temple.category] || temple.category
		return {
			url: `${baseUrl}/blog/temple/${categoryFolder}/${temple.slug}`,
			lastModified: templeLastModified(categoryFolder, temple.slug, currentDate),
			changeFrequency: "monthly",
			priority: 0.6,
		}
	})

	return [...routes, ...blogRoutes]
}

import { MetadataRoute } from 'next'
import { getAllTemples } from '@/lib/blog-server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://divyadarshan360.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl
  const currentDate = new Date()

  // Main pages with their SEO priorities
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  // Add all blog posts
  const temples = getAllTemples()
  const blogRoutes: MetadataRoute.Sitemap = temples.map((temple) => ({
    url: `${baseUrl}/blog/${temple.category}/${temple.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...routes, ...blogRoutes]
}

import { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/seo-config'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/privacy',
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}

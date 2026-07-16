/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true
  },
  async rewrites() {
    return [
      {
        source: '/blog/temple/:category/:slug',
        destination: '/blog/temple/:category/:slug/index.html',
      },
    ]
  },
  // Legacy URLs Google still crawls. Search Console reported these as
  // "Not found (404)" while the same content is live at the current path, so
  // each 404 threw away the history Google had for that page. The category
  // list is an explicit allowlist: a bare `:category` would also match
  // /blog/temple/<x> and redirect it to /blog/temple/temple/<x>.
  async redirects() {
    const CATEGORIES = 'popular|jyothirlinga|shaktipeet|ashtavinayak'
    return [
      // Misspelt folder: ashtwinayak -> ashtavinayak.
      {
        source: '/blog/temple/ashtwinayak/:slug',
        destination: '/blog/temple/ashtavinayak/:slug',
        permanent: true,
      },
      {
        source: '/blog/ashtwinayak/:slug',
        destination: '/blog/temple/ashtavinayak/:slug',
        permanent: true,
      },
      // Old structure /blog/<category>/<slug> -> /blog/temple/<category>/<slug>.
      {
        source: `/blog/:category(${CATEGORIES})/:slug`,
        destination: '/blog/temple/:category/:slug',
        permanent: true,
      },
      // Old listing + privacy paths.
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
    ]
  },
}

export default nextConfig

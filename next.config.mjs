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
}

export default nextConfig

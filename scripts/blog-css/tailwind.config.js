/**
 * Tailwind config for the static temple blog pages under public/blog/temple/.
 *
 * These 124 pages are hand-authored HTML served straight from public/, outside
 * the Next.js app and its Tailwind v4 pipeline. They previously pulled in
 * https://cdn.tailwindcss.com — the Play CDN, which ships a full JIT compiler to
 * the browser and generates their stylesheet on every page load. Tailwind
 * documents it as a development-only tool, and it sat on our highest-value SEO
 * pages, on mobile, in India.
 *
 * This config exists to compile the same output once, ahead of time, into
 * public/blog/assets/blog.css.
 *
 * Regenerate after editing any blog HTML or the component layer:
 *   cd frontend && npm run build:blog-css
 *
 * Content globs are relative to the frontend/ directory, so the command must be
 * run from there (the npm script handles that).
 *
 * Pinned to Tailwind v3 deliberately: these pages were authored against the v3
 * Play CDN and use v3 config semantics. The Next app is on v4 and is entirely
 * separate — do not merge the two.
 */
module.exports = {
	content: [
		'./public/blog/temple/**/*.html',
		// The carousel toggles carousel__slide--active / carousel__dot--active
		// from JS. Those classes appear nowhere in the markup, so without this
		// glob Tailwind would purge them and the carousel would stop advancing.
		'./public/blog/assets/*.js',
	],
	theme: {
		extend: {
			// Mirrors public/blog/assets/tailwind-config.js, which the CDN read at
			// runtime. That file is now unused and removed from the pages.
			colors: {
				primary: '#e23d00',
				accent: '#d4af37',
			},
			fontFamily: {
				sans: ['Geist Sans', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
			},
			animation: {
				'divine-glow': 'divine-glow 20s ease-in-out infinite alternate',
				glow: 'glow 4s ease-in-out infinite',
				'spin-slow': 'spin-slow 180s linear infinite',
				'spin-rev': 'spin-rev 270s linear infinite',
				// Diya animations live in public/blog/assets/diya.css.
			},
			keyframes: {
				'divine-glow': {
					'0%': { backgroundPosition: '50% 0%, 100% 100%, 0% 100%, center top' },
					'100%': { backgroundPosition: '50% 10%, 90% 90%, 10% 90%, center top' },
				},
				glow: {
					'0%, 100%': { opacity: '0.3', filter: 'blur(40px)' },
					'50%': { opacity: '0.6', filter: 'blur(60px)' },
				},
				'spin-slow': {
					from: { transform: 'rotate(0)' },
					to: { transform: 'rotate(360deg)' },
				},
				'spin-rev': {
					from: { transform: 'rotate(360deg)' },
					to: { transform: 'rotate(0)' },
				},
			},
		},
	},
	plugins: [],
}

tailwind.config = {
	theme: {
		extend: {
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
				'glow': 'glow 4s ease-in-out infinite',
				'spin-slow': 'spin-slow 180s linear infinite',
				'spin-rev': 'spin-rev 270s linear infinite',
				// Diya animations are now in diya.css
			},
			keyframes: {
				'divine-glow': {
					'0%': { backgroundPosition: '50% 0%, 100% 100%, 0% 100%, center top' },
					'100%': { backgroundPosition: '50% 10%, 90% 90%, 10% 90%, center top' },
				},
				'glow': {
					'0%, 100%': { opacity: '0.3', filter: 'blur(40px)' },
					'50%': { opacity: '0.6', filter: 'blur(60px)' },
				},
				'spin-slow': {
					'from': { transform: 'rotate(0)' },
					'to': { transform: 'rotate(360deg)' },
				},
				'spin-rev': {
					'from': { transform: 'rotate(360deg)' },
					'to': { transform: 'rotate(0)' },
				},
				// Diya keyframes are now in diya.css
			}
		}
	}
};

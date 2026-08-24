/**
 * Home page FAQ content — single source for both the rendered accordion
 * (components/faq-section.tsx) and the FAQPage JSON-LD (app/page.tsx).
 *
 * These were previously two separate copies: the accordion rendered five
 * questions while the JSON-LD in the root layout declared three, with answers
 * abridged to roughly half their visible length. Google requires FAQPage markup
 * to match the content actually shown on the page, so the two drifting apart is
 * a correctness problem, not just duplication.
 *
 * Mirrors the pattern already used for the product page in
 * components/vr-purchase/vr-faqs-data.ts.
 */
export interface Faq {
	question: string
	answer: string
}

export const homeFaqs: Faq[] = [
	{
		question: "What is Divya Darshan 360?",
		answer:
			"Divya Darshan 360 is a premier virtual reality platform that offers immersive 360-degree experiences of sacred Hindu temples. It allows you to perform digital darshan of famous pilgrimages like Jyotirlingas and Shakti Peethas from the comfort of your home, using high-fidelity VR technology.",
	},
	{
		question: "Is the Divya Darshan 360 app free?",
		answer:
			"Yes, the Divya Darshan 360 app is free to download on the Google Play Store. We offer a range of free darshan experiences. Some premium, exclusive content or special pooja services may have specific offerings, but the core experience of connecting with the divine is accessible to everyone.",
	},
	{
		question: "Do I need a VR headset to use the app?",
		answer:
			"No, a VR headset is not strictly required. You can experience the 360-degree videos directly on your smartphone by moving your device around (Magic Window mode). However, for the most immersive experience, we recommend using a Google Cardboard or any standard mobile VR headset.",
	},
	{
		question: "Which temples are covered in the app?",
		answer:
			"We feature a growing library of sacred sites, including the 12 Jyotirlingas, Ashtavinayak temples, major Shakti Peethas, and Shirdi Sai Baba temple. We regularly update our collection with new exclusive darshans from across India.",
	},
	{
		question: "How is this different from YouTube 360 videos?",
		answer:
			"Unlike standard YouTube videos, Divya Darshan 360 offers a dedicated, ad-free spiritual environment. Our content is professionally captured with high-end proprietary equipment for superior clarity and is often filmed during exclusive access periods, providing views that are otherwise difficult for the general public to witness.",
	},
]

/** FAQPage JSON-LD built from the same content the page renders. */
export function buildFaqJsonLd(faqs: Faq[] = homeFaqs) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((f) => ({
			"@type": "Question",
			name: f.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: f.answer,
			},
		})),
	}
}

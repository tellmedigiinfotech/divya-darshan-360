export interface TempleBlog {
	slug: string
	title: string
	category: string
	content: string
	htmlContent: string // Pre-rendered article HTML from index.html
	cssContent: string // Inline CSS styles from index.html
	excerpt: string
	imageUrl: string // Placeholder for now
	images: string[] // Array of actual image URLs
	location?: string
	mainDeity?: string
	subDeities?: string[]
	timings?: string
	address?: string
	contact?: string
}

// Reverse mapping for display
export const categoryDisplayMap: Record<string, string> = {
	astavinayaka: "Astavinayaka Temples",
	jyothirlinga: "Jyothirlinga Temples",
	popular: "Popular Temples",
	shaktipeet: "Shaktipeet Temples",
}

// Mapping from category slug (in blogs.json) to actual folder name on disk
export const categoryFolderMap: Record<string, string> = {
	astavinayaka: "ashtwinayak",
	jyothirlinga: "jyothirlinga",
	popular: "popular",
	shaktipeet: "shaktipeet",
}


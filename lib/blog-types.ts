export interface TempleBlog {
  slug: string
  title: string
  category: string
  content: string
  excerpt: string
  imageUrl: string // Placeholder for now
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
  popular: "Popular Famous Temples",
  shaktipeet: "Shaktipeet Temples",
}


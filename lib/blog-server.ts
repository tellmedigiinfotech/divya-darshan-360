import "server-only"

import fs from "fs"
import path from "path"
import type { TempleBlog } from "@/lib/blog-types"

const blogBasePath = path.join(process.cwd(), "blog")

// Category mapping (folder name -> url slug)
const categoryMap: Record<string, string> = {
  "Astavinayaka Temple": "astavinayaka",
  "Jyothirlinga Temples": "jyothirlinga",
  "Popular Famous Temple": "popular",
  "Shaktipeet Temple(51)": "shaktipeet",
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function extractMetadata(content: string): Partial<TempleBlog> {
  const metadata: Partial<TempleBlog> = {}

  // Extract title (first non-empty line)
  const lines = content.split("\n").filter((line) => line.trim())
  if (lines.length > 0) {
    metadata.title = lines[0].replace(/\.docx\.txt$/, "").trim()
  }

  // Extract main deity
  const mainDeityMatch =
    content.match(/A\.\s*Main Deity[:\s]*([^\n]+)/i) || content.match(/MAIN DEITY[:\s]*([^\n]+)/i)
  if (mainDeityMatch) {
    metadata.mainDeity = mainDeityMatch[1].trim()
  }

  // Extract address
  const addressMatch =
    content.match(/Full Address[:\s]*([^\n]+(?:\n[^\n]+)*?)(?:\n\n|\n[A-Z]|$)/i) ||
    content.match(/Address[:\s]*([^\n]+(?:\n[^\n]+)*?)(?:\n\n|\n[A-Z]|$)/i)
  if (addressMatch) {
    metadata.address = addressMatch[1].trim().replace(/\n/g, ", ")
  }

  // Extract location from title or address
  const locationMatch = content.match(/- ([^,]+(?:,\s*[^,]+)*)$/) || metadata.address?.match(/([^,]+(?:,\s*[^,]+)*)$/)
  if (locationMatch) {
    metadata.location = locationMatch[1].trim()
  }

  // Extract contact
  const contactMatch = content.match(/Phone[:\s]*([^\n]+)/i) || content.match(/Contact[:\s]*([^\n]+)/i)
  if (contactMatch) {
    metadata.contact = contactMatch[1].trim()
  }

  // Extract timings
  const timingsMatch = content.match(/Opening Time[:\s]*([^\n]+)/i)
  if (timingsMatch) {
    metadata.timings = timingsMatch[1].trim()
  }

  // Create excerpt (first 200 chars of meaningful content)
  const meaningfulContent = content
    .split("\n")
    .filter((line) => line.trim() && !line.match(/^\d+\./) && !line.match(/^[A-Z]\./) && line.length > 20)
    .slice(0, 3)
    .join(" ")

  metadata.excerpt = meaningfulContent.substring(0, 200).trim() + "..."

  return metadata
}

export function getAllTemples(): TempleBlog[] {
  const temples: TempleBlog[] = []

  if (!fs.existsSync(blogBasePath)) {
    return temples
  }

  const categories = fs
    .readdirSync(blogBasePath, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)

  for (const categoryFolder of categories) {
    const categoryPath = path.join(blogBasePath, categoryFolder)
    const categorySlug = categoryMap[categoryFolder] || slugify(categoryFolder)

    const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".txt"))

    for (const file of files) {
      const filePath = path.join(categoryPath, file)
      const content = fs.readFileSync(filePath, "utf-8")
      const metadata = extractMetadata(content)

      const fileName = file.replace(/\.docx\.txt$/, "").trim()
      const slug = slugify(fileName)

      temples.push({
        slug,
        title: metadata.title || fileName,
        category: categorySlug,
        content,
        excerpt: metadata.excerpt || content.substring(0, 200) + "...",
        imageUrl: `/images/temples/${categorySlug}/${slug}.jpg`, // Placeholder path
        location: metadata.location,
        mainDeity: metadata.mainDeity,
        address: metadata.address,
        contact: metadata.contact,
        timings: metadata.timings,
      })
    }
  }

  return temples
}

export function getTempleByCategoryAndSlug(category: string, slug: string): TempleBlog | null {
  const temples = getAllTemples()
  return temples.find((temple) => temple.slug === slug && temple.category === category) || null
}


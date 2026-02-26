"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, MapPin, Clock, Filter } from "lucide-react"
import { categoryDisplayMap, type TempleBlog } from "@/lib/blog-types"

interface BlogClientProps {
  temples: TempleBlog[]
  categories: string[]
}

export function BlogClient({ temples, categories }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const filteredTemples = useMemo(() => {
    return temples.filter(temple => {
      const matchesSearch = 
        temple.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        temple.mainDeity?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = selectedCategory === "all" || temple.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, temples])

  return (
    <>
      {/* Search and Filter */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search temples by name, location, or deity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass border border-white/20 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          <Filter className="w-5 h-5 text-muted-foreground" />
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "glass border border-white/20 hover:border-primary/30 text-foreground"
              }`}
            >
              {category === "all" 
                ? "All Temples" 
                : categoryDisplayMap[category] || category}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <section className="relative pb-32 px-6 mt-16">
        <div className="max-w-7xl mx-auto">
          {filteredTemples.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No temples found matching your search.</p>
            </div>
          ) : (
            <>
              <p className="text-muted-foreground mb-8 text-center">
                Showing {filteredTemples.length} of {temples.length} temples
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTemples.map((temple, index) => (
                  <motion.div
                    key={temple.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/blog/${temple.category}/${temple.slug}`}>
                      <article className="group h-full glass rounded-3xl overflow-hidden border border-white/20 hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/10">
                        {/* Image */}
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-6xl opacity-30">🕉️</div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4">
                            <span className="inline-block px-3 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium backdrop-blur-sm">
                              {categoryDisplayMap[temple.category] || temple.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h2 className="text-2xl font-serif mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {temple.title}
                          </h2>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                            {temple.excerpt}
                          </p>

                          <div className="space-y-2 text-sm text-muted-foreground">
                            {temple.mainDeity && (
                              <div className="flex items-center gap-2">
                                <span className="text-primary">●</span>
                                <span className="line-clamp-1">{temple.mainDeity}</span>
                              </div>
                            )}
                            {temple.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span className="line-clamp-1">{temple.location}</span>
                              </div>
                            )}
                            {temple.timings && (
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="line-clamp-1">{temple.timings}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/10">
                            <span className="text-primary text-sm font-medium group-hover:gap-2 transition-all inline-flex items-center gap-1">
                              Read More
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

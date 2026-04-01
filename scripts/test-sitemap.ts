import { getAllTemples } from "./lib/blog-server.js"
import { categoryFolderMap } from "./lib/blog-types.js"

const temples = getAllTemples()
console.log(`Found ${temples.length} temples.`)
if (temples.length > 0) {
    console.log("Sample URL:")
    const temple = temples[0]
    console.log(`https://divyadarshan360.com/blog/temple/${categoryFolderMap[temple.category] || temple.category}/${temple.slug}/index.html`)
}

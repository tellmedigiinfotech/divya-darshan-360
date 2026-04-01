const fs = require('fs');
const path = require('path');

const baseDir = path.join(process.cwd(), 'public', 'blog', 'temple');

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file === 'index.html') {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Fix canonical URL
    const canonicalRegex = /<link rel="canonical" href="([^"]+)\/index\.html" \/>/g;
    if (canonicalRegex.test(content)) {
        content = content.replace(canonicalRegex, '<link rel="canonical" href="$1" />');
        changed = true;
    }

    // Fix alternate hreflang URL
    const alternateRegex = /<link rel="alternate" hreflang="en" href="([^"]+)\/index\.html" \/>/g;
    if (alternateRegex.test(content)) {
        content = content.replace(alternateRegex, '<link rel="alternate" hreflang="en" href="$1" />');
        changed = true;
    }

    // Fix og:url
    const ogUrlRegex = /<meta property="og:url" content="([^"]+)\/index\.html" \/>/g;
    if (ogUrlRegex.test(content)) {
        content = content.replace(ogUrlRegex, '<meta property="og:url" content="$1" />');
        changed = true;
    }
    
    // Fix JSON-LD URL
    const jsonLdUrlRegex = /"url":"([^"]+)\/index\.html"/g;
    if (jsonLdUrlRegex.test(content)) {
         content = content.replace(jsonLdUrlRegex, '"url":"$1"');
         changed = true;
    }
    
    // Fix JSON-LD @id
    const jsonLdIdRegex = /"@id":"([^"]+)\/index\.html"/g;
    if (jsonLdIdRegex.test(content)) {
         content = content.replace(jsonLdIdRegex, '"@id":"$1"');
         changed = true;
    }
    
    // Fix JSON-LD Breadcrumb List
    const jsonLdBreadcrumbRegex = /"item":"([^"]+)\/index\.html"/g;
    if (jsonLdBreadcrumbRegex.test(content)) {
         content = content.replace(jsonLdBreadcrumbRegex, '"item":"$1"');
         changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

walkDir(baseDir);
console.log("Done updating canonical tags.");

const fs = require('fs');
const path = require('path');

const blogDir = path.join(process.cwd(), 'public/blog/temple');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const homeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';

const backSectionPattern = /<section class="back-section">[\s\S]*?<div class="container">[\s\S]*?<a href="\/blog" class="back-link">[\s\S]*?Back to Blog[\s\S]*?<\/a>[\s\S]*?<\/div>[\s\S]*?<\/section>/g;

const replacement = `<section class="back-section">
			<div class="container flex justify-between items-center">
				<a href="/blogs" class="back-link">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
					Back to Blog
				</a>
				<a href="/" class="back-link">
					${homeSvg}
					Home
				</a>
			</div>
		</section>`;

let count = 0;

walk(blogDir, (filePath) => {
    if (path.basename(filePath) === 'index.html') {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('back-section') && content.includes('Back to Blog') && !content.includes('href="/"')) {
            const newContent = content.replace(backSectionPattern, replacement);
            if (newContent !== content) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`[UPDATED] ${filePath}`);
                count++;
            }
        }
    }
});

console.log(`\nUpdated ${count} files.`);

#!/usr/bin/env python3
"""
Blog HTML Generator for Divya Darshan 360
Reads .txt files from blog subdirectories and generates HTML blog pages
using the established temple blog template.
"""

import os
import re
import sys
import html
import glob
import json

# Fix Windows console encoding
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BLOG_ROOT = os.path.dirname(os.path.abspath(__file__))
OUTPUT_ROOT = os.path.join(os.path.dirname(BLOG_ROOT), "public", "blog", "temple")
IMAGES_ROOT = os.path.join(os.path.dirname(BLOG_ROOT), "public", "blog", "images")

# Category mapping
CATEGORY_MAP = {
    "Astavinayaka Temple": "Astavinayaka Temples",
    "Jyothirlinga Temples": "Jyotirlinga Temples",
    "Popular Famous Temple": "Popular Famous Temples",
    "Shaktipeet Temple(51)": "Shaktipeeth Temples",
}

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def extract_temple_name(content):
    """Extract temple name from first line."""
    lines = content.strip().split('\n')
    return lines[0].strip() if lines else "Temple"

def extract_field(content, patterns):
    """Extract a field value using multiple regex patterns."""
    for pat in patterns:
        m = re.search(pat, content, re.IGNORECASE | re.MULTILINE)
        if m:
            return m.group(1).strip()
    return ""

def extract_main_deity(content):
    patterns = [
        r'Main\s+Deity\s*[:\-]\s*(.+?)(?:\r?\n)',
        r'A\.\s*Main\s+Deity\s*[:\-]\s*(.+?)(?:\r?\n)',
    ]
    return extract_field(content, patterns)

def extract_address(content):
    patterns = [
        r'Full\s+Address\s*[:\-]\s*(.+?)(?:\r?\n)',
        r'Address\s*[:\-]\s*(.+?)(?:\r?\n)',
    ]
    return extract_field(content, patterns)

def extract_contact(content):
    patterns = [
        r'Contact\s+Numbers?\s*[:\-]\s*(.+?)(?:\r?\n)',
        r'Phone\s*[:\-]\s*(.+?)(?:\r?\n)',
    ]
    return extract_field(content, patterns)

def extract_timings(content):
    patterns = [
        r'Opening\s*[:\-]\s*(.+?)(?:\r?\n)',
        r'General\s*[:\-]?\s*\n\s*\*?\s*Opening\s*[:\-]\s*(.+?)(?:\r?\n)',
    ]
    val = extract_field(content, patterns)
    closing = extract_field(content, [r'Closing\s*[:\-]\s*(.+?)(?:\r?\n)'])
    if val and closing:
        return f"Opening: {val} | Closing: {closing}"
    if val:
        return val
    return "Please check temple website for timings"

def escape(text):
    return html.escape(text, quote=True)

def is_sub_item_header(text):
    """Check if a line is a sub-item header (short title ending with colon) that shouldn't be a separate section."""
    stripped = text.strip()
    if not stripped.endswith(':'):
        return False
    # Remove trailing colon for length check
    title_text = stripped.rstrip(':')
    # Sub-item headers are typically short (< 60 chars) and don't start with numbered questions
    if len(title_text) > 60:
        return False
    # Common sub-item patterns
    sub_patterns = [
        'Dormitories', 'Rooms', 'Guest Houses', 'On-Spot Booking', 'Advance Booking',
        'Car Parking', 'Mini Bus Parking', 'Two-Wheeler Parking',
        'Regular Prasadam', 'Annadanam', 'Laddu', 'Puliyodarai', 'Sweet Pongal',
        'Dry Fruits', 'Other Traditional', 'Direct Donations', 'Bank Transfer',
        'Online Donations', 'Online Pooja Booking', 'General Temple Maintenance',
        'Historical Background', 'Layout and Structure', 'Gopurams', 'Mandapas',
        'Vimanas', 'Hydrological Feature', 'Cultural and Religious',
        'Inscriptions and Historical', 'Sacred Geometry', 'Pancha Bhoota',
        'Perennial Water', 'Spiritual Energy', 'Architectural Grandeur',
        'Window with Nine', 'Symbolism in Architecture',
        'Element of Water', 'Sacred Geometry and Design', 'Meditative Spaces',
        'Dress Code', 'Language and Guides', 'Participating in Rituals',
        'Best Time to Visit', 'Photography and Electronics',
        'Visit the Temple Office', 'Provide Details', 'Fill Out',
        'Check Lost and Found', 'Follow-Up', 'Security Assistance',
        'Inform Security', 'Use Public Address',
        'Recognition', 'Priority Access', 'Accommodations',
        'Invitation to Special', 'Special Poojas and Rituals',
        'Goddess Akilandeswari', 'Unique Rituals',
        'Panguni Uthiram', 'Aadi Fridays', 'Navarathri', 'Aipasi Annabishekam',
        'Vaikasi Visakam', 'Mahashivaratri', 'Pradosham', 'Sankatahara',
        'Pournami', 'Amavasya', 'Poojas and Rituals', 'Charitable Activities',
        'Donations', 'General Temple', 'Annadanam',
    ]
    return any(title_text.startswith(p) for p in sub_patterns) or len(title_text) < 40

def parse_content_to_sections(content):
    """Parse the text content into HTML sections."""
    lines = content.strip().split('\n')
    sections_html = []
    current_section_title = None
    current_lines = []

    # Skip the first few lines (name, URL, basic info already extracted)
    skip_initial = True
    question_pattern = re.compile(r'^\s*\d+[\.\)]\s+')

    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_lines:
                current_lines.append("")
            continue

        # Detect section headers (numbered questions or key headers)
        is_header = False
        if question_pattern.match(stripped):
            is_header = True
        elif stripped.endswith('?') and len(stripped) > 20:
            is_header = True
        elif any(stripped.startswith(kw) for kw in [
            'Opening & Closing', 'Entry Fees', 'Location-', 'Special Poojas',
            'Dress Code', 'Electronic Gadgets', 'Photography', 'LIFT', 'Elevator',
            'WheelChair', 'Vehicle Pooja', 'Parking', 'Prashad', 'Prasad',
            'Donations', 'Construction', 'Accommodation', 'Services',
            'Call to action', 'Annual Event', 'Monthly Event', 'Condensed Information',
            'Making Donations', 'Reporting Lost', 'Missing Group', 'Registration',
            'Carry home', 'Temple Prashad', 'Special entry', 'Restrictions',
        ]):
            is_header = True

        # If it looks like a header but it's actually a short sub-item, keep it in current section
        if is_header and not skip_initial and is_sub_item_header(stripped) and current_section_title:
            # Treat as a sub-heading within the current section rather than a new section
            # Add it as a line with a special marker
            current_lines.append(stripped)
            is_header = False
        elif is_header and not skip_initial:
            # Save previous section
            if current_section_title and current_lines:
                sections_html.append(build_section(current_section_title, current_lines))
            current_section_title = stripped
            # Clean the title
            current_section_title = re.sub(r'^\s*\d+[\.\)]\s*', '', current_section_title).strip()
            current_lines = []
        else:
            skip_initial = False
            current_lines.append(stripped)

    # Last section
    if current_section_title and current_lines:
        sections_html.append(build_section(current_section_title, current_lines))
    elif current_lines and not sections_html:
        # If no sections detected, wrap everything as one section
        sections_html.append(build_section("About the Temple", current_lines))

    return '\n'.join(sections_html)

def build_section(title, lines):
    """Build an HTML section from title and lines."""
    indent = '\t\t\t\t\t'
    h = [f'{indent}<div class="section">']
    h.append(f'{indent}  <h3 class="section__title">{escape(title)}</h3>')

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Sub-headers (lines ending with ':' that are short)
        if line.endswith(':') and len(line) < 80 and not line.startswith('*'):
            h.append(f'{indent}  <h5 class="section__sub-b">{escape(line.rstrip(":"))}</h5>')
            i += 1
            continue

        # Bullet points
        if line.startswith('*') or line.startswith('\u2022') or line.startswith('-'):
            bullet_items = []
            while i < len(lines):
                bl = lines[i].strip()
                if bl.startswith('*') or bl.startswith('\u2022') or bl.startswith('-'):
                    text = re.sub(r'^[\*\u2022\-]\s*', '', bl)
                    if text:
                        bullet_items.append(text)
                    i += 1
                elif not bl:
                    i += 1
                    break
                else:
                    break
            if bullet_items:
                h.append(f'{indent}  <ul class="bullet-list">')
                for item in bullet_items:
                    h.append(f'{indent}    <li>{escape(item)}</li>')
                h.append(f'{indent}  </ul>')
            continue

        # Numbered items
        num_match = re.match(r'^(\d+)\.\s+(.+)', line)
        if num_match:
            num_items = []
            while i < len(lines):
                nl = lines[i].strip()
                nm = re.match(r'^(\d+)\.\s+(.+)', nl)
                if nm:
                    num_items.append((nm.group(1), nm.group(2)))
                    i += 1
                elif not nl:
                    i += 1
                    break
                else:
                    break
            if num_items:
                h.append(f'{indent}  <ol class="num-list">')
                for num, text in num_items:
                    h.append(f'{indent}    <li><span class="num-list__badge">{num}</span><span class="num-list__text">{escape(text)}</span></li>')
                h.append(f'{indent}  </ol>')
            continue

        # Regular paragraph
        h.append(f'{indent}  <p>{escape(line)}</p>')
        i += 1

    h.append(f'{indent}</div>')
    return '\n'.join(h)

def find_images(category_dir, slug):
    """Find matching images for a blog in the images directory."""
    images_dir = os.path.join(IMAGES_ROOT, category_dir)
    found_images = []
    if not os.path.isdir(images_dir):
        return found_images
    for f in sorted(os.listdir(images_dir)):
        fname_lower = f.lower()
        # Match slug_1.ext or slug_2.ext
        if fname_lower.startswith(slug + '_'):
            ext = os.path.splitext(f)[1].lower()
            if ext in ('.jpg', '.jpeg', '.png', '.gif', '.webp'):
                # Build web-accessible path (relative to public/)
                web_path = f'/blog/images/{category_dir}/{f}'
                found_images.append(web_path)
    return found_images


def build_image_carousel(images, temple_name):
    """Build an image carousel HTML for the given images."""
    esc = escape
    if not images:
        # Fallback: show placeholder
        return f'''\t\t\t\t<div class="img-placeholder">
\t\t\t\t\t<div class="img-placeholder__icon">🕉️</div>
\t\t\t\t\t<div class="img-placeholder__gradient"></div>
\t\t\t\t\t<div class="img-placeholder__text">Image of {esc(temple_name)}</div>
\t\t\t\t</div>'''

    if len(images) == 1:
        # Single image - no carousel needed
        return f'''\t\t\t\t<div class="carousel">
\t\t\t\t\t<div class="carousel__track">
\t\t\t\t\t\t<div class="carousel__slide carousel__slide--active">
\t\t\t\t\t\t\t<img src="{esc(images[0])}" alt="{esc(temple_name)}" loading="lazy" />
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>'''

    # Multiple images - full carousel
    slides = []
    dots = []
    for i, img in enumerate(images):
        active = ' carousel__slide--active' if i == 0 else ''
        slides.append(f'\t\t\t\t\t\t<div class="carousel__slide{active}" data-index="{i}">')
        slides.append(f'\t\t\t\t\t\t\t<img src="{esc(img)}" alt="{esc(temple_name)} - Image {i+1}" loading="lazy" />')
        slides.append(f'\t\t\t\t\t\t</div>')
        dot_active = ' carousel__dot--active' if i == 0 else ''
        dots.append(f'<span class="carousel__dot{dot_active}" data-index="{i}"></span>')

    slides_html = '\n'.join(slides)
    dots_html = ''.join(dots)
    total = len(images)

    return f'''\t\t\t\t<div class="carousel" data-total="{total}">
\t\t\t\t\t<div class="carousel__track">
{slides_html}
\t\t\t\t\t</div>
\t\t\t\t\t<button class="carousel__btn carousel__btn--prev" aria-label="Previous image" onclick="carouselNav(this,-1)">
\t\t\t\t\t\t<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
\t\t\t\t\t</button>
\t\t\t\t\t<button class="carousel__btn carousel__btn--next" aria-label="Next image" onclick="carouselNav(this,1)">
\t\t\t\t\t\t<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
\t\t\t\t\t</button>
\t\t\t\t\t<div class="carousel__dots">{dots_html}</div>
\t\t\t\t\t<div class="carousel__counter"><span class="carousel__current">1</span> / {total}</div>
\t\t\t\t</div>'''


def generate_html(temple_name, category, main_deity, address, contact, timings, content_html, image_html):
    """Generate the full HTML page."""
    esc = escape
    desc_short = f"{temple_name} - Complete guide with timings, location, how to reach, poojas, and more."

    return f'''<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
	<title>{esc(temple_name)} | Divya Darshan 360</title>
	<meta name="description" content="{esc(desc_short)}" />
	<meta property="og:title" content="{esc(temple_name)}" />
	<meta property="og:description" content="{esc(desc_short)}" />
	<meta property="og:type" content="article" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="{esc(temple_name)}" />
	<meta name="twitter:description" content="{esc(desc_short)}" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css" />
	<link rel="stylesheet" href="/blog/assets/blog-style.css" />
</head>

<body>
	<main class="main">
		<div class="glow-wrap"><div class="glow-blob glow-blob--primary"></div><div class="glow-blob glow-blob--accent"></div></div>
		<div class="lotus-bg lotus-bg--1"><div class="lotus-spin"><svg viewBox="0 0 800 800"><defs><linearGradient id="ls1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#c2560a" stop-opacity="0.6"/><stop offset="50%" stop-color="#d4af37" stop-opacity="0.8"/><stop offset="100%" stop-color="#c2560a" stop-opacity="0.6"/></linearGradient></defs>{"".join(f'<g transform="rotate({a} 400 400)"><path d="M400 100C430 150 440 220 400 300C360 220 370 150 400 100Z" fill="none" stroke="url(#ls1)" stroke-width="1.5" opacity=".6"/></g>' for a in range(0,360,int(360/16)))}</svg></div></div>
		<div class="lotus-bg lotus-bg--2"><div class="lotus-spin-rev"><svg viewBox="0 0 800 800">{"".join(f'<g transform="rotate({a} 400 400)"><path d="M400 180C440 230 450 300 400 380C350 300 360 230 400 180Z" fill="none" stroke="#d4af37" stroke-width="2" opacity=".5"/><circle cx="400" cy="175" r="4" fill="#d4af37" opacity=".6"/></g>' for a in range(0,360,30))}</svg></div></div>
		<div class="diya-wrap diya-wrap--left"><div class="diya diya--left"><div class="diya__inner"><div class="diya__ambient"></div><div class="diya__outer-glow"></div><div class="diya__inner-glow"></div><div class="diya__flame-outer"></div><div class="diya__flame-inner"></div><div class="diya__flame-tip"></div><div class="diya__wick"></div><div class="diya__oil"><div class="diya__oil-sheen"></div></div><div class="diya__bowl"><div class="diya__bowl-shine"></div><div class="diya__bowl-highlight"></div><div class="diya__bowl-dots"><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div></div></div><div class="diya__spout"></div><div class="diya__stem"></div><div class="diya__plate"></div><div class="diya__reflection"></div></div></div></div>
		<div class="diya-wrap diya-wrap--right"><div class="diya diya--right"><div class="diya__inner"><div class="diya__ambient"></div><div class="diya__outer-glow"></div><div class="diya__inner-glow"></div><div class="diya__flame-outer"></div><div class="diya__flame-inner"></div><div class="diya__flame-tip"></div><div class="diya__wick"></div><div class="diya__oil"><div class="diya__oil-sheen"></div></div><div class="diya__bowl"><div class="diya__bowl-shine"></div><div class="diya__bowl-highlight"></div><div class="diya__bowl-dots"><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div></div></div><div class="diya__spout"></div><div class="diya__stem"></div><div class="diya__plate"></div><div class="diya__reflection"></div></div></div></div>

		<section class="back-section">
			<div class="container">
				<a href="/blog" class="back-link">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
					Back to Blog
				</a>
			</div>
		</section>

		<section class="hero">
			<div class="container">
				<div><span class="badge">{esc(category)}</span></div>
				<h1 class="hero-title">{esc(temple_name)}</h1>

			{image_html}

				<div class="glass key-info">
					<div class="key-info__grid">
						<div class="key-info__item">
							<div class="key-info__icon">🕉️</div>
							<div>
								<div class="key-info__label">Main Deity</div>
								<div class="key-info__value">{esc(main_deity) if main_deity else 'Please visit temple website'}</div>
							</div>
						</div>
						<div class="key-info__item">
							<div class="key-info__icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
							<div>
								<div class="key-info__label">Contact</div>
								<div class="key-info__value key-info__value--sans">{esc(contact) if contact else 'Please visit temple website'}</div>
							</div>
						</div>
						<div class="key-info__item key-info__item--full">
							<div class="key-info__icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
							<div>
								<div class="key-info__label">Full Address</div>
								<div class="key-info__value key-info__value--sans">{esc(address) if address else 'Please visit temple website for address'}</div>
							</div>
						</div>
					</div>
				</div>

				<article class="glass article">
{content_html}
				</article>

				<div class="glass cta-section">
					<h3>Experience Divine Darshan</h3>
					<p>Immerse yourself in the spiritual essence of this sacred temple through our 360° VR experience.</p>
					<a href="https://play.google.com/store/apps/details?id=com.tellme.tellme360&pcampaignid=web_share" target="_blank" class="cta-btn">
						Download Divya Darshan 360 App
					</a>
				</div>
			</div>
		</section>
	</main>

	<script src="/blog/assets/blog-script.js"></script>
</body>
</html>'''


def process_txt_file(txt_path, category_dir):
    """Process a single .txt file and generate HTML."""
    category = CATEGORY_MAP.get(category_dir, category_dir)

    with open(txt_path, 'r', encoding='utf-8', errors='replace') as f:
        content = f.read()

    temple_name = extract_temple_name(content)
    main_deity = extract_main_deity(content)
    address = extract_address(content)
    contact = extract_contact(content)
    timings = extract_timings(content)

    # Generate content HTML
    content_html = parse_content_to_sections(content)

    # Create output directory and slug
    filename = os.path.splitext(os.path.basename(txt_path))[0]
    # Remove .docx from the name if present
    filename = filename.replace('.docx', '')
    slug = slugify(filename)

    # Find images for this blog
    images = find_images(category_dir, slug)
    image_html = build_image_carousel(images, temple_name)
    img_count = len(images)

    # Generate full HTML
    full_html = generate_html(temple_name, category, main_deity, address, contact, timings, content_html, image_html)

    output_dir = os.path.join(OUTPUT_ROOT, slug)
    os.makedirs(output_dir, exist_ok=True)

    output_path = os.path.join(output_dir, "index.html")
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_html)

    # Build excerpt for metadata
    article_text = re.sub(r'<[^>]*>', ' ', content_html)
    article_text = re.sub(r'\s+', ' ', article_text).strip()
    excerpt = article_text[:200] + "..." if len(article_text) > 200 else article_text

    # Map category to display category slug correctly
    category_slug_map = {
        "Astavinayaka Temples": "astavinayaka",
        "Jyotirlinga Temples": "jyothirlinga",
        "Jyothirlinga Temples": "jyothirlinga",
        "Popular Famous Temples": "popular",
        "Shaktipeet Temples": "shaktipeet",
        "Shaktipeeth Temples": "shaktipeet"
    }
    category_slug = category_slug_map.get(category, slugify(category))

    # Location derivation
    location = ""
    title_loc_match = re.search(r'[-–]\s*(.+)$', temple_name)
    if title_loc_match:
        location = title_loc_match.group(1).strip()
    elif address:
        parts = address.split(",")
        if len(parts) >= 2:
            location = ",".join(parts[-2:]).strip()
        else:
            location = address

    # Metadata dict
    metadata = {
        "slug": slug,
        "title": temple_name,
        "category": category_slug,
        "excerpt": excerpt,
        "imageUrl": images[0] if images else f"/blog/images/{category_dir}/{slug}.jpg",
        "images": images,
        "mainDeity": main_deity,
        "address": address,
        "contact": contact,
        "timings": timings,
        "location": location
    }

    return output_path, img_count, metadata


def main():
    """Main function to process all blog text files."""
    categories = [
        "Astavinayaka Temple",
        "Jyothirlinga Temples",
        "Popular Famous Temple",
        "Shaktipeet Temple(51)",
    ]

    total = 0
    success = 0
    errors = []
    images_found = 0
    all_metadata = []

    for cat in categories:
        cat_dir = os.path.join(BLOG_ROOT, cat)
        if not os.path.isdir(cat_dir):
            print(f"[WARNING] Directory not found: {cat}")
            continue

        txt_files = glob.glob(os.path.join(cat_dir, "*.txt"))
        print(f"\n[PROCESSING] {cat} ({len(txt_files)} files)...")

        for txt_file in sorted(txt_files):
            total += 1
            try:
                output, img_count, metadata = process_txt_file(txt_file, cat)
                success += 1
                all_metadata.append(metadata)
                img_info = f" ({img_count} images)" if img_count > 0 else " (no images)"
                if img_count > 0:
                    images_found += img_count
                print(f"  [OK] {os.path.basename(txt_file)} -> {os.path.basename(os.path.dirname(output))}/index.html{img_info}")
            except Exception as e:
                errors.append((txt_file, str(e)))
                print(f"  [ERROR] {os.path.basename(txt_file)}: {e}")

    # Write metadata JSON
    metadata_path = os.path.join(os.path.dirname(OUTPUT_ROOT), "blogs.json")
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(all_metadata, f, indent=2, ensure_ascii=False)
    print(f"\nGenerated metadata: {metadata_path}")

    print(f"\n{'='*60}")
    print(f"Results: {success}/{total} files processed successfully")
    print(f"Images: {images_found} images found and used in carousels")
    if errors:
        print(f"[ERRORS] {len(errors)} errors:")
        for path, err in errors:
            print(f"   - {os.path.basename(path)}: {err}")
    print(f"\nOutput directory: {OUTPUT_ROOT}")


if __name__ == "__main__":
    main()

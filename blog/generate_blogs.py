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

        if is_header and not skip_initial:
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
    h = [f'<div class="section">']
    h.append(f'  <h3 class="section__title">{escape(title)}</h3>')

    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line:
            i += 1
            continue

        # Sub-headers
        if line.endswith(':') and len(line) < 80 and not line.startswith('*'):
            h.append(f'  <h5 class="section__sub-b">{escape(line.rstrip(":"))}</h5>')
            i += 1
            continue

        # Bullet points
        if line.startswith('*') or line.startswith('•') or line.startswith('-'):
            bullet_items = []
            while i < len(lines):
                bl = lines[i].strip()
                if bl.startswith('*') or bl.startswith('•') or bl.startswith('-'):
                    text = re.sub(r'^[\*\•\-]\s*', '', bl)
                    if text:
                        bullet_items.append(text)
                    i += 1
                elif not bl:
                    i += 1
                    break
                else:
                    break
            if bullet_items:
                h.append('  <ul class="bullet-list">')
                for item in bullet_items:
                    h.append(f'    <li>{escape(item)}</li>')
                h.append('  </ul>')
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
                h.append('  <ol class="num-list">')
                for num, text in num_items:
                    h.append(f'    <li><span class="num-list__badge">{num}</span><span class="num-list__text">{escape(text)}</span></li>')
                h.append('  </ol>')
            continue

        # Regular paragraph
        h.append(f'  <p>{escape(line)}</p>')
        i += 1

    h.append('</div>')
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
\t\t\t\t\t<div class="img-placeholder__icon">&#128341;</div>
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
\t<meta charset="UTF-8" />
\t<meta name="viewport" content="width=device-width,initial-scale=1.0" />
\t<title>{esc(temple_name)} | Divya Darshan 360</title>
\t<meta name="description" content="{esc(desc_short)}" />
\t<meta property="og:title" content="{esc(temple_name)}" />
\t<meta property="og:description" content="{esc(desc_short)}" />
\t<meta property="og:type" content="article" />
\t<meta name="twitter:card" content="summary_large_image" />
\t<meta name="twitter:title" content="{esc(temple_name)}" />
\t<meta name="twitter:description" content="{esc(desc_short)}" />
\t<link rel="preconnect" href="https://fonts.googleapis.com" />
\t<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
\t<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
\t<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/dist/fonts/geist-sans/style.min.css" />
\t<style>
\t\t*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
\t\t:root{{--primary:#c2560a;--primary-light:rgba(194,86,10,0.1);--primary-20:rgba(194,86,10,0.2);--primary-30:rgba(194,86,10,0.3);--accent:#d4af37;--bg:#fdfaf5;--fg:#3b2510;--muted:#8a7260;--card-bg:rgba(255,255,255,0.6);--border:rgba(255,255,255,0.2);--border-solid:#e8ddd0;--radius:24px;--max-w:896px;--font-sans:'Geist Sans','Geist',system-ui,-apple-system,sans-serif;--font-serif:'Playfair Display',Georgia,'Times New Roman',serif}}
\t\thtml{{scroll-behavior:smooth}}
\t\tbody{{font-family:var(--font-sans);background-color:var(--bg);color:var(--fg);line-height:1.7;font-size:16px;-webkit-font-smoothing:antialiased;min-height:100vh;position:relative;overflow-x:hidden;background-image:radial-gradient(circle at 50% 0%,rgba(194,86,10,0.1),transparent 70%),radial-gradient(circle at 100% 100%,rgba(212,175,55,0.1),transparent 60%),radial-gradient(circle at 0% 100%,rgba(253,250,245,0.5),transparent 60%),url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");background-size:100% 100%,100% 100%,100% 100%,200px 200px;background-attachment:fixed;animation:divine-glow 20s ease-in-out infinite alternate}}
\t\t@keyframes divine-glow{{0%{{background-position:50% 0%,100% 100%,0% 100%,center top}}100%{{background-position:50% 10%,90% 90%,10% 90%,center top}}}}
\t\ta{{color:var(--primary);text-decoration:none;transition:color .3s}}a:hover{{color:#a04508}}img{{max-width:100%;display:block}}
\t\t.glow-wrap{{position:absolute;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:1280px;height:100%;pointer-events:none;opacity:.18;z-index:0}}
\t\t.glow-blob{{position:absolute;border-radius:50%}}
\t\t.glow-blob--primary{{top:80px;left:40px;width:384px;height:384px;background:var(--primary);filter:blur(120px);animation:glow 4s ease-in-out infinite}}
\t\t.glow-blob--accent{{bottom:160px;right:40px;width:320px;height:320px;background:var(--accent);filter:blur(100px);animation:glow 4s ease-in-out infinite}}
\t\t@keyframes glow{{0%,100%{{opacity:.3;filter:blur(40px)}}50%{{opacity:.6;filter:blur(60px)}}}}
\t\t.lotus-bg{{position:fixed;pointer-events:none;z-index:0}}.lotus-bg--1{{top:5%;right:-10%;width:500px;height:500px;opacity:.12}}.lotus-bg--2{{top:35%;left:-15%;width:420px;height:420px;opacity:.08}}.lotus-bg svg{{width:100%;height:100%}}.lotus-spin{{animation:spin-slow 180s linear infinite}}.lotus-spin-rev{{animation:spin-rev 270s linear infinite}}@keyframes spin-slow{{from{{transform:rotate(0)}}to{{transform:rotate(360deg)}}}}@keyframes spin-rev{{from{{transform:rotate(360deg)}}to{{transform:rotate(0)}}}}
\t\t.diya-wrap{{position:fixed;pointer-events:none;z-index:0}}.diya-wrap--left{{top:15%;left:10%}}.diya-wrap--right{{bottom:20%;right:15%}}.diya{{animation:diya-float 5s ease-in-out infinite}}.diya--left{{transform-origin:center center;scale:1.5}}.diya--right{{transform-origin:center center;scale:1.25}}.diya__inner{{position:relative;width:64px;height:80px}}.diya__ambient{{position:absolute;top:0;left:50%;transform:translateX(-50%);width:96px;height:96px;background:rgba(251,146,60,0.10);border-radius:50%;filter:blur(24px)}}.diya__outer-glow{{position:absolute;top:-6px;left:50%;transform:translateX(-50%);width:40px;height:40px;background:rgba(251,146,60,0.30);border-radius:50%;filter:blur(16px);animation:glow-pulse 2s ease-in-out infinite}}.diya__inner-glow{{position:absolute;top:-2px;left:50%;transform:translateX(-50%);width:28px;height:28px;background:rgba(250,204,21,0.20);border-radius:50%;filter:blur(10px);animation:glow-pulse 1.5s ease-in-out infinite}}.diya__flame-outer{{position:absolute;top:0;left:50%;transform:translateX(-50%);width:20px;height:40px;background:linear-gradient(to top,#ea580c 0%,#f97316 30%,#fb923c 60%,#fdba74 100%);clip-path:ellipse(50% 100% at 50% 100%);box-shadow:0 0 20px rgba(249,115,22,.6),0 0 40px rgba(251,146,60,.3);animation:flame-outer .8s ease-in-out infinite}}.diya__flame-inner{{position:absolute;top:12px;left:50%;transform:translateX(-50%);width:12px;height:24px;background:linear-gradient(to top,#fbbf24 0%,#fde047 40%,#fef9c3 70%,#fff 100%);clip-path:ellipse(50% 100% at 50% 100%);box-shadow:0 0 10px rgba(253,224,71,.8);animation:flame-inner .6s ease-in-out infinite 0.1s}}.diya__flame-tip{{position:absolute;top:16px;left:50%;transform:translateX(-50%);width:6px;height:12px;background:#fff;border-radius:50%;box-shadow:0 0 8px rgba(255,255,255,.9),0 0 15px rgba(254,249,195,.6);animation:flame-tip .4s ease-in-out infinite}}.diya__wick{{position:absolute;top:32px;left:50%;transform:translateX(-50%);width:2px;height:8px;border-radius:2px;background:linear-gradient(to bottom,#1f2937,#111827)}}.diya__oil{{position:absolute;top:38px;left:50%;transform:translateX(-50%);width:40px;height:12px;background:linear-gradient(to bottom,rgba(120,53,15,.8),rgba(69,26,3,1));border-radius:50%;overflow:hidden}}.diya__oil-sheen{{position:absolute;inset:0;background:linear-gradient(to right,transparent,rgba(217,119,6,.3),transparent);animation:oil-shimmer 3s ease-in-out infinite}}.diya__bowl{{position:absolute;top:44px;left:50%;transform:translateX(-50%);width:56px;height:24px;border-radius:0 0 50% 50%/0 0 100% 100%;background:linear-gradient(135deg,#d97706 0%,#b45309 25%,#92400e 50%,#78350f 75%,#451a03 100%);box-shadow:inset 0 -2px 4px rgba(0,0,0,.3),inset 0 2px 4px rgba(251,191,36,.2);overflow:hidden}}.diya__bowl-shine{{position:absolute;top:0;left:0;right:0;height:8px;background:linear-gradient(to right,transparent,rgba(251,191,36,.4),transparent)}}.diya__bowl-highlight{{position:absolute;top:4px;left:4px;width:8px;height:8px;background:rgba(251,191,36,.3);border-radius:50%;filter:blur(2px)}}.diya__bowl-dots{{position:absolute;bottom:4px;left:0;right:0;display:flex;justify-content:center;gap:4px}}.diya__bowl-dot{{width:4px;height:4px;border-radius:50%;background:rgba(251,191,36,.3)}}.diya__spout{{position:absolute;top:44px;right:-4px;width:12px;height:8px;border-radius:0 50% 50% 0;background:linear-gradient(90deg,#b45309,#d97706)}}.diya__stem{{position:absolute;top:67px;left:50%;transform:translateX(-50%);width:32px;height:8px;background:linear-gradient(180deg,#92400e 0%,#78350f 50%,#451a03 100%);border-radius:0 0 8px 8px;box-shadow:0 2px 4px rgba(0,0,0,.3)}}.diya__plate{{position:absolute;top:74px;left:50%;transform:translateX(-50%);width:40px;height:4px;background:linear-gradient(180deg,#78350f,#451a03);border-radius:0 0 4px 4px}}.diya__reflection{{position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:64px;height:12px;border-radius:50%;background:radial-gradient(ellipse,rgba(251,146,60,.3) 0%,transparent 70%);animation:glow-pulse 2s ease-in-out infinite}}
\t\t@keyframes diya-float{{0%,100%{{transform:translateY(0) rotate(-1deg)}}50%{{transform:translateY(-12px) rotate(1deg)}}}}@keyframes flame-outer{{0%,100%{{transform:translateX(-50%) scaleY(1) scaleX(0.7)}}25%{{transform:translateX(-50%) scaleY(1.15) scaleX(0.65)}}50%{{transform:translateX(-50%) scaleY(0.9) scaleX(0.75)}}75%{{transform:translateX(-50%) scaleY(1.1) scaleX(0.68)}}}}@keyframes flame-inner{{0%,100%{{transform:translateX(-50%) scaleY(1) scaleX(0.6)}}25%{{transform:translateX(-50%) scaleY(1.2) scaleX(0.55)}}50%{{transform:translateX(-50%) scaleY(0.85) scaleX(0.65)}}75%{{transform:translateX(-50%) scaleY(1.1) scaleX(0.58)}}}}@keyframes flame-tip{{0%,100%{{transform:translateX(-50%) scaleY(1);opacity:0.9}}25%{{transform:translateX(-50%) scaleY(1.3);opacity:1}}50%{{transform:translateX(-50%) scaleY(0.8);opacity:0.7}}75%{{transform:translateX(-50%) scaleY(1.15);opacity:0.95}}}}@keyframes glow-pulse{{0%,100%{{transform:translateX(-50%) scale(1);opacity:0.3}}50%{{transform:translateX(-50%) scale(1.2);opacity:0.5}}}}@keyframes oil-shimmer{{0%,100%{{transform:translateX(-20px)}}50%{{transform:translateX(20px)}}}}
\t\t.glass{{background:var(--card-bg);backdrop-filter:blur(40px);-webkit-backdrop-filter:blur(40px);border:1px solid var(--border);box-shadow:0 8px 32px rgba(0,0,0,.05)}}.main{{min-height:100vh;position:relative;overflow:hidden}}.container{{max-width:var(--max-w);margin:0 auto;padding:0 24px}}
\t\t.back-section{{padding:96px 24px 32px}}.back-link{{display:inline-flex;align-items:center;gap:8px;color:var(--muted);font-size:.9rem;font-weight:500;transition:color .3s}}.back-link:hover{{color:var(--primary)}}.back-link svg{{width:16px;height:16px}}
\t\t.hero{{padding:0 24px 64px;position:relative;z-index:1}}.badge{{display:inline-block;padding:8px 18px;border-radius:9999px;background:var(--primary-light);color:var(--primary);font-size:.85rem;font-weight:500;border:1px solid var(--primary-20);margin-bottom:24px}}.hero-title{{font-family:var(--font-serif);font-size:clamp(2.2rem,5vw,3.6rem);letter-spacing:-.03em;line-height:1.15;margin-bottom:32px;color:var(--fg)}}
\t\t.key-info{{border-radius:var(--radius);padding:32px;margin-bottom:48px}}.key-info__grid{{display:grid;grid-template-columns:1fr 1fr;gap:24px}}.key-info__item{{display:flex;align-items:flex-start;gap:16px}}.key-info__item--full{{grid-column:1/-1}}.key-info__icon{{width:48px;height:48px;border-radius:50%;background:var(--primary-20);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1.3rem}}.key-info__icon svg{{width:20px;height:20px;color:var(--primary);stroke:var(--primary);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}}.key-info__label{{font-size:.82rem;font-weight:500;color:var(--muted);margin-bottom:2px}}.key-info__value{{font-size:1.05rem;font-family:var(--font-serif);color:var(--fg)}}.key-info__value--sans{{font-family:var(--font-sans)}}
\t\t.article{{border-radius:var(--radius);padding:32px;margin-bottom:48px}}@media(min-width:768px){{.article{{padding:48px}}}}
\t\t.section{{margin-bottom:40px}}.section__title{{font-family:var(--font-serif);font-size:1.5rem;font-weight:600;color:var(--primary);margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--primary-20)}}.section__sub-a{{font-size:1.1rem;font-weight:600;color:rgba(194,86,10,.75);margin:24px 0 12px}}.section__sub-b{{font-size:1rem;font-weight:600;color:var(--fg);opacity:.9;margin:20px 0 8px}}.section p{{color:var(--muted);margin-bottom:12px;line-height:1.8}}
\t\t.num-list{{list-style:none;padding:0;margin:16px 0}}.num-list li{{display:flex;flex-direction:column;margin-bottom:16px}}.num-list__row{{display:flex;align-items:flex-start;gap:12px}}.num-list__badge{{flex-shrink:0;width:28px;height:28px;border-radius:50%;background:var(--primary-20);color:var(--primary);font-size:.85rem;font-weight:600;display:flex;align-items:center;justify-content:center;margin-top:2px}}.num-list__text{{color:var(--fg);opacity:.9;font-weight:500}}
\t\t.bullet-list{{list-style:none;padding:0;margin:16px 0}}.bullet-list li{{display:flex;align-items:flex-start;gap:10px;color:var(--muted);margin-bottom:8px}}.bullet-list li::before{{content:'\\2022';color:var(--primary);margin-top:1px;flex-shrink:0;font-weight:bold}}
\t\t.cta-section{{border-radius:var(--radius);padding:32px;text-align:center;margin-bottom:48px}}.cta-section h3{{font-family:var(--font-serif);font-size:1.5rem;margin-bottom:16px}}.cta-section p{{color:var(--muted);margin-bottom:24px}}.cta-btn{{display:inline-flex;align-items:center;gap:8px;padding:16px 32px;background:var(--primary);color:#fff;border-radius:9999px;font-weight:500;letter-spacing:.02em;font-family:var(--font-serif);transition:all .3s;border:none;cursor:pointer;font-size:1rem;box-shadow:0 8px 24px rgba(194,86,10,.2)}}.cta-btn:hover{{background:#a04508;transform:scale(1.05);color:#fff}}
\t\t\t\t.img-placeholder{{position:relative;aspect-ratio:16/9;border-radius:var(--radius);overflow:hidden;margin-bottom:48px;background:linear-gradient(135deg,var(--primary-20),rgba(212,175,55,.15));border:1px solid var(--border)}}.img-placeholder__icon{{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:6rem;opacity:.25}}.img-placeholder__gradient{{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.5),transparent)}}.img-placeholder__text{{position:absolute;bottom:24px;left:24px;right:24px;color:rgba(255,255,255,.7);font-size:.85rem}}
\t\t\t\t.carousel{{position:relative;border-radius:var(--radius);overflow:hidden;margin-bottom:48px;background:#1a1008;border:1px solid var(--border)}}.carousel__track{{position:relative;width:100%;aspect-ratio:16/9}}.carousel__slide{{position:absolute;inset:0;opacity:0;transition:opacity .6s ease-in-out}}.carousel__slide--active{{opacity:1;z-index:1}}.carousel__slide img{{width:100%;height:100%;object-fit:cover}}.carousel__btn{{position:absolute;top:50%;z-index:5;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:rgba(0,0,0,.45);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .3s;box-shadow:0 4px 12px rgba(0,0,0,.3)}}.carousel__btn:hover{{background:var(--primary);border-color:var(--primary);transform:translateY(-50%) scale(1.1)}}.carousel__btn--prev{{left:16px}}.carousel__btn--next{{right:16px}}.carousel__dots{{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);z-index:5;display:flex;gap:8px}}.carousel__dot{{width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.35);cursor:pointer;transition:all .3s;border:1px solid rgba(255,255,255,.2)}}.carousel__dot--active{{background:var(--primary);transform:scale(1.25);border-color:var(--primary);box-shadow:0 0 8px rgba(194,86,10,.5)}}.carousel__counter{{position:absolute;top:16px;right:16px;z-index:5;background:rgba(0,0,0,.5);backdrop-filter:blur(8px);padding:6px 14px;border-radius:9999px;color:rgba(255,255,255,.85);font-size:.8rem;font-weight:500;border:1px solid rgba(255,255,255,.1)}}
\t\t@media(max-width:768px){{.key-info__grid{{grid-template-columns:1fr}}.back-section{{padding:72px 18px 24px}}.hero{{padding:0 18px 40px}}.diya-wrap{{display:none}}.lotus-bg{{display:none}}}}
\t\t.site-nav{{position:fixed;top:0;left:0;right:0;z-index:100;background:#fff;border-bottom:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.05)}}.nav-inner{{max-width:1280px;margin:0 auto;padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:64px}}.nav-logo img{{height:32px;width:auto;transition:transform .3s}}.nav-logo img:hover{{transform:scale(1.05)}}.nav-links{{display:flex;align-items:center;gap:32px}}.nav-links a{{color:#334155;font-weight:600;font-size:.95rem;transition:all .3s;text-decoration:none}}.nav-links a:hover{{color:#AF7423;transform:scale(1.05)}}.nav-btn{{display:inline-block !important;padding:8px 20px !important;background:#AF7423 !important;color:#fff !important;border-radius:8px !important;font-weight:600 !important;box-shadow:0 1px 3px rgba(0,0,0,.1);transition:all .3s !important}}.nav-btn:hover{{background:#9a621d !important;color:#fff !important}}.mobile-toggle{{display:none;background:none;border:none;cursor:pointer;padding:8px;color:#1e293b}}.mobile-menu{{display:none}}.mobile-menu.open{{display:flex;flex-direction:column;padding:16px;gap:16px;border-top:1px solid #e2e8f0;background:#fff}}.mobile-menu a{{color:#1e293b;font-weight:500;text-decoration:none;padding:8px 0;transition:color .3s}}.mobile-menu a:hover{{color:#AF7423}}.mobile-menu .nav-btn{{text-align:center;margin-top:8px}}@media(max-width:768px){{.nav-links{{display:none}}.mobile-toggle{{display:block}}}}
\t\t.site-footer{{background:#04060a;color:#F8F6F3}}.footer-inner{{max-width:1280px;margin:0 auto;padding:40px 40px 20px}}.footer-grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}}.footer-logo img{{height:auto;max-width:180px;border-radius:12px;transition:transform .3s}}.footer-logo img:hover{{transform:scale(1.05)}}.footer-desc{{margin-top:12px;color:rgba(248,246,243,.9);font-size:.95rem;line-height:1.6}}.footer-copy{{margin-top:16px;color:rgba(248,246,243,.7);font-size:.85rem}}.footer-heading{{font-family:var(--font-serif,'Playfair Display',serif);font-size:1.4rem;color:#AF7423;margin-bottom:16px}}.footer-links{{list-style:none;padding:0;display:flex;flex-direction:column;gap:12px;text-transform:uppercase}}.footer-links a{{color:rgba(248,246,243,.9);text-decoration:none;transition:color .3s;font-size:.9rem}}.footer-links a:hover{{color:#AF7423;text-decoration:underline;text-underline-offset:4px;text-decoration-color:#AF7423}}.footer-address{{margin-top:24px;color:rgba(248,246,243,.85);font-size:.9rem;font-style:normal}}.footer-address-label{{color:#AF7423;font-weight:500;margin-bottom:4px}}.footer-line{{margin-top:40px;height:1px;background:linear-gradient(to right,transparent,#AF7423,transparent)}}@media(max-width:768px){{.footer-grid{{grid-template-columns:1fr;text-align:center}}.footer-logo{{display:flex;justify-content:center}}.footer-links{{align-items:center}}.footer-inner{{padding:32px 20px 16px}}}}
\t</style>
</head>

<body>
  <nav class="site-nav" role="navigation" aria-label="Main Navigation">
    <div class="nav-inner">
      <div class="nav-logo">
        <a href="/" aria-label="Go to Home">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tellme_logo-RdnPWp6sEWWh3is2Wg5VfyedDVryFs.png" alt="TellMe Logo" />
        </a>
      </div>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/about-us">About Us</a>
        <a href="/career-with-us">Careers</a>
        <a href="/contactus" class="nav-btn">Contact</a>
      </div>
      <button class="mobile-toggle" onclick="document.querySelector('.mobile-menu').classList.toggle('open')" aria-label="Toggle menu">
        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
    <div class="mobile-menu">
      <a href="/">Home</a>
      <a href="/about-us">About Us</a>
      <a href="/career-with-us">Careers</a>
      <a href="/contactus" class="nav-btn">Contact</a>
    </div>
  </nav>
\t<main class="main">
\t\t<div class="glow-wrap"><div class="glow-blob glow-blob--primary"></div><div class="glow-blob glow-blob--accent"></div></div>
\t\t<div class="lotus-bg lotus-bg--1"><div class="lotus-spin"><svg viewBox="0 0 800 800"><defs><linearGradient id="ls1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#c2560a" stop-opacity="0.6"/><stop offset="50%" stop-color="#d4af37" stop-opacity="0.8"/><stop offset="100%" stop-color="#c2560a" stop-opacity="0.6"/></linearGradient></defs>{"".join(f'<g transform="rotate({a} 400 400)"><path d="M400 100C430 150 440 220 400 300C360 220 370 150 400 100Z" fill="none" stroke="url(#ls1)" stroke-width="1.5" opacity=".6"/></g>' for a in range(0,360,int(360/16)))}</svg></div></div>
\t\t<div class="lotus-bg lotus-bg--2"><div class="lotus-spin-rev"><svg viewBox="0 0 800 800">{"".join(f'<g transform="rotate({a} 400 400)"><path d="M400 180C440 230 450 300 400 380C350 300 360 230 400 180Z" fill="none" stroke="#d4af37" stroke-width="2" opacity=".5"/><circle cx="400" cy="175" r="4" fill="#d4af37" opacity=".6"/></g>' for a in range(0,360,30))}</svg></div></div>
\t\t<div class="diya-wrap diya-wrap--left"><div class="diya diya--left"><div class="diya__inner"><div class="diya__ambient"></div><div class="diya__outer-glow"></div><div class="diya__inner-glow"></div><div class="diya__flame-outer"></div><div class="diya__flame-inner"></div><div class="diya__flame-tip"></div><div class="diya__wick"></div><div class="diya__oil"><div class="diya__oil-sheen"></div></div><div class="diya__bowl"><div class="diya__bowl-shine"></div><div class="diya__bowl-highlight"></div><div class="diya__bowl-dots"><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div></div></div><div class="diya__spout"></div><div class="diya__stem"></div><div class="diya__plate"></div><div class="diya__reflection"></div></div></div></div>
\t\t<div class="diya-wrap diya-wrap--right"><div class="diya diya--right"><div class="diya__inner"><div class="diya__ambient"></div><div class="diya__outer-glow"></div><div class="diya__inner-glow"></div><div class="diya__flame-outer"></div><div class="diya__flame-inner"></div><div class="diya__flame-tip"></div><div class="diya__wick"></div><div class="diya__oil"><div class="diya__oil-sheen"></div></div><div class="diya__bowl"><div class="diya__bowl-shine"></div><div class="diya__bowl-highlight"></div><div class="diya__bowl-dots"><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div><div class="diya__bowl-dot"></div></div></div><div class="diya__spout"></div><div class="diya__stem"></div><div class="diya__plate"></div><div class="diya__reflection"></div></div></div></div>

\t\t<section class="back-section">
\t\t\t<div class="container">
\t\t\t\t<a href="/blog" class="back-link">
\t\t\t\t\t<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
\t\t\t\t\tBack to Blog
\t\t\t\t</a>
\t\t\t</div>
\t\t</section>

\t\t<section class="hero">
\t\t\t<div class="container">
\t\t\t\t<div><span class="badge">{esc(category)}</span></div>
\t\t\t\t<h1 class="hero-title">{esc(temple_name)}</h1>

\t\t\t{image_html}

\t\t\t\t<div class="glass key-info">
\t\t\t\t\t<div class="key-info__grid">
\t\t\t\t\t\t<div class="key-info__item">
\t\t\t\t\t\t\t<div class="key-info__icon">🕉️</div>
\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t<div class="key-info__label">Main Deity</div>
\t\t\t\t\t\t\t\t<div class="key-info__value">{esc(main_deity) if main_deity else 'Please visit temple website'}</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="key-info__item">
\t\t\t\t\t\t\t<div class="key-info__icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t<div class="key-info__label">Timings</div>
\t\t\t\t\t\t\t\t<div class="key-info__value key-info__value--sans">{esc(timings)}</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="key-info__item">
\t\t\t\t\t\t\t<div class="key-info__icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></div>
\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t<div class="key-info__label">Contact</div>
\t\t\t\t\t\t\t\t<div class="key-info__value key-info__value--sans">{esc(contact) if contact else 'Please visit temple website'}</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t\t<div class="key-info__item key-info__item--full">
\t\t\t\t\t\t\t<div class="key-info__icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
\t\t\t\t\t\t\t<div>
\t\t\t\t\t\t\t\t<div class="key-info__label">Full Address</div>
\t\t\t\t\t\t\t\t<div class="key-info__value key-info__value--sans">{esc(address) if address else 'Please visit temple website for address'}</div>
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t</div>
\t\t\t\t</div>

\t\t\t\t<article class="glass article">
{content_html}
\t\t\t\t</article>

\t\t\t\t<div class="glass cta-section">
\t\t\t\t\t<h3>Experience Divine Darshan</h3>
\t\t\t\t\t<p>Immerse yourself in the spiritual essence of this sacred temple through our 360° VR experience.</p>
\t\t\t\t\t<a href="https://play.google.com/store/apps/details?id=com.tellme.tellme360&pcampaignid=web_share" target="_blank" class="cta-btn">
\t\t\t\t\t\tDownload Divya Darshan 360 App
\t\t\t\t\t</a>
\t\t\t\t</div>
\t\t\t</div>
\t\t</section>
\t</main>

\t<script>
\tfunction carouselNav(btn, dir) {{
\t\tconst carousel = btn.closest('.carousel');
\t\tconst slides = carousel.querySelectorAll('.carousel__slide');
\t\tconst dots = carousel.querySelectorAll('.carousel__dot');
\t\tconst counter = carousel.querySelector('.carousel__current');
\t\tconst total = parseInt(carousel.dataset.total);
\t\tlet current = 0;
\t\tslides.forEach((s, i) => {{ if (s.classList.contains('carousel__slide--active')) current = i; }});
\t\tslides[current].classList.remove('carousel__slide--active');
\t\tif (dots[current]) dots[current].classList.remove('carousel__dot--active');
\t\tcurrent = (current + dir + total) % total;
\t\tslides[current].classList.add('carousel__slide--active');
\t\tif (dots[current]) dots[current].classList.add('carousel__dot--active');
\t\tif (counter) counter.textContent = current + 1;
\t}}
\tdocument.querySelectorAll('.carousel__dot').forEach(dot => {{
\t\tdot.addEventListener('click', function() {{
\t\t\tconst carousel = this.closest('.carousel');
\t\t\tconst slides = carousel.querySelectorAll('.carousel__slide');
\t\t\tconst dots = carousel.querySelectorAll('.carousel__dot');
\t\t\tconst counter = carousel.querySelector('.carousel__current');
\t\t\tconst idx = parseInt(this.dataset.index);
\t\t\tslides.forEach(s => s.classList.remove('carousel__slide--active'));
\t\t\tdots.forEach(d => d.classList.remove('carousel__dot--active'));
\t\t\tslides[idx].classList.add('carousel__slide--active');
\t\t\tthis.classList.add('carousel__dot--active');
\t\t\tif (counter) counter.textContent = idx + 1;
\t\t}});
\t}});
\t// Auto-advance carousel every 5 seconds
\tdocument.querySelectorAll('.carousel[data-total]').forEach(carousel => {{
\t\tsetInterval(() => {{
\t\t\tconst nextBtn = carousel.querySelector('.carousel__btn--next');
\t\t\tif (nextBtn) nextBtn.click();
\t\t}}, 5000);
\t}});
\t</script>

  <footer class="site-footer" role="contentinfo">
    <div class="footer-inner">
      <div class="footer-grid">
        <div class="footer-col">
          <a href="/" class="footer-logo">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tellme_logo-RdnPWp6sEWWh3is2Wg5VfyedDVryFs.png" alt="TellMe Logo" />
          </a>
          <p class="footer-desc">Delivering Immersive Experiences and Location Insights delighting consumers and empowering enterprises.</p>
          <p class="footer-copy">&copy; Copyright 2025. Tellme Digiinfotech Pvt. Ltd.</p>
        </div>
        <div class="footer-col">
          <h2 class="footer-heading">Quick Links</h2>
          <ul class="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about-us/">About</a></li>
            <li><a href="/contactus/">Contact Us</a></li>
            <li><a href="/career-with-us">Careers</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-heading">Explore</h2>
          <ul class="footer-links">
            <li><a href="/coffee-table/mandu/index.html">Dynamic Digital Coffee Book</a></li>
            <li><a href="/newsletter">Newsletter</a></li>
            <li><a href="/moments">Gallery</a></li>
            <li><a href="/annual-report">Annual Returns</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h2 class="footer-heading">Legal</h2>
          <ul class="footer-links">
            <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
          </ul>
          <div class="footer-address">
            <p class="footer-address-label">Registered &amp; Corporate office:</p>
            <p>No. 218, B Wing, Akshay Complex, Dhole Patil Road, Pune - 411001</p>
            <p>CIN: U72900PN2016PTC217592</p>
          </div>
        </div>
      </div>
      <div class="footer-line"></div>
    </div>
  </footer>
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

    return output_path, img_count


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
                output, img_count = process_txt_file(txt_file, cat)
                success += 1
                img_info = f" ({img_count} images)" if img_count > 0 else " (no images)"
                if img_count > 0:
                    images_found += img_count
                print(f"  [OK] {os.path.basename(txt_file)} -> {os.path.basename(os.path.dirname(output))}/index.html{img_info}")
            except Exception as e:
                errors.append((txt_file, str(e)))
                print(f"  [ERROR] {os.path.basename(txt_file)}: {e}")

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

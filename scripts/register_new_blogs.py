"""Register 6 new blogs in blogs.json and swap their hero placeholders for real <img> tags.

Each new blog folder under public/blog/temple/popular/ already exists with an index.html
that uses an `.img-placeholder` div (emoji + text). Their matching cover images are at
public/blog/images/Popular Famous Temple/<slug>.jpg.
"""
from __future__ import annotations

import html as html_mod
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOGS_JSON = ROOT / "public" / "blog" / "blogs.json"
TEMPLE_DIR = ROOT / "public" / "blog" / "temple"
IMG_DIR_URL = "/blog/images/Popular%20Famous%20Temple"

# (slug, title, location) — title is the unescaped human-readable form
NEW_BLOGS: list[tuple[str, str, str]] = [
    (
        "khajuraho",
        "Khajuraho Group of Monuments: Complete Visitor's Guide (Western, Eastern & Southern Groups)",
        "Khajuraho, Madhya Pradesh",
    ),
    (
        "mamleshwar-temple-omkareshwar",
        "Mamleshwar Temple, Omkareshwar",
        "Omkareshwar, Madhya Pradesh",
    ),
    (
        "narmada-aarti-holy-narmada",
        "Narmada Aarti (Holy Narmada)",
        "Omkareshwar, Madhya Pradesh",
    ),
    (
        "shree-harsiddhi-mata-shaktipeeth",
        "Shree Harsiddhi Mata Shaktipeeth",
        "Ujjain, Madhya Pradesh",
    ),
    (
        "shri-avanti-parshwanath-jain-shwetambar-tirth-ujjain",
        "Shri Avanti Parshwanath Jain Shwetambar Tirth- Ujjain",
        "Ujjain, Madhya Pradesh",
    ),
    (
        "vishnu-temple-omkareshwar",
        "Vishnu Temple, Omkareshwar",
        "Omkareshwar, Madhya Pradesh",
    ),
]


PLACEHOLDER_RE = re.compile(
    r'<div class="img-placeholder">\s*'
    r'<div class="img-placeholder__icon">[^<]*</div>\s*'
    r'<div class="img-placeholder__gradient">\s*</div>\s*'
    r'<div class="img-placeholder__text">[^<]*</div>\s*'
    r"</div>",
    re.S,
)


def img_block(img_url: str, alt: str) -> str:
    safe_alt = html_mod.escape(alt, quote=True)
    return (
        '<div class="img-placeholder">\n'
        f'\t<img src="{img_url}" alt="{safe_alt}" '
        'class="absolute inset-0 w-full h-full object-cover" />\n'
        "</div>"
    )


def update_blogs_json() -> tuple[int, int]:
    data = json.loads(BLOGS_JSON.read_text(encoding="utf-8"))
    existing = {b["slug"] for b in data}

    added, skipped = 0, 0
    for slug, title, location in NEW_BLOGS:
        if slug in existing:
            skipped += 1
            continue
        img_url = f"{IMG_DIR_URL}/{slug}.jpg"
        data.append(
            {
                "slug": slug,
                "title": title,
                "category": "popular",
                "imageUrl": img_url,
                "images": [img_url],
                "location": location,
            }
        )
        added += 1

    # Write back with indent=2 (matches existing style)
    BLOGS_JSON.write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    return added, skipped


def replace_placeholder(slug: str, title: str) -> str:
    path = TEMPLE_DIR / "popular" / slug / "index.html"
    if not path.exists():
        return "MISSING"
    html = path.read_text(encoding="utf-8")
    if "<img " in html.split("</head>", 1)[-1]:
        return "ALREADY_HAS_IMG"
    if not PLACEHOLDER_RE.search(html):
        return "NO_PLACEHOLDER"
    img_url = f"{IMG_DIR_URL}/{slug}.jpg"
    new_block = img_block(img_url, title)
    new_html = PLACEHOLDER_RE.sub(new_block, html, count=1)
    path.write_text(new_html, encoding="utf-8")
    return "OK"


def main() -> None:
    added, skipped = update_blogs_json()
    print(f"blogs.json: added={added}, skipped (already present)={skipped}")
    print()
    print("Replacing hero placeholders with <img>:")
    for slug, title, _ in NEW_BLOGS:
        status = replace_placeholder(slug, title)
        print(f"  {status:18s} {slug}")


if __name__ == "__main__":
    main()

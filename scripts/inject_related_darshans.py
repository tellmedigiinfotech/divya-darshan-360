"""Inject a 'Related Darshans' internal-link block into every temple blog.

For each blog in public/blog/blogs.json, pick 5 related temples
(same category, preferring same state) and inject a thumbnail-grid block
just before the closing `cta-section` (or `</article>` fallback) in the
blog's index.html. Idempotent — re-running replaces the existing block.

Why: 111 pages are 'Discovered - currently not indexed' in Search Console.
Strong internal linking from related pages is the highest-ROI fix.

Run from frontend/:
    python scripts/inject_related_darshans.py
    python scripts/inject_related_darshans.py --dry-run    # show what would change
"""

from __future__ import annotations

import argparse
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]  # frontend/
BLOGS_JSON = ROOT / "public" / "blog" / "blogs.json"
TEMPLE_DIR = ROOT / "public" / "blog" / "temple"

# blogs.json category -> folder name under public/blog/temple/
CATEGORY_FOLDER = {
    "Ashtavinayaka": "ashtavinayak",
    "popular": "popular",
    "shaktipeet": "shaktipeet",
    "jyothirlinga": "jyothirlinga",
}

START_MARKER = "<!-- DD360_RELATED_DARSHANS_START -->"
END_MARKER = "<!-- DD360_RELATED_DARSHANS_END -->"

# Insert before <div class="glass cta-section"> if present, else before </article>
CTA_RE = re.compile(r'<div class="glass cta-section">', re.I)
ARTICLE_CLOSE_RE = re.compile(r"</article>", re.I)
EXISTING_BLOCK_RE = re.compile(
    re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER) + r"\s*",
    re.S,
)

# Best-effort Indian state extractor — alphabetized to give first-found priority
INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Orissa", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttarakhand", "Uttar Pradesh", "West Bengal",
    "Delhi", "Puducherry", "Jammu and Kashmir", "Ladakh",
    "Andaman", "Chandigarh", "Dadra", "Lakshadweep",
]


def extract_state(location: str) -> str:
    s = (location or "").lower()
    for st in INDIAN_STATES:
        if st.lower() in s:
            return "Odisha" if st == "Orissa" else st
    return ""


def url_for(blog: dict) -> str:
    folder = CATEGORY_FOLDER.get(blog["category"])
    if not folder:
        return ""
    return f"/blog/temple/{folder}/{blog['slug']}/"


def html_path_for(blog: dict) -> Path | None:
    folder = CATEGORY_FOLDER.get(blog["category"])
    if not folder:
        return None
    p = TEMPLE_DIR / folder / blog["slug"] / "index.html"
    return p if p.exists() else None


def render_block(related: list[dict]) -> str:
    cards = []
    for r in related:
        href = escape(url_for(r), quote=True)
        img = escape(r.get("imageUrl") or "", quote=True)
        title = escape(r.get("title", "").strip().lstrip("﻿"))
        loc = escape(r.get("location", "").strip())
        cards.append(
            f'<a href="{href}" style="display:block;text-decoration:none;color:inherit;'
            f'border-radius:12px;overflow:hidden;background:rgba(255,255,255,0.04);'
            f'border:1px solid rgba(255,255,255,0.08);transition:transform .2s,box-shadow .2s"'
            f' onmouseover="this.style.transform=\'translateY(-3px)\';'
            f'this.style.boxShadow=\'0 8px 24px rgba(184,134,11,0.18)\'"'
            f' onmouseout="this.style.transform=\'\';this.style.boxShadow=\'\'">\n'
            f'<img src="{img}" alt="{title}" loading="lazy" '
            f'style="width:100%;height:130px;object-fit:cover;display:block"/>\n'
            f'<div style="padding:.75rem">\n'
            f'<div style="font-size:.92rem;font-weight:600;line-height:1.3;margin-bottom:.25rem">{title}</div>\n'
            f'<div style="font-size:.72rem;color:#9a8b6a">{loc}</div>\n'
            f"</div>\n</a>"
        )
    grid = "\n".join(cards)
    return (
        f"\n{START_MARKER}\n"
        f'<section class="glass related-darshans" '
        f'style="margin:2rem auto;max-width:1100px;padding:1.5rem;border-radius:18px">\n'
        f'<h3 style="font-family:\'Playfair Display\',serif;font-size:1.5rem;'
        f'margin:0 0 1rem;color:#b8860b">Related Darshans</h3>\n'
        f'<div style="display:grid;'
        f'grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem">\n'
        f"{grid}\n"
        f"</div>\n"
        f"</section>\n"
        f"{END_MARKER}\n"
    )


def pick_related(self_blog: dict, all_blogs: list[dict], n: int = 5) -> list[dict]:
    cat = self_blog["category"]
    self_slug = self_blog["slug"]
    self_state = extract_state(self_blog.get("location", ""))

    same_cat = [b for b in all_blogs if b["category"] == cat and b["slug"] != self_slug]
    # Must have a resolvable HTML target (otherwise the link 404s)
    same_cat = [b for b in same_cat if html_path_for(b) is not None]

    def key(b: dict):
        b_state = extract_state(b.get("location", ""))
        # Same-state first, then alphabetical for deterministic output
        return (0 if (self_state and b_state == self_state) else 1, b["slug"])

    same_cat.sort(key=key)
    return same_cat[:n]


def inject(html: str, block: str) -> str:
    # Remove existing block (idempotent re-runs)
    html = EXISTING_BLOCK_RE.sub("", html)
    m = CTA_RE.search(html)
    if m:
        return html[: m.start()] + block + html[m.start():]
    m = ARTICLE_CLOSE_RE.search(html)
    if m:
        end = m.end()
        return html[:end] + block + html[end:]
    # Last resort: before </body>
    return html.replace("</body>", block + "</body>", 1)


def main(dry_run: bool) -> None:
    blogs = json.loads(BLOGS_JSON.read_text(encoding="utf-8"))
    print(f"Loaded {len(blogs)} blogs from {BLOGS_JSON.relative_to(ROOT)}")

    by_cat: dict[str, int] = {}
    for b in blogs:
        by_cat[b["category"]] = by_cat.get(b["category"], 0) + 1
    print("By category:", by_cat)
    print()

    updated, skipped_missing, unchanged = 0, 0, 0
    for blog in blogs:
        path = html_path_for(blog)
        if not path:
            skipped_missing += 1
            print(f"  - MISSING html for {blog['slug']}  ({blog['category']})")
            continue

        related = pick_related(blog, blogs, n=5)
        if not related:
            continue

        original = path.read_text(encoding="utf-8")
        block = render_block(related)
        new = inject(original, block)
        if new == original:
            unchanged += 1
            continue

        if dry_run:
            print(f"  ~ would inject  {path.relative_to(ROOT)}  ({len(related)} links)")
        else:
            path.write_text(new, encoding="utf-8")
            print(f"  + injected      {path.relative_to(ROOT)}  ({len(related)} links)")
        updated += 1

    print()
    print(f"Updated: {updated}, Unchanged: {unchanged}, Missing HTML: {skipped_missing}")
    if dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="Show changes without writing")
    args = ap.parse_args()
    main(args.dry_run)

"""
Replace the third-party font stylesheets on the static temple blog pages with
the self-hosted /blog/assets/fonts.css.

Removed from each page's <head>:

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display...">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/geist@1.3.1/.../style.min.css">

The jsdelivr one returns 404 -- that path does not exist in the geist package,
so the pages have been paying for a render-blocking request that delivered
nothing and falling back to the default sans-serif instead of Geist.

Run from frontend/:

    python scripts/blog-css/swap_external_fonts.py           # dry run
    python scripts/blog-css/swap_external_fonts.py --apply

Idempotent: pages already linking fonts.css are skipped.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

BLOG_DIR = Path("public/blog/temple")
FONTS_HREF = "/blog/assets/fonts.css"
FONTS_LINK = f'<link href="{FONTS_HREF}" rel="stylesheet"/>'

# Any <link> pointing at the font CDNs, in either attribute order.
FONT_LINK = re.compile(
    r'[ \t]*<link\b[^>]*?(?:fonts\.googleapis\.com|fonts\.gstatic\.com'
    r'|cdn\.jsdelivr\.net/npm/geist)[^>]*?>\s*\n?',
    re.I,
)


def transform(html: str) -> tuple[str, int]:
    matches = FONT_LINK.findall(html)
    if not matches:
        return html, 0
    # Drop them all, then reinstate a single local stylesheet at the position of
    # the first one so font CSS still precedes blog.css in the cascade.
    out = FONT_LINK.sub(f"{FONTS_LINK}\n", html, count=1)
    out = FONT_LINK.sub("", out)
    return out, len(matches)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    if not BLOG_DIR.is_dir():
        print(f"error: {BLOG_DIR} not found -- run from the frontend/ directory", file=sys.stderr)
        return 1

    changed = skipped = removed = 0
    for page in sorted(BLOG_DIR.glob("**/index.html")):
        html = page.read_text(encoding="utf-8")
        if FONTS_HREF in html:
            skipped += 1
            continue

        new_html, n = transform(html)
        if not n:
            skipped += 1
            continue

        if FONTS_HREF not in new_html:
            print(f"error: {page} would lose its font stylesheet -- aborting", file=sys.stderr)
            return 1

        if args.apply:
            page.write_text(new_html, encoding="utf-8", newline="\n")
        changed += 1
        removed += n

    verb = "rewrote" if args.apply else "would rewrite"
    print(f"{verb} {changed} pages, skipped {skipped}")
    print(f"  external font <link> tags removed: {removed}")
    if not args.apply:
        print("\ndry run -- rerun with --apply to write")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

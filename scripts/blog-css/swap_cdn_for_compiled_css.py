"""
Replace the Tailwind Play CDN on the static temple blog pages with the
pre-compiled stylesheet built by `npm run build:blog-css`.

Each page previously loaded, in <head>:

    <script src="https://cdn.tailwindcss.com"></script>
    <script src="/blog/assets/tailwind-config.js"></script>
    <style type="text/tailwindcss"> ...~5.7KB of @layer components... </style>

That is the Tailwind Play CDN: a full JIT compiler shipped to the browser, which
re-generates the page's CSS on every load. Tailwind documents it as a
development-only tool. It was render-blocking on our 124 highest-value SEO
pages.

All three are replaced by a single cached stylesheet:

    <link rel="stylesheet" href="/blog/assets/blog.css">

Run from the frontend/ directory, AFTER building the CSS:

    npm run build:blog-css
    python scripts/blog-css/swap_cdn_for_compiled_css.py          # dry run
    python scripts/blog-css/swap_cdn_for_compiled_css.py --apply

Idempotent: pages already carrying the <link> are skipped.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

BLOG_DIR = Path("public/blog/temple")
STYLESHEET_HREF = "/blog/assets/blog.css"
STYLESHEET_LINK = f'<link href="{STYLESHEET_HREF}" rel="stylesheet"/>'

CDN_SCRIPT = re.compile(r'[ \t]*<script src="https://cdn\.tailwindcss\.com"></script>\n?')
CONFIG_SCRIPT = re.compile(r'[ \t]*<script src="/blog/assets/tailwind-config\.js"></script>\n?')
INLINE_STYLE = re.compile(r'[ \t]*<style type="text/tailwindcss">.*?</style>\n?', re.S)


def transform(html: str) -> tuple[str, dict[str, int]]:
    """Return rewritten HTML plus a count of what was removed."""
    counts = {
        "cdn_script": len(CDN_SCRIPT.findall(html)),
        "config_script": len(CONFIG_SCRIPT.findall(html)),
        "inline_style": len(INLINE_STYLE.findall(html)),
    }

    # The <link> goes where the CDN script was, so the compiled sheet keeps the
    # same position in the cascade relative to diya.css, which follows it and is
    # allowed to override.
    out = CDN_SCRIPT.sub(f"{STYLESHEET_LINK}\n", html, count=1)
    out = CDN_SCRIPT.sub("", out)
    out = CONFIG_SCRIPT.sub("", out)
    out = INLINE_STYLE.sub("", out)
    return out, counts


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write changes (default: dry run)")
    args = parser.parse_args()

    if not BLOG_DIR.is_dir():
        print(f"error: {BLOG_DIR} not found -- run this from the frontend/ directory", file=sys.stderr)
        return 1

    pages = sorted(BLOG_DIR.glob("**/index.html"))
    if not pages:
        print(f"error: no index.html under {BLOG_DIR}", file=sys.stderr)
        return 1

    changed = skipped = 0
    totals = {"cdn_script": 0, "config_script": 0, "inline_style": 0}

    for page in pages:
        html = page.read_text(encoding="utf-8")

        if STYLESHEET_HREF in html:
            skipped += 1
            continue

        new_html, counts = transform(html)
        if new_html == html:
            skipped += 1
            continue

        for key, value in counts.items():
            totals[key] += value

        # A page that had the CDN but somehow gained no <link> would silently
        # lose all styling. Refuse rather than write that.
        if STYLESHEET_HREF not in new_html:
            print(f"error: {page} would end up with no stylesheet -- aborting", file=sys.stderr)
            return 1

        if args.apply:
            page.write_text(new_html, encoding="utf-8", newline="\n")
        changed += 1

    verb = "rewrote" if args.apply else "would rewrite"
    print(f"{verb} {changed} pages, skipped {skipped} (already done or nothing to do)")
    print(f"  CDN <script> removed:      {totals['cdn_script']}")
    print(f"  config <script> removed:   {totals['config_script']}")
    print(f"  inline <style> removed:    {totals['inline_style']}")
    if not args.apply:
        print("\ndry run -- rerun with --apply to write")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

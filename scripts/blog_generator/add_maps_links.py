"""
add_maps_links.py
-----------------
Reads Geo Codes from link_update.xlsx (Sheet2) and adds a Google Maps
link on the address/location section of every temple blog index.html.

Two places are updated in each HTML:
  1. Quick Info sidebar  — after the Location paragraph
  2. "How to Reach" card — after the address paragraph
"""

import os, glob, re
import openpyxl

EXCEL     = r'd:\pratik\divya_darshan\divya-darshan-360\scripts\blog_generator\link_update.xlsx'
BLOG_BASE = r'd:\pratik\divya_darshan\divya-darshan-360\public\blog\temple'

MAPS_BASE = "https://www.google.com/maps/search/"

# ── 1. Load Geo-code map from Sheet2 ─────────────────────────────────────────
def load_geo_map(excel_path):
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    ws2 = wb.worksheets[1]      # Sheet2 (0-indexed)
    geo_map = {}                # lowercase_name  →  "lat, lng"
    for i, row in enumerate(ws2.iter_rows(values_only=True)):
        if i < 2:               # skip two header rows
            continue
        if row[0] is None:      # stop at first empty Sr.No
            break
        name      = row[2]      # column C — temple name
        geo_codes = row[6]      # column G — geo codes
        if name and geo_codes:
            key = name.lower().strip()
            geo_map[key] = str(geo_codes).strip()
    wb.close()
    print(f"  Loaded {len(geo_map)} geo codes from Sheet2.")
    return geo_map

# ── 2. Match a slug to a geo code ────────────────────────────────────────────
def find_geo(slug, geo_map):
    """Return geo code string if any temple name appears in the slug, else None."""
    for name, geo in geo_map.items():
        # Use every word so 'omkareshwar' matches 'omkareshwar-temple-…'
        if name.replace(" ", "-") in slug or name.replace(" ", "") in slug.replace("-", ""):
            return geo
    return None

# ── 3. Maps link HTML snippet ─────────────────────────────────────────────────
def maps_link_html(geo_code):
    url = MAPS_BASE + geo_code.replace(" ", "")
    return (
        f'\n<a href="{url}" target="_blank" rel="noopener noreferrer" '
        f'style="display:inline-flex;align-items:center;gap:4px;margin-top:6px;'
        f'font-size:.82rem;color:#e23d00;text-decoration:none;font-weight:500;" '
        f'class="maps-link">'
        f'<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        f'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">'
        f'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>'
        f'<circle cx="12" cy="10" r="3"></circle></svg>'
        f'View on Google Maps</a>'
    )

# ── 4. Patch one HTML file ────────────────────────────────────────────────────
SIDEBAR_LOC_RE = re.compile(
    r'(<p class="text-\[\.75rem\] font-normal text-primary uppercase tracking-widest mb-1">Location</p>\s*'
    r'<p class="text-\[\.88rem\] text-\[#3b2510\]">.*?</p>)',
    re.DOTALL
)

REACH_ADDR_RE = re.compile(
    r'(<div class="rounded-xl p-5 mb-8 bg-primary/5 border-l-4 border-primary flex flex-col md:flex-row md:items-center gap-4">.*?</div>\s*</div>)',
    re.DOTALL
)

# Simpler: target the address paragraph inside the location card
REACH_P_RE = re.compile(
    r'(<p class="text-\[\.9rem\] mb-1">(?:[^<]|<(?!/p>))*?</p>)(\s*<p class="text-\[\.9rem\]"><strong>Phone)',
    re.DOTALL
)

def already_patched(content):
    return 'maps-link' in content or 'maps/search' in content

def patch_file(file_path, geo_code):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if already_patched(content):
        return 'skipped'

    link_html = maps_link_html(geo_code)
    changed = False

    # --- patch 1: quick-info sidebar Location block ---
    def replace_sidebar(m):
        nonlocal changed
        changed = True
        return m.group(1) + link_html

    new_content = SIDEBAR_LOC_RE.sub(replace_sidebar, content, count=1)

    # --- patch 2: How-to-Reach address paragraph ---
    def replace_reach(m):
        nonlocal changed
        changed = True
        return m.group(1) + link_html + m.group(2)

    new_content = REACH_P_RE.sub(replace_reach, new_content, count=1)

    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return 'updated'
    return 'no_match'

# ── 5. Main ───────────────────────────────────────────────────────────────────
def main():
    geo_map = load_geo_map(EXCEL)

    html_files = glob.glob(os.path.join(BLOG_BASE, '**', 'index.html'), recursive=True)
    print(f"  Found {len(html_files)} HTML files.\n")

    stats = {'updated': 0, 'skipped': 0, 'no_geo': 0, 'no_match': 0}

    for f in sorted(html_files):
        slug = os.path.basename(os.path.dirname(f)).lower()
        geo  = find_geo(slug, geo_map)

        if not geo:
            stats['no_geo'] += 1
            print(f"  [NO GEO ] {slug}")
            continue

        result = patch_file(f, geo)
        stats[result] += 1
        status_label = {'updated': 'UPDATED', 'skipped': 'SKIPPED', 'no_match': 'NO MATCH'}[result]
        print(f"  [{status_label:8}] {slug}")

    print("\n=== Summary ===")
    print(f"  Updated  : {stats['updated']}")
    print(f"  Skipped  : {stats['skipped']} (already patched)")
    print(f"  No geo   : {stats['no_geo']}")
    print(f"  No match : {stats['no_match']} (HTML pattern not found)")

if __name__ == '__main__':
    main()

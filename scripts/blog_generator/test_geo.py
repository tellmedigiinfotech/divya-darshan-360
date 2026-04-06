import os
import glob
import re
import openpyxl

excel_path = r'd:\pratik\divya_darshan\divya-darshan-360\scripts\blog_generator\link_update.xlsx'
base_path = r'd:\pratik\divya_darshan\divya-darshan-360\public\blog\temple'

def main():
    print("Loading excel...")
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    ws2 = wb.worksheets[1]
    
    geo_map = {}
    # Build lowercased mapping
    for i, row in enumerate(ws2.iter_rows(values_only=True)):
        if i < 2: continue
        if row[0] is None: break
        name = row[2]
        geo_codes = row[6]
        if name and geo_codes:
            geo_map[name.lower().strip()] = str(geo_codes).strip()
            
    print(f"Loaded {len(geo_map)} geo codes")
            
    html_files = glob.glob(os.path.join(base_path, '**', 'index.html'), recursive=True)
    print(f"Found {len(html_files)} HTML files")
    
    # regex for location
    # Need to match:
    # <p class="text-[.75rem] font-normal text-primary uppercase tracking-widest mb-1">Location</p>
    # <p class="text-[.88rem] text-[#3b2510]">...</p>
    # or similar
    location_pattern = re.compile(
        r'(<p class="text-\[\.75rem\] font-normal text-primary uppercase tracking-widest mb-1">Location</p>\s*<p class="text-\[\.88rem\] text-\[#3b2510\]">.*?</p>)',
        re.IGNORECASE | re.DOTALL
    )
    title_pattern = re.compile(r'<title>(.*?)</title>', re.IGNORECASE)
    
    matched = 0
    missing = 0
    for f in html_files:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        m_title = title_pattern.search(content)
        title = m_title.group(1).lower() if m_title else ""
        slug = f.replace('\\', '/').split('/')[-2].lower()
        
        # Find matching geo code
        found_geo = None
        for n, gc in geo_map.items():
            if n in slug or n in title:
                found_geo = gc
                break
                
        if found_geo:
            m_loc = location_pattern.search(content)
            if m_loc:
                matched += 1
                # Check if already added
                if 'maps/search' in m_loc.group(1):
                    continue
                # We would replace here
            else:
                print(f"Location section not found in {f}")
        else:
            missing += 1
            #print(f"No geo code mapping for {title} ({slug})")
            
    print(f"Matched {matched} files with geo codes. Missing/No-match: {missing}")
    
if __name__ == '__main__':
    main()

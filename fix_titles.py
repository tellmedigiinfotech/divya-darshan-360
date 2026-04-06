import os
import re

blog_dir = r'd:\pratik\divya_darshan\divya-darshan-360\public\blog\temple'

fixes = {
    # Misspellings
    r'Pandarapur Vittal': 'Pandharpur Vitthal',
    r'Vaijinath Jyothirling': 'Vaijnath Jyotirlinga',
    r'Mahakaleswar': 'Mahakaleshwar',
    r'Dagadushet Ganapati': 'Dagdusheth Halwai Ganpati',
    
    # Generic replacements
    r'Jyothirlinga': 'Jyotirlinga',
    r'Jyothirling': 'Jyotirlinga',
    
    # Typos and Formatting
    r' ,Website': '',
    r'Shrinathji Temple Shrinathji': 'Shrinathji Temple',
    r';Dakor Temple': ', Dakor Temple',
    r'distt': 'District',
    r'district \s*\|': 'District |',
}

files_changed = 0

for root, dirs, files in os.walk(blog_dir):
    for f in files:
        if f == 'index.html':
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8') as fh:
                    content = fh.read()
                
                # We only want to replace within the <title> tag to prevent breaking other content
                match = re.search(r'(<title>)(.*?)(</title>)', content, re.IGNORECASE)
                if match:
                    original_title = match.group(2)
                    new_title = original_title
                    
                    for pattern, replacement in fixes.items():
                        # Use re.sub for case-insensitive replacement if needed, 
                        # but standard replace or re.sub without IGNORECASE to maintain capitalization is safer.
                        new_title = re.sub(pattern, replacement, new_title)
                    
                    if new_title != original_title:
                        # Replace only the title block
                        new_content = content[:match.start(2)] + new_title + content[match.end(2):]
                        with open(path, 'w', encoding='utf-8') as fh:
                            fh.write(new_content)
                        print(f"Updated: {original_title} -> {new_title}")
                        files_changed += 1
                        
            except Exception as e:
                print(f"ERROR: {path} => {e}")

print(f"\nTotal files updated: {files_changed}")

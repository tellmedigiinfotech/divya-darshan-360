import os
import re

blog_dir = r'd:\pratik\divya_darshan\divya-darshan-360\public\blog\temple'
results = []

for root, dirs, files in os.walk(blog_dir):
    for f in files:
        if f == 'index.html':
            path = os.path.join(root, f)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as fh:
                    content = fh.read()
                match = re.search(r'<title>(.*?)</title>', content, re.IGNORECASE)
                if match:
                    title = match.group(1).strip()
                    rel = os.path.relpath(path, blog_dir)
                    results.append((rel, title))
            except Exception as e:
                print(f"ERROR: {path} => {e}")

print(f"{'No.':<5} {'Title':<80} {'Path'}")
print("-" * 140)
for i, (rel, title) in enumerate(sorted(results), 1):
    print(f"{i:<5} {title:<80} {rel}")

print(f"\nTotal: {len(results)} blogs found")

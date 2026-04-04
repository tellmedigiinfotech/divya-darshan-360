import json
import os
import glob
from fuzzywuzzy import fuzz

# Load blogs.json to see current mappings
with open("public/blog/blogs.json", "r", encoding="utf-8") as f:
    blogs = json.load(f)

# Collect all image files
images = []
for ext in ["*.jpg", "*.jpeg", "*.png", "*.webp", "*.JPG", "*.jfif", "*.gif"]:
    images.extend(glob.glob(f"public/blog/images/{ext}"))
    images.extend(glob.glob(f"public/blog/images/Wikipedia Images/{ext}"))

print(f"Found {len(images)} images in root and Wikipedia Images")

# Try to map images to blogs based on names
matched_images = {}
for img in images:
    img_name = os.path.basename(img).replace(ext.strip('*'), '').strip('- 1234567890_')
    best_match = None
    best_score = 0
    
    for blog in blogs:
        title = blog.get('title', '')
        slug = blog.get('slug', '')
        
        # Simple string matching
        score = max(fuzz.partial_ratio(img_name.lower(), title.lower()), 
                    fuzz.partial_ratio(img_name.lower(), slug.lower().replace('-', ' ')))
                    
        if score > best_score:
            best_score = score
            best_match = blog['slug']
            
    if best_score > 70:
        if best_match not in matched_images:
            matched_images[best_match] = []
        # Convert path to posix format for web
        web_path = "/" + img.replace("\\", "/")
        if not web_path.startswith('/public'):
            # Just in case
            pass
        web_path = web_path.replace("/public", "")
        matched_images[best_match].append(web_path)

print(f"Matched {len(matched_images)} blogs with new images")

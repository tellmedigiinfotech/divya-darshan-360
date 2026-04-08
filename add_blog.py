import json
import urllib.parse

with open('d:/pratik/divya_darshan/divya-darshan-360/public/blog/blogs.json', 'r', encoding='utf-8') as f:
    blogs = json.load(f)

new_blog = {
    "slug": "moreshwar-temple-located-in-morgaon-village-pune-district",
    "title": "Moreshwar Temple: Located in Morgaon village, Pune district.",
    "category": "Ashtavinayaka",
    "imageUrl": "/blog/images/Ashtavinayaka%20Temple/Moreshwar%20Ashtavinayak%20Temple_Morgaon.jpg",
    "images": [
        "/blog/images/Ashtavinayaka%20Temple/Moreshwar%20Ashtavinayak%20Temple_Morgaon.jpg"
    ],
    "location": "Morgaon, Pune District, Maharashtra, India"
}

# Insert after the first Ashtavinayaka temple or at the beginning
inserted = False
for i, b in enumerate(blogs):
    if b.get('category') == 'Ashtavinayaka':
        blogs.insert(i, new_blog)
        inserted = True
        break

if not inserted:
    blogs.insert(0, new_blog)

with open('d:/pratik/divya_darshan/divya-darshan-360/public/blog/blogs.json', 'w', encoding='utf-8') as f:
    json.dump(blogs, f, indent=2, ensure_ascii=False)

print("Added successfully!")

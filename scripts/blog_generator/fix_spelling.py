import os

root_dir = r"d:\pratik\divya_darshan\divya-darshan-360"

old_dir = os.path.join(root_dir, "public", "blog", "temple", "ashtavinayak")
new_dir = os.path.join(root_dir, "public", "blog", "temple", "ashtavinayak")
if os.path.exists(old_dir):
    os.rename(old_dir, new_dir)
    print(f"Renamed {old_dir} to {new_dir}")

for dirpath, dirnames, filenames in os.walk(root_dir):
    if ".git" in dirpath or "node_modules" in dirpath or ".next" in dirpath:
        continue
    for filename in filenames:
        filepath = os.path.join(dirpath, filename)
        if filepath.endswith((".ts", ".tsx", ".js", ".jsx", ".json", ".html", ".md", ".py", ".mdx")):
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = content.replace("ashtavinayak", "ashtavinayak").replace("ashtavinayak", "Ashtavinayak")
                # Handle possible url encoded variants like ashtavinayak -> ashtavinayak ? They're all lowercase letters mostly.
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
            except Exception as e:
                pass

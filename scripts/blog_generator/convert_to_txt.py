import os
import glob
from bs4 import BeautifulSoup

def undo_previous():
    base_dir = r"d:\pratik\divya_darshan\divya-darshan-360\public\blog\temple"
    txt_files = glob.glob(os.path.join(base_dir, '**', 'index.txt'), recursive=True)
    count = 0
    for file_path in txt_files:
        try:
            os.remove(file_path)
            count += 1
        except Exception as e:
            print(f"Failed to delete {file_path}: {e}")
    print(f"Deleted {count} previous index.txt files.")

def convert_blogs_to_new_folder():
    base_dir = r"d:\pratik\divya_darshan\divya-darshan-360\public\blog\temple"
    output_dir = r"d:\pratik\divya_darshan\divya-darshan-360\public\blog\txt_blogs"
    
    html_files = glob.glob(os.path.join(base_dir, '**', 'index.html'), recursive=True)
    
    count = 0
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                html_content = f.read()
                
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove all script and style tags
            for elem in soup(['style', 'script']):
                elem.extract()
                
            # Extract plain text
            text_content = soup.get_text(separator='\n', strip=True)
            
            # Determine output file path
            # file_path like D:\...\public\blog\temple\ashtwinayak\ballaleshwar-...\index.html
            rel_path = os.path.relpath(file_path, base_dir)
            parts = os.path.normpath(rel_path).split(os.sep)
            
            if len(parts) >= 3:
                category = parts[0]
                slug = parts[1]
                
                # output structure: txt_blogs/category/slug.txt
                out_category_dir = os.path.join(output_dir, category)
                os.makedirs(out_category_dir, exist_ok=True)
                
                txt_path = os.path.join(out_category_dir, f"{slug}.txt")
                
                with open(txt_path, 'w', encoding='utf-8') as f:
                    f.write(text_content)
                    
                print(f"Converted: {file_path} -> {txt_path}")
                count += 1
        except Exception as e:
            print(f"Failed to convert {file_path}: {e}")
            
    print(f"\nTotal files successfully converted to new folder: {count}")
    print(f"Output Directory: {output_dir}")

if __name__ == "__main__":
    undo_previous()
    convert_blogs_to_new_folder()

"""
Image Compression Script for Blog Images
=========================================
Compresses all images in public/blog/images/ to web-friendly sizes.

- Resizes images to max 1200px width (maintains aspect ratio)
- Converts to optimized JPEG at 80% quality
- GIFs are left untouched
- Prints before/after sizes for each image
"""

import os
import sys
from PIL import Image

# Configuration
MAX_WIDTH = 1200        # Max width in pixels
JPEG_QUALITY = 80       # JPEG quality (1-100)
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "blog", "images")

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
SKIP_EXTENSIONS = {".gif"}


def format_size(size_bytes):
    """Format bytes to human-readable string."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.2f} MB"


def compress_image(filepath):
    """Compress a single image file. Returns (original_size, new_size) or None if skipped."""
    ext = os.path.splitext(filepath)[1].lower()

    if ext in SKIP_EXTENSIONS:
        return None

    if ext not in SUPPORTED_EXTENSIONS:
        return None

    original_size = os.path.getsize(filepath)

    try:
        with Image.open(filepath) as img:
            # Convert RGBA/P to RGB for JPEG saving
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")

            # Resize if wider than MAX_WIDTH
            width, height = img.size
            if width > MAX_WIDTH:
                ratio = MAX_WIDTH / width
                new_height = int(height * ratio)
                img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

            # Save as optimized JPEG (overwrite original)
            # Change extension to .jpg if it was .png or .webp
            base = os.path.splitext(filepath)[0]
            output_path = base + ".jpg"

            img.save(output_path, "JPEG", quality=JPEG_QUALITY, optimize=True)

            # If original was not .jpg, remove the original file
            if filepath != output_path and os.path.exists(filepath):
                os.remove(filepath)

            new_size = os.path.getsize(output_path)
            return original_size, new_size, output_path

    except Exception as e:
        print(f"  [ERROR] Error processing {filepath}: {e}")
        return None


def main():
    images_dir = os.path.abspath(IMAGES_DIR)

    if not os.path.exists(images_dir):
        print(f"[ERROR] Images directory not found: {images_dir}")
        sys.exit(1)

    print(f"[DIR] Scanning: {images_dir}")
    print(f"[CONFIG] Settings: max_width={MAX_WIDTH}px, quality={JPEG_QUALITY}%")
    print("=" * 70)

    total_original = 0
    total_compressed = 0
    processed = 0
    skipped = 0

    for root, dirs, files in os.walk(images_dir):
        for filename in sorted(files):
            filepath = os.path.join(root, filename)
            rel_path = os.path.relpath(filepath, images_dir)

            ext = os.path.splitext(filename)[1].lower()
            if ext in SKIP_EXTENSIONS:
                print(f"[SKIP] Skipped (GIF): {rel_path}")
                skipped += 1
                continue

            if ext not in SUPPORTED_EXTENSIONS:
                continue

            result = compress_image(filepath)
            if result is None:
                skipped += 1
                continue

            original_size, new_size, output_path = result
            total_original += original_size
            total_compressed += new_size
            processed += 1

            reduction = ((original_size - new_size) / original_size) * 100
            output_rel = os.path.relpath(output_path, images_dir)
            print(f"[OK] {rel_path}")
            print(f"     {format_size(original_size)} -> {format_size(new_size)} ({reduction:.1f}% smaller)")

    print("=" * 70)
    print(f"[SUMMARY]")
    print(f"   Processed: {processed} images")
    print(f"   Skipped:   {skipped} files")
    print(f"   Total before: {format_size(total_original)}")
    print(f"   Total after:  {format_size(total_compressed)}")
    if total_original > 0:
        total_reduction = ((total_original - total_compressed) / total_original) * 100
        saved = total_original - total_compressed
        print(f"   Saved:        {format_size(saved)} ({total_reduction:.1f}%)")
    print("Done!")


if __name__ == "__main__":
    main()

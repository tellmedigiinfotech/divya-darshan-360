# Analysis of `blog_data.xlsx`

The `blog_data.xlsx` file serves as a structured database for generating static temple blog pages. Based on the extraction script analysis, the file contains the following structure and content domains:

## File Structure
The Excel workbook consists of two distinct sheets:
1. **`blogs`**: The primary data sheet containing all content elements for each temple blog post.
2. **`README`**: An instructional sheet providing a quick start guide for the blog generation script (e.g., installation of dependencies like `openpyxl` and `jinja2`).

## Sheet: `blogs`
This sheet is structured with a "grouped header" format. It has 98 columns, divided logically into sections using prefix categories.

### 1. Data Dimensions
- **Shape**: 2 rows of headers + data rows (the sample head shows 1 data row currently).
- **Structure**: Row 0 contains section groupings (e.g., `🔷 A — Basic Info & SEO`, `🔷 B — Hero Section`), and Row 1 contains actual column variable names and short descriptions (e.g., `temple_name`, `category`, `slug`).

### 2. Key Content Categories

**A. Basic Info & SEO**
This section handles the high-level metadata and SEO content required for routing and search engine optimization.
- `temple_name` (e.g., Ashtavinayaka Ballaleshwar Temple)
- `category` & `slug` (Used for URL structure)
- `meta_description`, `keywords`
- `date_published`, `date_modified`
- `og_image_url`, `canonical_url`

**B. Hero Section**
Content for the top prominent display of the blog post.
- `category_display`
- `hero_title_main`, `hero_title_highlight`, `hero_title_suffix` (Allows for styled headings)
- `hero_intro_para_1`, `hero_intro_para_2`
- `hero_image_url`, `hero_image_alt`

**C. Quick Stat Cards**
Quick summary points listed at the top.
- `stat_deity`, `stat_location`, `stat_contact`

**D. Overview Tab**
Detailed descriptions of the temple, its history, and spiritual context.
- `main_deity`, `main_deity_desc`, `sub_deities`, `sub_deities_desc`
- `temple_trust`, `temple_trust_desc`
- `historical_para_1`, `historical_para_2`
- `spiritual_para_1`, `spiritual_para_2`
- Event details (`annual_event_name`, `monthly_event_name`, etc.)

**E. Facilities Tab**
Amenities and services available to visitors.
- Facilities 1-6 (Formatted as: emoji|Title|Desc)
- Online Services
- `vehicle_pooja_desc`, `lost_found_desc`

**F. Guidelines Tab**
Rules for visitors.
- Dress codes (Men/Women - Dos and Don'ts)
- `dress_festival_note`, `etiquette_points`
- `photography_rules`, `accessibility_rules`

**G. How to Reach**
Comprehensive transit options with integrated Google Maps embeds.
- General address and contact.
- Air, Train, and Bus travel sections with `_map_embed` fields.
- `taxi_desc`

**H. YouTube**
- `youtube_video_id` (For embedding video content)

**I. Timings**
Darshan schedules.
- `timing_morning`, `timing_midday`, `timing_evening`
- Special puja timings.

**J. Architecture & Significance**
Architectural insights.
- `arch_style_desc`, `arch_material_desc`, `arch_scientific_desc`, `arch_conservation_desc`
- General and foreign visitor significance content cards.

**M. Puja Booking & Prasad**
Details regarding bookings and temple offerings.
- `prasad_items`, `prasad_cost_note`, `prasad_purchase_note`
- `booking_online_desc`, `booking_onsite_desc`

**N. Sidebar & Admin**
Meta information for the sidebar and direct administration contacts.
- `sidebar_nearest_railway`, `sidebar_nearest_airport`, `sidebar_accessibility`
- `admin_managing_body`, `admin_contact`, `admin_address`

## Observations
- The Excel file is designed to be highly structured, using pipe characters (`|`) to delimit specific sub-items within single cells (like lists for facilities, etiquette rules, or prasad items).
- Special unicode emojis (like 🔷) are used in headers to provide visual grouping for content editors.
- Encoding: Due to the use of emojis and special characters in descriptions, scripts reading this file must use `utf-8` encoding. This was a direct observation as default charmap decoding failed during the programmatic extraction test.

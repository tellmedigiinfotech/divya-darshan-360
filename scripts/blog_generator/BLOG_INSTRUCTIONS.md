# 📖 Blog Generator — Complete Instructions Guide

## Overview
This system lets you create multiple temple blog pages in bulk using an Excel file.
1. Fill the Excel file (`blog_data.xlsx`) — one row per temple
2. Run `generate_blogs_from_excel.py`
3. All blogs are generated instantly in the correct folder structure

---

## 🔧 Setup (Run Once)

```bash
pip install openpyxl jinja2
```

---

## 📂 Folder Structure After Generation

```
public/
└── blog/
    └── temple/
        └── [category]/
            └── [slug]/
                └── index.html   ← generated blog
```

**Example:**
```
public/blog/temple/ashtwinayak/ballaleshwar-temple-found-in-pali-village-raigad-district/index.html
```

---

## 📊 EXCEL COLUMN GUIDE — Every Column Explained

### Sheet: `blogs`

---

### 🔷 SECTION A — Basic Info & SEO (Columns A–J)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| A | `temple_name` | Full temple name | `Ashtavinayaka Ballaleshwar Temple` |
| B | `category` | URL category folder | `ashtwinayak` |
| C | `slug` | URL folder name (no spaces, use hyphens) | `ballaleshwar-temple-found-in-pali-village-raigad-district` |
| D | `meta_description` | Short SEO description (~155 chars) | `Complete guide to Ballaleshwar Temple — timings, how to reach...` |
| E | `keywords` | Comma-separated keywords | `Ballaleshwar Temple, Ashtavinayaka, Ganesha temples Maharashtra` |
| F | `date_published` | ISO date | `2025-01-01T00:00:00+05:30` |
| G | `date_modified` | ISO date | `2026-03-24T00:00:00+05:30` |
| H | `og_image_url` | Full URL to main image | `https://divyadarshan360.com/blog/images/Ashtavinayaka Temple/ballaleshwar_1.jpg` |
| I | `canonical_url` | Full canonical URL | `https://divyadarshan360.com/blog/temple/ashtwinayak/ballaleshwar.../index.html` |
| J | `category_display` | What shows in the badge | `Ashtavinayaka Temples` |

---

### 🔷 SECTION B — Hero (Columns K–P)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| K | `hero_title_main` | First part of H1 (plain) | `Ashtavinayaka` |
| L | `hero_title_highlight` | Second part of H1 (colored) | `Ballaleshwar` |
| M | `hero_title_suffix` | Third part of H1 (after highlight) | `Temple` |
| N | `hero_intro_para_1` | First paragraph under title | `The Ballaleshwar Temple in Pali village...` |
| O | `hero_intro_para_2` | Second paragraph | `Standing as a testament to the rich...` |
| P | `hero_image_url` | Hero image URL (can be relative or full) | `https://divyadarshan360.com/blog/images/...` |
| Q | `hero_image_alt` | Alt text for hero image | `Ashtavinayaka Ballaleshwar Temple - Front View` |

---

### 🔷 SECTION C — Quick Stat Cards (Columns R–T)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| R | `stat_deity` | Main deity name | `Lord Ganesha (Ballaleshwar)` |
| S | `stat_location` | Short location | `Pali Village, Sudhagad, Raigad, Maharashtra` |
| T | `stat_contact` | Phone number | `02142-242263` |

---

### 🔷 SECTION D — Overview Tab (Columns U–AD)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| U | `sub_deities` | Pipe-separated list: `Name\|Name` | `Goddess Parvati\|Lord Shiva` |
| V | `temple_trust` | Trust name | `Ballaleshwar Temple Trust` |
| W | `historical_para_1` | Historical & Architectural para 1 | `The temple is constructed in traditional...` |
| X | `historical_para_2` | Historical & Architectural para 2 | `The temple is associated with the legend...` |
| Y | `spiritual_para_1` | Spiritual Significance para 1 | `Lord Ganesha is revered as the remover...` |
| Z | `spiritual_para_2` | Spiritual Significance para 2 | `For foreign visitors, this temple offers...` |
| AA | `entry_fee_general` | General entry fee | `Free` |
| AB | `entry_fee_notes` | Pipe-separated fee rows: `Label\|Value` | `Quick Darshan\|For specific rituals\|Special Gate\|Designated gate` |
| AC | `annual_event_name` | Annual festival name | `Magha Shukla Chaturthi` |
| AD | `annual_event_desc` | Annual festival description | `Celebrated on the fourth day of waxing moon...` |
| AE | `monthly_event_name` | Monthly event name | `Pradosha Puja` |
| AF | `monthly_event_desc` | Monthly event description | `Observed twice monthly on the 13th day...` |
| AG | `donation_channels` | Pipe-separated: `BoldLabel:description` | `Online Donations:Through temple website\|Bank Transfers:Designated accounts` |

---

### 🔷 SECTION E — Facilities Tab (Columns AH–AM)

Each facility card: `emoji\|Title\|Description` (pipe-separated)

| Column | Header | Example |
|--------|--------|---------|
| AH | `facility_1` | `♿\|Accessibility\|Ramps and wheelchair assistance available...` |
| AI | `facility_2` | `🦽\|Wheelchair Service\|Wheelchairs can be requested...` |
| AJ | `facility_3` | `🏠\|Accommodation\|Guest houses and dormitories available...` |
| AK | `facility_4` | `🚗\|Parking\|Designated areas for cars, mini buses...` |
| AL | `facility_5` | `🍜\|Prasad & Meals\|Free basic prashad distribution...` |
| AM | `facility_6` | `🔒\|Gadget Storage\|Electronic gadgets not allowed inside...` |
| AN | `online_services` | Pipe-separated: `BoldLabel:desc` | `Puja Booking:Book various poojas online\|Donations:Secure online donations` |
| AO | `vehicle_pooja_desc` | Vehicle pooja description | `Vehicle Pooja is performed at temple during hours (5:00 AM – 10:00 PM)...` |
| AP | `lost_found_desc` | Lost & found description | `Visit administration office, describe lost item...` |

---

### 🔷 SECTION F — Guidelines Tab (Columns AQ–AX)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| AQ | `dress_men_do` | ✓ items (pipe-sep) | `Traditional attire is recommended` |
| AR | `dress_men_dont` | ✗ items (pipe-sep) | `Avoid shorts and sleeveless tops` |
| AS | `dress_women_do` | ✓ items (pipe-sep) | `Sarees or salwar kameez are preferred` |
| AT | `dress_women_dont` | ✗ items (pipe-sep) | `Avoid short skirts, sleeveless tops` |
| AU | `dress_festival_note` | Festival attire note | `Traditional Indian attire is strongly advised on special days` |
| AV | `etiquette_points` | Pipe-separated ✓ items | `Remove shoes before entering sanctum\|Maintain silence` |
| AW | `photography_rules` | Pipe-sep: `BoldLabel:desc` | `Photography inside:Not allowed\|Photography outside:Allowed` |
| AX | `accessibility_rules` | Pipe-sep bullet points | `Ramps and wheelchair assistance available\|No lift/elevator mentioned` |

---

### 🔷 SECTION G — How to Reach (Columns AY–BH)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| AY | `address_full` | Full address | `Pali Village, Sudhagad Taluka, Raigad District, Maharashtra – 410205` |
| AZ | `address_phone` | Phone number | `02142-242263` |
| BA | `air_airport_name` | Nearest airport name | `Navi Mumbai International Airport` |
| BB | `air_map_embed` | Google Maps embed URL (see instructions below ⬇️) | `https://www.google.com/maps/embed?pb=...` |
| BC | `train_station_name` | Nearest railway station & distance | `Khopoli Railway Station (~30 km)` |
| BD | `train_map_embed` | Google Maps embed URL | `https://www.google.com/maps/embed?pb=...` |
| BE | `bus_stand_name` | Bus stand name & cities | `Pali Bus Stand — from Mumbai & Pune` |
| BF | `bus_map_embed` | Google Maps embed URL | `https://www.google.com/maps/embed?pb=...` |
| BG | `taxi_desc` | Taxi/Auto description | `Taxis and autos available from Khopoli Station to temple directly` |

---

### 🔷 SECTION H — YouTube Video (Column BH)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| BH | `youtube_video_id` | Only the video ID (not full URL) | `pAtgE0CMKQs` |

> **How to get YouTube Video ID:**
> Full URL: `https://www.youtube.com/watch?v=pAtgE0CMKQs`
> ID = everything after `v=` → `pAtgE0CMKQs`

---

### 🔷 SECTION I — Timings (Columns BI–BP)

| Column | Header | What to Write | Example |
|--------|--------|--------------|---------|
| BI | `timing_morning` | Morning darshan timings | `5:00 AM – 8:00 AM` |
| BJ | `timing_midday` | Midday darshan timings | `12:00 PM – 2:00 PM` |
| BK | `timing_evening` | Evening darshan timings | `6:00 PM – 9:00 PM` |
| BL | `special_puja_1` | `PujaName\|Day` | `Rudra Abhisheka\|Every Friday` |
| BM | `special_puja_2` | `PujaName\|Day` | `Bhajana Seva\|Every Saturday` |
| BN | `special_puja_3` | `PujaName\|Day` | `Eshwar Dwija Pooja\|Sundays` |
| BO | `temple_full_timing` | Sidebar full timing | `5:00 AM – 10:00 PM` |
| BP | `timing_extended_note` | Festival extension note | `Extended on festival days` |

---

### 🔷 SECTION J — Architecture & Significance (Columns BQ–BZ)

| Column | Header | What to Write |
|--------|--------|--------------|
| BQ | `arch_style_desc` | Architectural style paragraph |
| BR | `arch_material_desc` | Building material paragraph |
| BS | `arch_scientific_desc` | Scientific aspects paragraph |
| BT | `arch_conservation_desc` | Conservation efforts paragraph |
| BU | `significance_para_1` | Significance paragraph 1 |
| BV | `significance_para_2` | Significance paragraph 2 |
| BW | `significance_para_3` | Significance paragraph 3 |

---

### 🔷 SECTION K — For Foreign Visitors (Columns CA–CF)

Each card: `Title\|Description` (pipe-separated)

| Column | Header |
|--------|--------|
| CA | `foreign_card_1` → e.g. `Historical Legend\|Understanding the legend of Ballala...` |
| CB | `foreign_card_2` → e.g. `Symbolism of Lord Ganesha\|Lord Ganesha is revered...` |
| CC | `foreign_card_3` → e.g. `Spiritual Practices\|Participate in meditation...` |
| CD | `foreign_card_4` → e.g. `Connection with Nature\|The temple's natural surroundings...` |
| CE | `foreign_card_5` → e.g. `Cultural Exchange\|Engage with locals and priests...` |
| CF | `foreign_card_6` → e.g. `Reflection & Contemplation\|Quiet reflection within temple...` |

---

### 🔷 SECTION L — Prasad (Columns CG–CI)

| Column | Header | Example |
|--------|--------|---------|
| CG | `prasad_items` | Pipe-sep: `Name\|Description` | `Ladoos\|Traditional sweet offerings\|Modaks\|Beloved sweet of Lord Ganesha` |
| CH | `prasad_cost_note` | Cost info | `Varies based on type and quantity. Check prasad counter.` |
| CI | `prasad_purchase_note` | Where to buy | `From designated counters within temple premises.` |

---

### 🔷 SECTION M — Puja Booking (Columns CJ–CN)

| Column | Header | Example |
|--------|--------|---------|
| CJ | `booking_online_desc` | Online booking description | `Bookings through temple's official website...` |
| CK | `booking_onsite_desc` | On-site booking description | `At temple office upon arrival...` |
| CL | `booking_daily_timing` | Daily puja detail | `Morning timings (specific times vary). Contact administration.` |
| CM | `booking_festival_note` | Festival day info | `Extended hours and special poojas — timings announced in advance.` |

---

### 🔷 SECTION N — Sidebar & Administration (Columns CN–CS)

| Column | Header | Example |
|--------|--------|---------|
| CN | `sidebar_nearest_railway` | `Khopoli Station (~30 km)` |
| CO | `sidebar_nearest_airport` | `Mumbai Airport (~120 km)` |
| CP | `sidebar_accessibility` | `Wheelchair accessible\|Ramps available\|Parking for all vehicles` |
| CQ | `admin_managing_body` | `Ballaleshwar Temple Trust` |
| CR | `admin_contact` | `02142-242263` |
| CS | `admin_address` | Full address one-liner |

---

## 🗺️ HOW TO GET GOOGLE MAPS EMBED URL

1. Go to [maps.google.com](https://maps.google.com)
2. Search for your location (e.g. "Khopoli Railway Station")
3. Click **Share** → **Embed a map**
4. Click **Copy HTML** — you'll get something like:
   ```html
   <iframe src="https://www.google.com/maps/embed?pb=!1m18!..." ...></iframe>
   ```
5. **Copy ONLY the URL** inside `src="..."` — paste that into the Excel column

---

## ▶️ YouTube Video ID

URL: `https://www.youtube.com/watch?v=pAtgE0CMKQs`
ID only: `pAtgE0CMKQs`

---

## 🔗 Image URL Guidelines

**Option 1 — Hosted on your server (recommended):**
```
https://divyadarshan360.com/blog/images/Ashtavinayaka Temple/ballaleshwar_1.jpg
```

**Option 2 — Relative path:**
```
/blog/images/Ashtavinayaka Temple/ballaleshwar_1.jpg
```

**Fallback:** If image URL is empty or broken, the blog auto-falls back to an Unsplash image.

---

## ▶️ HOW TO RUN THE SCRIPT

```bash
cd d:\pratik\divya_darshan\divya-darshan-360
python scripts/blog_generator/generate_blogs_from_excel.py
```

You will see output like:
```
✅  Generated: public/blog/temple/ashtwinayak/ballaleshwar.../index.html
✅  Generated: public/blog/temple/jyotirlinga/bhimashankar.../index.html
❌  Row 3: Missing required field 'temple_name' — skipped
---
Total: 2 generated, 1 skipped
```

---

## ⚠️ Common Mistakes to Avoid

| ❌ Wrong | ✅ Correct |
|---------|----------|
| Slug: `Ballaleshwar Temple` | Slug: `ballaleshwar-temple-pali` |
| Pipe separator: `,` | Pipe separator: `\|` |
| YouTube: full URL | YouTube: ID only (`pAtgE0CMKQs`) |
| Google Maps: full iframe HTML | Google Maps: URL only (from `src="..."`) |
| Leaving required fields blank | At minimum fill A, B, C, D, K, L, S columns |

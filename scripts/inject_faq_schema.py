"""Auto-inject FAQPage JSON-LD into every temple blog.

Strategy: each blog already has ~28 <h3 class="section__title"> sections,
most of which are literal questions (e.g. "Is there any Entry Fees?",
"How to Reach?", "What is the dress code?"). We extract each heading + the
content until the next heading and emit it as a FAQPage schema in <head>.

Content stays untouched. Only structured data is added — answer engines
(ChatGPT, Perplexity, Google AI Overview) read this to cite pages.

Idempotent — re-running replaces the existing schema block.

Run from frontend/:
    python scripts/inject_faq_schema.py
    python scripts/inject_faq_schema.py --dry-run
"""

from __future__ import annotations

import argparse
import html as html_mod
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEMPLE_DIR = ROOT / "public" / "blog" / "temple"

START_MARKER = "<!-- DD360_FAQ_SCHEMA_START -->"
END_MARKER = "<!-- DD360_FAQ_SCHEMA_END -->"

# Extracts the inner text + position of each section heading
SECTION_TITLE_RE = re.compile(
    r'<h3 class="section__title"[^>]*>(.*?)</h3>',
    re.S | re.I,
)
ARTICLE_CLOSE_RE = re.compile(r"</article>", re.I)
EXISTING_BLOCK_RE = re.compile(
    re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER) + r"\s*",
    re.S,
)
TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")

MIN_ANSWER_CHARS = 30
MAX_ANSWER_CHARS = 900  # Google FAQ rich-result limit is ~1000 per answer
SKIP_QUESTION_KEYWORDS = (
    # Headings that aren't real Q&A material
    "call to action or interaction links",
    "condensed information",
)


def strip_html(s: str) -> str:
    s = TAG_RE.sub(" ", s)
    s = html_mod.unescape(s)
    s = WHITESPACE_RE.sub(" ", s).strip()
    return s


def extract_qas(text: str) -> list[dict[str, str]]:
    """Pull every <h3 section__title>...</h3> and the content following it
    until the next h3.section__title (or </article>)."""
    matches = list(SECTION_TITLE_RE.finditer(text))
    if not matches:
        return []

    article_end_m = ARTICLE_CLOSE_RE.search(text)
    article_end = article_end_m.start() if article_end_m else len(text)

    qas: list[dict[str, str]] = []
    for i, m in enumerate(matches):
        question = strip_html(m.group(1))
        if not question:
            continue
        if any(kw in question.lower() for kw in SKIP_QUESTION_KEYWORDS):
            continue

        ans_start = m.end()
        ans_end = matches[i + 1].start() if i + 1 < len(matches) else article_end
        answer = strip_html(text[ans_start:ans_end])
        if len(answer) < MIN_ANSWER_CHARS:
            continue
        if len(answer) > MAX_ANSWER_CHARS:
            answer = answer[: MAX_ANSWER_CHARS - 1].rsplit(" ", 1)[0] + "…"

        qas.append({"q": question, "a": answer})

    return qas


def build_faq_jsonld(qas: list[dict[str, str]]) -> str:
    schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": qa["q"],
                "acceptedAnswer": {"@type": "Answer", "text": qa["a"]},
            }
            for qa in qas
        ],
    }
    payload = json.dumps(schema, ensure_ascii=False, separators=(",", ":"))
    return (
        f"{START_MARKER}\n"
        f'<script type="application/ld+json">{payload}</script>\n'
        f"{END_MARKER}\n"
    )


def inject_into_head(text: str, block: str) -> str:
    text = EXISTING_BLOCK_RE.sub("", text)
    head_close = re.search(r"</head>", text, re.I)
    if not head_close:
        return text
    return text[: head_close.start()] + block + text[head_close.start():]


def main(dry_run: bool) -> None:
    files = sorted(TEMPLE_DIR.rglob("index.html"))
    print(f"Scanning {len(files)} blog files…\n")

    updated = 0
    skipped_no_qa = 0
    qa_count_total = 0

    for path in files:
        text = path.read_text(encoding="utf-8")
        qas = extract_qas(text)
        if not qas:
            skipped_no_qa += 1
            continue

        block = build_faq_jsonld(qas)
        new_text = inject_into_head(text, block)
        if new_text == text:
            continue

        qa_count_total += len(qas)
        rel = path.relative_to(ROOT)
        if dry_run:
            print(f"  ~ would inject  {rel}  ({len(qas)} Q&A)")
        else:
            path.write_text(new_text, encoding="utf-8")
            print(f"  + injected      {rel}  ({len(qas)} Q&A)")
        updated += 1

    print()
    print(f"Blogs updated: {updated}")
    print(f"Blogs skipped (no extractable Q&A): {skipped_no_qa}")
    if updated:
        print(f"Average Q&A per blog: {qa_count_total / updated:.1f}")
    if dry_run:
        print("(dry run — no files written)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    main(args.dry_run)

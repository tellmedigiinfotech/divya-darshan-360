"""Strip stray markdown markers (# / ##/ ### / * / **) from khajuraho/index.html.

Targets:
  - Text nodes between > and < (skipping <style> blocks)
  - content="..." attribute values on <title>, <meta>, etc. (where leading "# " leaked in)

Leaves untouched:
  - HTML entities like &#x27;
  - CSS hex colors in class="..." / style="..." attributes
  - <style> block (Tailwind universal selectors etc.)
"""
from __future__ import annotations

import re
from pathlib import Path

FILE = Path(__file__).resolve().parents[1] / "public" / "blog" / "temple" / "popular" / "khajuraho" / "index.html"


def clean_text(s: str) -> str:
    # Leading markdown heading markers: ###, ##, # followed by space
    s = re.sub(r"^([ \t]*)#{1,3}[ \t]+", r"\1", s)
    # Mid-text lone `#` between spaces (e.g. "Image of # Khajuraho")
    s = re.sub(r" #(?=[ \t])", " ", s)
    # Markdown bold/italic markers — no legitimate * appears in this file's text
    s = s.replace("**", "")
    s = s.replace("*", "")
    return s


def process_html(html: str) -> str:
    # 1) Clean text nodes (between > and <)
    def text_repl(m: re.Match[str]) -> str:
        return ">" + clean_text(m.group(1)) + "<"

    html = re.sub(r">([^<]*)<", text_repl, html)

    # 2) Clean leading "# " inside content="..." attribute values (meta tags etc.)
    #    Only acts on a single leading hash run, won't touch &#x27; etc.
    def attr_repl(m: re.Match[str]) -> str:
        return f'content="{clean_text(m.group(1))}"'

    html = re.sub(r'content="([^"]*)"', attr_repl, html)
    return html


def main() -> None:
    src = FILE.read_text(encoding="utf-8")

    # Protect <style>...</style> by splitting around it
    style_re = re.compile(r"(<style\b[^>]*>.*?</style>)", re.S | re.I)
    parts = style_re.split(src)

    out_parts: list[str] = []
    for i, part in enumerate(parts):
        if i % 2 == 1:
            # <style> block — leave untouched
            out_parts.append(part)
        else:
            out_parts.append(process_html(part))

    new = "".join(out_parts)

    if new == src:
        print("No changes.")
        return

    FILE.write_text(new, encoding="utf-8")

    # Quick report
    def count(pat: str, text: str) -> int:
        return len(re.findall(pat, text))

    print(f"Cleaned: {FILE.relative_to(FILE.parents[4])}")
    print(f"  '###' before -> after : {count('###', src)} -> {count('###', new)}")
    print(f"  '##'  before -> after : {count(r'##', src)} -> {count(r'##', new)}")
    print(f"  '**'  before -> after : {count(r'\\*\\*', src)} -> {count(r'\\*\\*', new)}")
    print(f"  '*'   before -> after : {count(r'\\*', src)} -> {count(r'\\*', new)}")


if __name__ == "__main__":
    main()

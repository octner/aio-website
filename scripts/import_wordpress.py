#!/usr/bin/env python3
"""Import posts from the current WordPress site into the new content folders.

Input: a folder of Markdown copies of the WordPress posts (one file per post, with YAML
front matter: title, url, date, author, tags, featured_image ...), as made by the site
inventory of 14 November 2026.

Output: src/content/posts/*.md and src/content/resources/*.md in the format of
src/content.config.ts. The text of each post is kept as it is. The script only:
  - removes the first heading when it repeats the title,
  - shifts heading levels so that the highest one is a level-2 heading,
  - turns YouTube embed addresses into click-to-play video blocks,
  - applies the keep / merge decisions of the inventory (MAP below),
  - records each old address in "legacy", so the build writes a redirect page.

Usage:  python3 scripts/import_wordpress.py <folder with the copies> [--dry-run] [--force]
Existing files are kept unless --force is given, so edits made after the import are safe.
Python 3.9+, standard library only.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# old slug -> where the post goes. "merge_into" sends the old address to another post.
MAP: dict[str, dict] = {
    "aio-launch-new-2026": {"to": "posts", "type": "news", "slug": "aio-platform-launch"},
    "algorithms-dictate-everything-we-see-time-to-crack-them": {"to": "posts", "type": "news"},
    "aio-critical-to-information-integriy-senate-report": {"to": "posts", "type": "news", "slug": "aio-critical-to-information-integrity-reports"},
    "tracking-targeted-advertising-on-intimate-hygiene-products": {"to": "posts", "type": "case-study"},
    "building-global-connections-for-national-research-infrastructure-2": {"to": "posts", "type": "news", "slug": "building-global-connections-for-national-research-infrastructure"},
    "what-political-ads-are-australians-seeing-online": {"to": "posts", "type": "case-study"},
    "dark-ads-challenge-truth-and-our-democracy": {"to": "posts", "type": "news"},
    "current-research-projects": {"to": "posts", "type": "case-study", "slug": "research-projects-using-aio-2026"},
    "doing-digital-platform-research-webinar-april-2026": {"merge_into": "aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research"},
    "how-to-do-digital-platform-research-using-aio": {"merge_into": "aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research"},
    "aio-webinar-showcases-progress-and-future-directions-in-digital-platform-research": {"to": "posts", "type": "event", "slug": "webinar-doing-digital-platform-research-with-aio"},
    "social-media-algorithms-are-shrouded-in-secrecy-were-trying-to-change-that": {"to": "posts", "type": "news"},
    "aio-presentations-at-the-hass-and-indigenous-research-data-commons-symposium-2025-now-available": {"to": "posts", "type": "news", "slug": "aio-presentations-hass-indigenous-rdc-symposium-2025"},
    "sicss-melbourne-2026": {"to": "posts", "type": "event", "slug": "sicss-melbourne-2026-call-for-applications",
                             "extra": {"eventStart": "2026-06-22T09:00:00+10:00", "eventEnd": "2026-07-03T17:00:00+10:00", "location": "Melbourne"}},
    "partnering-for-public-data-literacy-qut-dmrc-at-woodford-folk-festival-2024": {"to": "posts", "type": "news", "slug": "public-data-literacy-woodford-folk-festival-2024"},
    "what-is-your-tiktok-personality-a-new-citizen-science-project-can-tell-you": {"to": "posts", "type": "case-study", "slug": "what-is-your-tiktok-personality"},
    "aio-co-design-process-invites-national-research-community-inputs": {"to": "posts", "type": "news", "slug": "ardc-co-design-process-invites-feedback-on-aio"},
    "building-digital-platform-observatories-symposium": {"merge_into": "bdo-event-uq-june-2026"},
    "bdo-event-uq-june-2026": {"to": "posts", "type": "event", "slug": "building-digital-platform-observatories-2026"},
    "online-ads-are-becoming-harder-to-spot-but-were-not-powerless-to-stop-it": {"to": "posts", "type": "news", "slug": "online-ads-are-becoming-harder-to-spot"},
    "high-school-students-explore-ai-media-literacy-and-digital-futures": {"to": "posts", "type": "news"},
    "sicss-2026-kicks-off-in-melbourne": {"to": "posts", "type": "news", "slug": "sicss-2026-starts-in-melbourne"},
    "sicss-melbourne-2026-our-first-week": {"to": "posts", "type": "news"},
    "ethics-guide": {"to": "resources", "kind": "how-to", "format": "guide"},
    "data-download-packages-explainer": {"to": "resources", "kind": "explanation", "format": "explainer"},
    "screen-capture-explainer": {"to": "resources", "kind": "explanation", "format": "explainer"},
    # Pages, not posts: written by hand under src/content/pages (their old addresses are in "legacy" there).
    "faq": {"skip": "src/content/pages/take-part/questions.md"},
    "share-your-data-for-research": {"skip": "src/content/pages/take-part/index.md"},
}

YOUTUBE = re.compile(r"^\s*<?https?://(?:www\.)?(?:youtube\.com/(?:embed/|watch\?v=)|youtu\.be/)([\w-]{11})[^\s>]*>?\s*$")


def parse(path: Path) -> tuple[dict, str]:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        raise SystemExit(f"{path}: no front matter")
    meta: dict = {}
    for line in m.group(1).splitlines():
        km = re.match(r"^([A-Za-z_]+):\s*(.*)$", line)
        if not km:
            continue
        key, val = km.group(1), km.group(2).strip()
        if val.startswith("[") and val.endswith("]"):
            try:
                meta[key] = json.loads(val)
            except json.JSONDecodeError:
                meta[key] = [v.strip().strip('"\'') for v in val[1:-1].split(",") if v.strip()]
        else:
            meta[key] = val.strip('"').strip("'")
    return meta, m.group(2)


def clean_body(body: str, title: str) -> str:
    lines = body.strip("\n").splitlines()
    # Drop a first heading that repeats the title.
    if lines and re.match(r"^#{1,6}\s", lines[0]) and lines[0].lstrip("#").strip().lower() == title.strip().lower():
        lines = lines[1:]
    # Video embeds -> click-to-play blocks (see src/components/Video.astro for the same markup).
    out = []
    for line in lines:
        m = YOUTUBE.match(line)
        if m:
            vid = m.group(1)
            out.append(
                f'<div class="video" data-youtube="{vid}"><a href="https://www.youtube.com/watch?v={vid}">'
                f'<img src="https://i.ytimg.com/vi/{vid}/hqdefault.jpg" alt="" loading="lazy" width="480" height="360">'
                f'<span class="play">Play video on YouTube: {title}</span></a></div>'
            )
        else:
            out.append(line)
    text = "\n".join(out)
    # Shift headings so the highest level used becomes ## (the page title is the only #).
    levels = [len(h) for h in re.findall(r"^(#{1,6})\s", text, re.M)]
    if levels:
        shift = min(levels) - 2
        if shift != 0:
            text = re.sub(r"^(#{1,6})(\s)", lambda m: "#" * max(2, min(6, len(m.group(1)) - shift)) + m.group(2), text, flags=re.M)
    # Collapse three or more blank lines.
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() + "\n"


def summary_from(body: str) -> str:
    for para in re.split(r"\n\s*\n", body):
        p = para.strip()
        if not p or p.startswith(("#", "<", "!", "|", "-", "*", ">", "[")):
            continue
        p = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", p)
        p = re.sub(r"[*_`]", "", p).replace("\n", " ")
        if len(p) < 40:
            continue
        if len(p) > 220:
            cut = p[:220].rsplit(" ", 1)[0]
            p = cut.rstrip(",;:") + "…"
        return p
    return ""


def yaml_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def main() -> None:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    if not args:
        raise SystemExit(__doc__)
    src = Path(args[0])
    files = {p.stem: p for p in sorted(src.rglob("*.md"))}

    legacy_extra: dict[str, list[str]] = {}
    for slug, rule in MAP.items():
        if "merge_into" in rule:
            legacy_extra.setdefault(rule["merge_into"], []).append(f"/{slug}/")

    unknown = sorted(set(files) - set(MAP))
    written = []
    for slug, rule in MAP.items():
        if "merge_into" in rule or "skip" in rule:
            continue
        if slug not in files:
            raise SystemExit(f"Missing copy for {slug}")
        meta, body = parse(files[slug])
        title = meta.get("title", slug)
        body = clean_body(body, title)
        new_slug = rule.get("slug", slug)
        legacy = [f"/{slug}/"] + legacy_extra.get(slug, [])
        image = meta.get("featured_image") or ""
        if re.search(r"Pattern_|\.svg$", image):  # decorative patterns and icons are not post images
            image = ""

        fm = [f"title: {yaml_str(title)}", f"date: {meta.get('date', '')[:10]}"]
        if rule["to"] == "posts":
            fm.append(f"type: {rule['type']}")
        else:
            fm += [f"kind: {rule['kind']}", f"format: {rule['format']}"]
        s = summary_from(body)
        if s:
            fm.append(f"summary: {yaml_str(s)}")
        if image and rule["to"] == "posts":  # only posts show a lead image
            fm.append(f"image: {yaml_str(image)}")
            alt = meta.get("featured_image_alt", "")
            fm.append(f"imageAlt: {yaml_str(alt)}")
        if rule["to"] == "posts" and meta.get("author"):
            fm.append(f"author: {yaml_str(meta['author'])}")
        for k, v in rule.get("extra", {}).items():
            fm.append(f"{k}: {yaml_str(v)}")
        fm.append("status: migrated")
        fm.append("legacy:")
        fm += [f"  - {l}" for l in legacy]
        out = ROOT / "src" / "content" / rule["to"] / f"{new_slug}.md"
        if out.exists() and "--force" not in sys.argv:
            print(f"  kept (exists, use --force to overwrite): {out.relative_to(ROOT)}")
            continue
        written.append(str(out.relative_to(ROOT)))
        if not dry:
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text("---\n" + "\n".join(fm) + "\n---\n\n" + body, encoding="utf-8")

    print(f"Wrote {len(written)} files" + (" (dry run)" if dry else ""))
    for w in written:
        print("  " + w)
    if unknown:
        print("Not in MAP (left out):", ", ".join(unknown))


if __name__ == "__main__":
    main()

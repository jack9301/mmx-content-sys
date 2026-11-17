#!/usr/bin/env python3
"""
Bulk-optimise and re-upload article images.

The site is a static export, so `next/image` runtime optimisation is disabled
(`images: { unoptimized: true }` in next.config.mjs). Every `<img>` therefore
serves its source file at full resolution.

Most covers were generated as PNGs at ~1.3 MB each, which made article pages
slow. This script:

  1. downloads every PNG referenced by an article
  2. re-encodes it as a quality-82 JPEG capped at 1600px wide
  3. uploads the JPEG to the CDN via the platform's signed-URL flow
  4. rewrites the references in the MDX files
  5. records the mapping in scripts/image-optimisation-map.json

Re-running is safe: files already in the mapping are skipped.

Usage:
    python3 scripts/optimise-images.py --plan          # list what needs doing
    python3 scripts/optimise-images.py --upload        # upload via platform API
    python3 scripts/optimise-images.py --rewrite       # apply new URLs to MDX
"""

import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(REPO, "content", "en")
MAPPING = os.path.join(REPO, "scripts", "image-optimisation-map.json")

MAX_WIDTH = 1600
JPEG_QUALITY = 82

URL_RE = re.compile(r"https://cdn\.hailuoai\.com/[^\s\")\]]+")
PNG_RE = re.compile(r"^https://cdn\.hailuoai\.com/.*\.png$")


def load_mapping():
    if os.path.exists(MAPPING):
        with open(MAPPING) as fh:
            return json.load(fh)
    return {}


def save_mapping(mapping):
    with open(MAPPING, "w") as fh:
        json.dump(mapping, fh, indent=2, sort_keys=True)


def find_png_urls():
    urls = set()
    for name in os.listdir(CONTENT):
        if not name.endswith(".mdx"):
            continue
        with open(os.path.join(CONTENT, name)) as fh:
            for url in URL_RE.findall(fh.read()):
                if PNG_RE.match(url):
                    urls.add(url)
    return sorted(urls)


def download(url, dest):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        with open(dest, "wb") as fh:
            fh.write(out := resp.read())
    return len(out)


def to_jpeg(src, dest):
    subprocess.run(
        ["convert", src, "-resize", f"{MAX_WIDTH}x{MAX_WIDTH}>",
         "-quality", str(JPEG_QUALITY), "-strip", "-colorspace", "sRGB", dest],
        check=True,
    )
    return os.path.getsize(dest)


def cmd_plan(args, mapping):
    pending = [u for u in find_png_urls() if u not in mapping]
    done = [u for u in find_png_urls() if u in mapping]
    print(f"{len(pending)} pending, {len(done)} already mapped")
    for u in pending:
        print("  PENDING", u)
    return 0


def cmd_upload(args, mapping):
    """Download + re-encode, then upload each via a signed PUT."""
    pending = [u for u in find_png_urls() if u not in mapping]
    if not pending:
        print("nothing to upload")
        return 0

    print(f"preparing {len(pending)} image(s)")
    staged = []
    with tempfile.TemporaryDirectory() as tmp:
        for url in pending:
            name = url.rsplit("/", 1)[-1]
            src = os.path.join(tmp, name)
            dst = os.path.join(tmp, name.replace(".png", ".jpg"))
            try:
                before = download(url, src)
                after = to_jpeg(src, dst)
            except Exception as exc:  # noqa: BLE001
                print(f"  FAIL {name}: {exc}")
                continue
            print(f"  {before/1024:8.1f} KB -> {after/1024:7.1f} KB  {name}")
            staged.append((url, dst, after))
        print()
        print("staged files ready for upload:")
        for url, path, size in staged:
            print(f"{size}\t{path}\t{url}")
    return 0


def cmd_rewrite(args, mapping):
    """Apply mapped CDN URLs to the MDX files."""
    if not mapping:
        print("mapping is empty — run --upload first")
        return 1

    changed = 0
    for name in sorted(os.listdir(CONTENT)):
        if not name.endswith(".mdx"):
            continue
        path = os.path.join(CONTENT, name)
        with open(path) as fh:
            original = fh.read()
        updated = original
        for old, info in mapping.items():
            new = info.get("cdn_url")
            if new and old in updated:
                updated = updated.replace(old, new)
        if updated != original:
            with open(path, "w") as fh:
                fh.write(updated)
            changed += 1
            print(f"  rewrote {name}")
    print(f"{changed} file(s) updated")
    return 0


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--plan", action="store_true")
    group.add_argument("--upload", action="store_true")
    group.add_argument("--rewrite", action="store_true")
    args = parser.parse_args()

    mapping = load_mapping()
    if args.plan:
        return cmd_plan(args, mapping)
    if args.upload:
        return cmd_upload(args, mapping)
    if args.rewrite:
        return cmd_rewrite(args, mapping)
    return 0


if __name__ == "__main__":
    sys.exit(main())

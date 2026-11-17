#!/usr/bin/env python3
"""
Upload one staged image to the CDN and record it in the optimisation map.

Usage:
    python3 scripts/put_image.py <staged-filename.jpg> <put_url>

The put_url comes from the platform's get_upload_url tool (600 s expiry), so the
URL and the upload have to happen back to back.
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = os.path.join(REPO, "scripts", "image-optimisation-map.json")
STAGE = "/workspace/img_stage"
SRC = "https://cdn.hailuoai.com/mcp/image_tool/output/513289654133362689/410025998700867/"


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        return 1
    staged, put_url = sys.argv[1], sys.argv[2]

    src = os.path.join(STAGE, staged)
    if not os.path.exists(src):
        print(f"missing staged file: {src}")
        return 1

    size = os.path.getsize(src)
    # Content-Length MUST be set explicitly: the signed canonical request includes
    # it (x-oss-additional-headers=content-length), so letting curl compute it
    # produces a different canonical request and OSS rejects the signature.
    proc = subprocess.run(
        ["curl", "-s", "-X", "PUT",
         "-H", "Content-Type: image/jpeg",
         "-H", f"Content-Length: {size}",
         "--data-binary", f"@{src}", put_url, "-w", "%{http_code}"],
        capture_output=True, text=True, timeout=120,
    )
    code = proc.stdout.strip()
    if not code.endswith("200"):
        print(f"FAILED {staged}: {code[-300:]}")
        return 1

    # Derive the new CDN URL from the returned put_url path. The put_url host is
    # the OSS endpoint; the public CDN URL drops the /cdn-yingshi-ai-com bucket
    # segment that appears in the signed path.
    path = put_url.split(".com", 1)[1].split("?", 1)[0]
    path = path.replace("/cdn-yingshi-ai-com/", "/")
    cdn = "https://cdn.hailuoai.com" + path
    original = SRC + staged[:-4] + ".png"

    with open(MAP) as fh:
        mapping = json.load(fh)
    mapping[original] = {"cdn_url": cdn}
    with open(MAP, "w") as fh:
        json.dump(mapping, fh, indent=2, sort_keys=True)

    done = len([v for v in mapping.values() if v.get("cdn_url")])
    print(f"OK {staged} {size//1024}KB -> {cdn.rsplit('/',1)[-1]}  [{done}/{len(mapping)}]")
    return 0


if __name__ == "__main__":
    sys.exit(main())

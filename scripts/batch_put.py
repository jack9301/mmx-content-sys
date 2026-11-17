#!/usr/bin/env python3
"""
Batch-upload staged images to the CDN and record them in the optimisation map.

The platform issues one signed PUT URL per file via get_upload_url (600 s expiry).
This script does the PUT and the map update for each file; supply the URLs as
`filename=put_url` pairs on the command line (or via --pairs-file).

Usage:
    python3 scripts/batch_put.py file1.jpg "<put_url1>" file2.jpg "<put_url2>" ...
    python3 scripts/batch_put.py --pairs-file pairs.txt

pairs.txt format, one per line:
    staged_filename.jpg<TAB>put_url
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = os.path.join(REPO, "scripts", "image-optimisation-map.json")
STAGE = "/workspace/img_stage"
SRC = "https://cdn.hailuoai.com/mcp/image_tool/output/513289654133362689/410025998700867/"


def upload(staged, put_url):
    src = os.path.join(STAGE, staged)
    if not os.path.exists(src):
        return False, "missing staged file"
    size = os.path.getsize(src)
    proc = subprocess.run(
        ["curl", "-s", "-X", "PUT",
         "-H", "Content-Type: image/jpeg",
         "-H", f"Content-Length: {size}",
         "--data-binary", f"@{src}", put_url, "-w", "%{http_code}"],
        capture_output=True, text=True, timeout=120,
    )
    code = proc.stdout.strip()
    return code == "200", (code[-120:] if code != "200" else "ok")


def record(staged, put_url, mapping):
    path = put_url.split(".com", 1)[1].split("?", 1)[0]
    path = path.replace("/cdn-yingshi-ai-com/", "/")
    cdn = "https://cdn.hailuoai.com" + path
    original = SRC + staged[:-4] + ".png"
    mapping[original] = {"cdn_url": cdn}
    return cdn


def main():
    pairs = []
    args = sys.argv[1:]
    if args and args[0] == "--pairs-file":
        with open(args[1]) as fh:
            for line in fh:
                line = line.rstrip("\n")
                if not line.strip():
                    continue
                f, u = line.split("\t", 1)
                pairs.append((f, u))
    else:
        for i in range(0, len(args), 2):
            pairs.append((args[i], args[i + 1]))

    if not pairs:
        print(__doc__)
        return 1

    with open(MAP) as fh:
        mapping = json.load(fh)

    ok = 0
    for staged, put_url in pairs:
        good, msg = upload(staged, put_url)
        if good:
            cdn = record(staged, put_url, mapping)
            ok += 1
            print(f"OK   {staged}  ->  {cdn.rsplit('/', 1)[-1]}")
        else:
            print(f"FAIL {staged}: {msg}")

    with open(MAP, "w") as fh:
        json.dump(mapping, fh, indent=2, sort_keys=True)

    done = len([v for v in mapping.values() if v.get("cdn_url")])
    print(f"\n{ok}/{len(pairs)} uploaded | {done}/{len(mapping)} mapped")
    return 0 if ok == len(pairs) else 1


if __name__ == "__main__":
    sys.exit(main())

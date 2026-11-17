#!/usr/bin/env python3
"""
Upload driver for the staged image set.

Reads the optimisation map, picks files that still lack a `cdn_url`, and for
each one asks the caller for a signed PUT url on stdin, then performs the PUT
and records the resulting public CDN url back into the map.

The signed-url service is only reachable as a platform tool call, so the url is
supplied from outside. Two input modes:

  # interactive-ish: url on stdin, one per line, in the order the driver asks
  python3 scripts/upload_driver.py --ask

  # pairs file: filename<TAB>put_url per line
  python3 scripts/upload_driver.py --pairs pairs.txt

In --ask mode the driver prints the filename it needs a url for, as a single
line `NEED <filename>`, then reads one line from stdin containing either the
raw put_url or `SKIP`.
"""
import json
import os
import subprocess
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAP = os.path.join(REPO, "scripts", "image-optimisation-map.json")
STAGE = "/workspace/img_stage"
SRC = "https://cdn.hailuoai.com/mcp/image_tool/output/513289654133362689/410025998700867/"


def load_map():
    with open(MAP) as fh:
        return json.load(fh)


def save_map(mapping):
    with open(MAP, "w") as fh:
        json.dump(mapping, fh, indent=2, sort_keys=True)


def remaining(mapping):
    """Staged filenames still needing a CDN url, in map order."""
    done = {k for k, v in mapping.items() if v.get("cdn_url")}
    staged = {f for f in os.listdir(STAGE) if f.endswith(".jpg")}
    out = []
    for key in sorted(mapping):
        if key in done:
            continue
        candidate = key.rsplit("/", 1)[-1].replace(".png", ".jpg")
        if candidate in staged:
            out.append(candidate)
    return out


def put(staged, put_url):
    src = os.path.join(STAGE, staged)
    if not os.path.exists(src):
        return False, "missing staged file"
    size = os.path.getsize(src)
    proc = subprocess.run(
        ["curl", "-s", "-X", "PUT",
         "-H", "Content-Type: image/jpeg",
         "-H", f"Content-Length: {size}",
         "--data-binary", f"@{src}", put_url, "-w", "%{http_code}"],
        capture_output=True, text=True, timeout=180,
    )
    code = proc.stdout.strip()
    if code == "200":
        return True, "ok"
    return False, (code[-140:] if code else "no response")


def cdn_from(put_url):
    path = put_url.split(".com", 1)[1].split("?", 1)[0]
    path = path.replace("/cdn-yingshi-ai-com/", "/")
    return "https://cdn.hailuoai.com" + path


def main():
    args = sys.argv[1:]
    mode = args[0] if args else "--ask"

    mapping = load_map()
    todo = remaining(mapping)
    if not todo:
        done = len([v for v in mapping.values() if v.get("cdn_url")])
        print(f"nothing to upload | {done}/{len(mapping)} mapped")
        return 0

    pairs = []
    if mode == "--pairs":
        with open(args[1]) as fh:
            for line in fh:
                line = line.rstrip("\n")
                if not line.strip():
                    continue
                f, u = line.split("\t", 1)
                pairs.append((f, u))
    else:
        # --ask: pull one url per line from stdin, matching filenames in order
        wanted = []
        for staged in todo:
            print(f"NEED {staged}", flush=True)
            line = sys.stdin.readline()
            if not line:
                break
            url = line.strip()
            if not url or url.upper() == "SKIP":
                continue
            wanted.append((staged, url))
        pairs = wanted

    ok = 0
    for staged, put_url in pairs:
        good, msg = put(staged, put_url)
        if good:
            cdn = cdn_from(put_url)
            original = SRC + staged[:-4] + ".png"
            mapping[original] = {"cdn_url": cdn}
            ok += 1
            print(f"OK   {staged}  ->  {cdn.rsplit('/', 1)[-1]}", flush=True)
        else:
            print(f"FAIL {staged}: {msg}", flush=True)

    save_map(mapping)
    done = len([v for v in mapping.values() if v.get("cdn_url")])
    print(f"\n{ok}/{len(pairs)} uploaded | {done}/{len(mapping)} mapped")
    return 0 if ok == len(pairs) else 1


if __name__ == "__main__":
    sys.exit(main())

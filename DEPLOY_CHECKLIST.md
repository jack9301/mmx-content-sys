# Deploy Checklist

Use this for every publish. Batch steps — don't run one command at a time.

## 1. Before committing
- [ ] All images regenerated this session already passed `images_understand`
- [ ] Alt text matches the image it describes (check the actual file, not the old caption)
- [ ] `git status --short` — confirm only intended files changed

## 2. Build + validate (ONE command, ~60s)
```bash
cd /workspace/content-site && npm run build 2>&1 | tail -20
```
Expect: `SEO validation: N articles checked`, `0 errors, 0 warnings`.

## 3. Commit + push (ONE command)
```bash
cd /workspace/content-site && rm -rf out/zh out/ja && git add -A && \
git -c user.name=jack9301 -c user.email=jack9301@users.noreply.github.com commit -m "..." && \
DISPLAY=:0 GIT_ASKPASS=/root/.git-askpass.sh git -c core.askPass=/root/.git-askpass.sh -c http.version=HTTP/1.1 push origin main
```
If push fails with a TLS error, retry once — it's transient.

## 4. Verify deploy — BOUNDED, max 4 polls
```bash
cd /workspace/content-site && for i in 1 2 3 4; do \
  sleep 25; c=$(curl -s -o /dev/null -w "%{http_code}" "https://www.agubi.com/en/articles/<slug>/" --max-time 25); \
  echo "poll $i: $c"; [ "$c" = "200" ] && break; done
```
**Stop at 4 polls.** If still not live, report the status rather than polling again.

## Rules
- Never poll more than 4 times. A failed poll is information, not a reason to keep trying.
- Never re-run a build that already succeeded.
- Never re-run a push that already succeeded.
- Batch related `exec` calls into one command rather than issuing them one at a time.
- After a successful result, report it — don't re-verify the same thing.

## Image verification budget
- Batch `images_understand` at 20 images per call (the hard max).
- Only verify images that depict a person or anatomy. Skip abstract/botanical/food/product images —
  they can't read as female and cost 60–120s per batch to check.
- Prefer verifying right after generation, before wiring into MDX, rather than auditing a whole
  article at the end.

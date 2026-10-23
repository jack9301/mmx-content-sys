# AGENTS.md — Agubi Men's Health

**Read this first.** This file is the entry point for any AI agent or developer working on this project. It contains everything needed to work on the site without prior context.

If you are an AI agent: read this file, then `WRITING_STYLE.md`, then `DECISIONS.md`, before making any changes.

---

## 1. What this project is

**Agubi Men's Health** — an evidence-based men's health site focused on prostate health. Tagline: *"Evidence-based care for prostate health."* Contact: `contact@agubi.com`.

- **Live URL:** https://www.agubi.com
- **Audience:** Men with prostate symptoms (prostatitis, CPPS, BPH, cancer concerns) who want clear, evidence-based information without the usual hype or fear-mongering.
- **Editorial stance:** Clinical, non-moralistic, evidence-first. We say "the evidence is mixed" when it is mixed. We do not oversell supplements, do not moralize sexual health, and do not push readers toward any specific product.
- **Publishing cadence:** ~2–4 articles per month.
- **Current inventory:** 27 English articles across 6 categories.

This is a **YMYL site** (Your Money or Your Life) per Google's classification. Medical accuracy and sourcing matter more than engagement metrics.

---

## 2. Tech stack — do not change without explicit permission

| Layer | Technology |
|---|---|
| Framework | Next.js 14.2.35 (App Router) |
| UI | React 18, TypeScript, Tailwind CSS 3.4 |
| i18n | next-intl 3.20 — **English only** (see DECISIONS.md) |
| Content | MDX via `next-mdx-remote` + `gray-matter` + `reading-time` |
| Output | Static export (`output: 'export'`, `trailingSlash: true`) |
| Hosting | Cloudflare Pages — project `mmx-content-sys02` |
| Domain | `www.agubi.com` (apex redirects) |
| Git | GitHub — `jack9301/mmx-content-sys`, branch `main` |
| CI/CD | Push to `main` → auto-build → auto-deploy |
| Serverless | Cloudflare Pages Functions (`functions/api/comments.js`) |
| Storage | Cloudflare KV namespace `COMMENTS_KV` (comments + rate limiting) |
| Build gate | `npm run validate:seo && next build` — SEO validation runs before every build |

---

## 3. Repository layout

```
content-site/
├── content/
│   ├── en/              # 27 MDX articles (the only active locale)
│   ├── zh/              # 4 legacy MDX files — UNUSED, do not delete
│   └── ja/              # 4 legacy MDX files — UNUSED, do not delete
├── messages/
│   ├── en.json          # Active UI strings
│   ├── zh.json          # Legacy, unused
│   └── ja.json          # Legacy, unused
├── src/
│   ├── app/
│   │   ├── [locale]/    # All routes live under the locale segment
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── articles/page.tsx        # Article index
│   │   │   ├── articles/[slug]/page.tsx # Article detail
│   │   │   ├── category/[slug]/page.tsx # Category listing
│   │   │   ├── admin/comments/page.tsx  # Comments moderation UI
│   │   │   └── about|privacy|cookies|disclosure/search/
│   │   ├── sitemap.ts   # Sitemap generation
│   │   └── robots.ts    # robots.txt generation
│   ├── components/      # React components (see §5)
│   ├── i18n/
│   │   └── routing.ts   # Locale config — currently ['en']
│   └── lib/
│       ├── articles.ts            # MDX loading + frontmatter parsing
│       ├── article-categories.ts  # slug → category map
│       ├── seo.ts                 # SITE_URL, SUPPORTED_LOCALES, hreflang
│       ├── json-ld.ts             # Schema.org structured data
│       ├── related-articles.ts    # Related-article scoring
│       └── mdx-headings.ts        # Heading extraction for TOC
├── functions/api/
│   └── comments.js      # Cloudflare Pages Function (KV-backed)
├── scripts/
│   └── validate-seo.ts  # Build-time SEO gate
├── out/                 # Build output (gitignored)
└── public/              # Static assets
```

---

## 4. Writing a new article — the workflow

Follow this order. Do not skip step 6.

### Step 1 — Confirm scope with the user

The user typically provides key points (sometimes rough/ungrammatical) and expects you to:
- Correct and expand the content faithfully
- Structure it properly
- Propose a title
- Not add unnecessary "extras" beyond what was asked

If they ask to review before writing, present a plan and wait for a green light.

### Step 2 — Generate images

Use `image_synthesize`. Settings that work reliably:

- **Aspect ratio:** `16:9`
- **Style prompt keywords:** `watercolor`, `soft`, `peach and sage green palette`, `abstract`, `gentle brushstrokes`, `no text or labels`, `16:9`
- **Batch up to 8 at a time.** The service fails intermittently — retry failures individually with a shorter prompt.
- **Cover image:** erotic-adjacent anatomy is acceptable but must be tasteful/abstract.
- **Real product photos:** when the article discusses a specific product (cushion, chair), use `images_search_and_download` and upload via `get_upload_url` + PUT, rather than generating an illustration.

Image URLs will look like:
```
https://cdn.hailuoai.com/mcp/image_tool/output/513289654133362689/410025998700867/1792544062_4aca5f22.png
```

### Step 3 — Write the MDX

Frontmatter shape (**use `excerpt`, never `description`**):

```yaml
---
title: "Article Title Here"
excerpt: "70-160 char meta description. Direct, specific, benefit-driven."
date: 2026-10-22
coverImage: "https://cdn.hailuoai.com/.../xxx.png"
tags: ["tag1", "tag2", "tag3", "tag4"]
keyTakeaways:
  - "First key point"
  - "Second key point"
  - "Third key point"
---
```

Body rules:
- **Do NOT repeat the cover image inline.** The frontmatter `coverImage` renders as the hero. Adding it again in the body renders it twice. (This was a real bug — see DECISIONS.md.)
- Include 3–5 inline images after the frontmatter.
- No H1 in the body — the `ArticleHeader` component renders the title.
- At least one `##` H2 is required (for the TOC).
- End with a `**References**` block.

### Step 4 — Register the category

Add the slug to `src/lib/article-categories.ts`:

```ts
'new-article-slug': 'conditions',   // or treatment, causes-risk, etc.
```

**Missing this is a build error** — `validate-seo.ts` flags articles with no category entry as orphans.

### Step 5 — Nothing else to wire up

The article page, sitemap, related-articles, TOC, and Key Takeaways all read from frontmatter automatically. There is no index file to update.

### Step 6 — Build (this runs the SEO gate)

```bash
npm run build
```

This runs `validate:seo` first. **If it reports errors, the build fails.** Fix and re-run.

### Step 7 — Commit and push

```bash
cd /workspace/content-site
rm -rf out/zh out/ja   # stale dirs from the old multi-locale era
git add -A
git -c user.name=jack9301 -c user.email=jack9301@users.noreply.github.com commit -m "Add '<Title>' article (<category> category, <N> words, <M> images)"
DISPLAY=:0 GIT_ASKPASS=/root/.git-askpass.sh git -c core.askPass=/root/.git-askpass.sh -c http.version=HTTP/1.1 push origin main
```

Cloudflare Pages builds and deploys automatically (~2–3 min).

**Push troubleshooting:** transient network failures happen. Retry once. If it fails twice, check `git log origin/main..HEAD --oneline` before retrying — the push may have partially succeeded.

---

## 5. Components you should know about

| Component | Purpose | Key prop |
|---|---|---|
| `article-header.tsx` | Renders title, date, read time, cover image | `article` |
| `key-takeaways.tsx` | Teal callout box, auto-renders if `keyTakeaways` exists | `items: string[]` |
| `table-of-contents.tsx` | Sticky sidebar TOC, IntersectionObserver scroll-spy, desktop only | `headings` |
| `reading-progress.tsx` | 2px teal progress bar fixed to viewport top | none |
| `related-articles.tsx` | 3 related articles, scored by category + tags | `articles` |
| `article-footer.tsx` | Tag list | `article` |
| `comments.tsx` | Comment form + list, hits `/api/comments` | `slug`, `locale` |
| `language-switcher.tsx` | Currently renders static "EN" (single-locale mode) | `currentLocale` |

**Scoring for related articles** (`src/lib/related-articles.ts`): same category = +10, each shared tag = +3. Excludes the current article. Falls back to category-only, then cross-category tag match.

---

## 6. SEO rules — enforced automatically

`scripts/validate-seo.ts` runs before every build. Errors fail the build; warnings do not.

### Errors (build-blocking)

- Missing `title`
- Missing `excerpt` → empty meta description
- Missing or non-absolute `coverImage`
- Cover image also present inline in the body (duplicate render)
- Missing or unparseable `date`
- Non-absolute inline image URLs
- Slug in `article-categories.ts` with no matching MDX file (orphan)

### Warnings

- Title longer than 70 chars
- Excerpt outside 70–160 chars
- Fewer than 3 tags
- No H2 headings (means no TOC)
- `category:` frontmatter disagrees with `article-categories.ts`

### Other SEO conventions (not enforced, but follow them)

- Excerpts should be 120–155 chars for best SERP display
- Titles under 60 chars avoid truncation
- `dateModified` in JSON-LD uses file mtime — this means **editing an article updates its `lastmod` automatically**, which is desirable
- Article pages emit `hreflang` only for locales where a translation actually exists (`alternatesForArticle`)

---

## 7. Hard rules — the user has stated these explicitly

1. **Never write a "when to see a doctor," "see me in clinic," or "when to come see me" section.** Articles close on a substantive summary. This is a standing rule for all future articles.
2. **Aim for 5–6 minutes of reading time (1,200–1,600 words).** This is the default target, not a hard cap — some articles genuinely need more, and cutting them would remove the value. Go longer when the content requires it; just don't pad to fill the space. Check with `wc -w` and judge on whether every paragraph earns its place. See `WRITING_STYLE.md` §2.
3. **No filler phrases.** Cut these on sight: "It is important to note that", "It is worth noting that", "Ultimately,", "In essence,", "In short,", "The honest answer is that", "Notably,", "Importantly,", "Specifically," and wordy intensifiers ("really", "very", "just", "quite", "absolutely", "arguably", "literally", "honestly", "essentially", "fundamentally").
4. **Keep all citations.** Never cut references for brevity. This is YMYL medical content and the sourcing is the point.
5. **No moralizing about sexual content.** Frame pornography, masturbation, and frequency clinically — vasocongestion, pelvic floor load, recovery patterns. The user has explicitly asked for this.
6. **Respect the user's scope.** When given key points, expand and correct them faithfully but do not bolt on unrequested sections.
7. **Do not add a CMS.** Content stays as MDX files in git.
8. **Do not modify the agent config file** or use any auto-fix command. Config changes go through the `gateway` tool only.

---

## 8. Credentials and identifiers

| Item | Value |
|---|---|
| GitHub user | `jack9301` |
| GitHub repo | `https://github.com/jack9301/mmx-content-sys.git` |
| Git identity | `jack9301 <jack9301@users.noreply.github.com>` |
| Git askpass | `/root/.git-askpass.sh` (mode `755`) |
| Cloudflare project | `mmx-content-sys02` |
| KV namespace | `COMMENTS_KV` |
| Admin env var | `COMMENTS_ADMIN_TOKEN` |
| Comments admin URL | `https://www.agubi.com/en/admin/comments?token=<COMMENTS_ADMIN_TOKEN>` |
| Build command | `npm run build` |
| Build output dir | `out/` |
| Node version | 20 |

**Note:** the GitHub PAT stored in `/root/.git-askpass.sh` should be rotated before the site reaches meaningful traffic. It is a long-lived classic token with repo scope.

---

## 9. Brand

| Element | Value |
|---|---|
| Site name | Agubi Men's Health |
| Tagline | Evidence-based care for prostate health. |
| Primary color | `#0f766e` (teal) |
| Background | `#fdfdfc` (cream) |
| Fonts | Inter (sans) + Source Serif 4 (serif, used for article body and headings) |
| Mode | Light only — dark mode was removed deliberately |
| Legal pages | `/en/privacy`, `/en/cookies`, `/en/disclosure` (affiliate disclosure) |

---

## 10. When you are uncertain

Ask. The user prefers a clarifying question to a wrong assumption.

Some things that are genuinely ambiguous and worth confirming:
- Article length target (the user has said "extend" and "keep it tight" in the same conversation)
- Whether a new article should have a Key Takeaways box (default: yes)
- Whether to generate new images or reuse existing ones when the image service is down

---

## 11. Related documents

- **`WRITING_STYLE.md`** — the article voice, structure, and conventions in detail
- **`DECISIONS.md`** — architectural decisions with rationale, so they are not accidentally reversed

If you make a decision that future contributors would need to understand, add it to `DECISIONS.md`.
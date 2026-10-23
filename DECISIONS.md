# DECISIONS.md — Architectural Decision Log

Every decision here has a rationale. **Do not reverse a decision without understanding why it was made** — several of these fixed real problems that will silently return if undone.

Newest first.

---

## 2026-10-23 — Reading-time target: 5–6 minutes (1,200–1,600 words)

**Context:** The finasteride/dutasteride article came in at 2,894 words — about 14 minutes to read. The user's assessment: *"a little bit long for the readers because everybody is busy now."*

This prompted an audit of all 28 articles. Only two were under 1,600 words; the longest was 3,496. The writing had been drifting long, and most articles should be shorter.

**The user then clarified the intent**, which is the important part:

> *"the words and reading time is not a mandatory rule, you can adjust it flexible according to the article's contents. It means that the article reading time and article words can exceed these rules if it has to do so, but the best reading time it should be in this range."*

**Decision:** 5–6 minutes (1,200–1,600 words) is the **default target, not a hard cap.** Articles that genuinely need to run longer should. The failure mode to avoid is not length — it's padding.

**Where it's documented:**
- `AGENTS.md` §7, hard rule #2 — phrased as a target, with explicit permission to exceed
- `WRITING_STYLE.md` §2 — the judgment call, when splitting is better than compressing, and the usual fat to cut first
- `WRITING_STYLE.md` §10 — first item on the pre-publish checklist, framed as a check rather than a gate

**The principle as the user stated it:** write to the content. If cutting to 1,600 words would remove the thing that makes the article worth reading, don't cut. If paragraphs exist because they were written rather than because they carry weight, cut them regardless of the total.

**Structural mitigation for long articles:** the Key Takeaways box and in-article TOC let a reader get the value in 30 seconds or navigate directly to the section they need. This is why long articles are acceptable here in a way they wouldn't be on a site without those affordances.

**Reversible:** Yes.

---

## 2026-10-22 — Wrote AGENTS.md, WRITING_STYLE.md, DECISIONS.md

**Context:** The project existed only as code plus one agent's conversation memory. If that agent restarted with no memory, it would have the code but none of the reasoning — and would likely reintroduce bugs that were already fixed.

**Decision:** Three documentation files at the repo root, committed to git so they survive any agent restart.

- `AGENTS.md` — architecture, workflow, hard rules, credentials
- `WRITING_STYLE.md` — voice, structure, evidence conventions
- `DECISIONS.md` — this file

**Reversible:** Yes, but then the next agent has no context and the problem returns.

---

## 2026-10-21 — Build-time SEO validation

**Context:** Four articles used `description:` in frontmatter while the loader only read `excerpt:`. Those four pages shipped `<meta name="description" content="">` to Google for weeks. Nothing caught it — it looked like a normal build.

**Decision:** `scripts/validate-seo.ts` runs automatically before every build (`npm run build` = `npm run validate:seo && next build`). Errors fail the build. Additionally added `data.excerpt ?? data.description` fallback in `articles.ts` so the wrong field name degrades gracefully rather than silently.

Checks: missing title, missing excerpt, missing/non-absolute cover, cover duplicated inline, missing/invalid date, non-absolute inline images, orphan category registrations. Warnings: long titles, out-of-range excerpts, too few tags, no H2, category mismatch.

**Result:** 27 articles, 0 errors, 0 warnings.

**Reversible:** Yes, but you'd lose the safety net.

---

## 2026-10-21 — Site is English-only

**Context:** The site supported `en`, `zh`, `ja` in routing. Only 4 articles had ZH and JA translations; the other 23 declared `hreflang` alternates for locales where nothing existed. Google crawled those URLs, hit Next.js's 404 page (which returns HTTP 200 with `noindex`), and Search Console reported ~80 pages as **"Not found (404) — Alternate page with proper canonical tag."**

Two fixes were attempted in sequence. First, gating hreflang per-locale with `alternatesForArticle()` — this worked for article pages but didn't remove the soft-404 URLs from the index. The final fix was removing the locales.

**Decision:** `SUPPORTED_LOCALES = ['en']` in `src/lib/seo.ts`, `locales: ['en']` in `src/i18n/routing.ts`.

**Preserved on purpose:** `content/zh/*.mdx`, `content/ja/*.mdx`, `messages/zh.json`, `messages/ja.json` were **not deleted**. If translations are ever commissioned, restore the two arrays and the content is already there.

**To reverse:** Uncomment the locale arrays, run `npm run build`, delete `out/zh` and `out/ja`.

---

## 2026-10-18 — No "when to see a doctor" sections

**Context:** The user gave a direct instruction: delete the "when to come in and see me" section from an article, and do not use that pattern in future articles.

**Decision:** No article closes with a doctor referral, clinic booking prompt, or "seek medical attention" sign-off. Articles close on substantive summary. If clinical red flags are genuinely relevant (the prostate-massage-safety article has a contraindications table), they appear as **clinical information in the body**, not as a call to action in the close.

**Reversible:** Only if the user asks.

---

## 2026-10-18 — Urocare style as the house default

**Context:** The first version of the frequent-erections article used a first-person urologist voice. The user liked the directness but wanted the site to have a consistent, more scannable style, pointing to a clinic article as a model.

**Decision:** Default to second person, two-sentence opener, Key Takeaways box, question-led H2s, bold lead-in lists. First person only on explicit request.

**Important nuance the user clarified:** the reference article's metrics (15–20 word sentences, paragraph length) are **reference points, not a format to enforce**. Adapt structure to content. A comparison piece gets a table; a mechanism piece gets a physiology walkthrough.

**Documented in:** `WRITING_STYLE.md`.

---

## 2026-10-17 — SEO validator added (see 2026-10-21 entry)

Superseded by the 2026-10-21 entry, which describes the current state.

---

## 2026-10-15 — Reading progress bar + in-article TOC

**Context:** Articles run 1,500–3,500 words with no navigational aids.

**Decision:** Two components, both opt-in by article content:
- `reading-progress.tsx` — 2px teal bar, fixed to viewport top, fills on scroll
- `table-of-contents.tsx` — sticky right sidebar on `lg+` only, IntersectionObserver scroll-spy, auto-hides if fewer than 2 H2s

**Why desktop-only TOC:** mobile has no horizontal room, and a collapsible `<details>` version was judged not worth the complexity at this article count.

**Related:** `mdx-headings.ts` extracts H2/H3 from MDX and slugs them to match `rehype-slug` output exactly. If the slug algorithm changes in either place, they must change together.

---

## 2026-10-15 — Real product photos instead of illustrations

**Context:** The cushions/chairs article used watercolor illustrations for the donut cushion, honeycomb gel cushion, and saddle chair. The user asked for real product images.

**Decision:** Real product photos for purchasable items, sourced via `images_search_and_download`, uploaded through `get_upload_url` + PUT, served from the same CDN.

**Known risk flagged to the user:** these are manufacturer and retailer product photos. Editorial use is generally fine; commercially aggressive use may not be. If a takedown arrives, switch to brand press-kit imagery or self-photography.

---

## 2026-10-15 — Duplicate cover image fix

**Context:** Nine articles rendered their cover image twice — once from frontmatter `coverImage` (the hero, via `ArticleHeader`) and once as the first inline markdown image in the body.

**Fix:** Removed the redundant inline image from all nine MDX files. Kept frontmatter as the single source of truth. Added a validator check so it can't recur.

**Do not "fix" this by re-adding inline images.** The frontmatter field is the only place the cover belongs.

---

## 2026-10-10 — `coverImage` frontmatter field

**Context:** New articles were written with `cover:` while `ArticleHeader` reads `article.coverImage`. Covers silently didn't render.

**Fix:** Corrected the articles to use `coverImage:`, and added `coverImage: data.coverImage ?? data.cover` in `articles.ts` so both spellings work.

**Rule going forward:** use `coverImage:`.

---

## Earlier — Categories

All articles are registered in `src/lib/article-categories.ts` across six categories: symptoms (3), conditions (6), treatment (6), causes-risk (6), lifestyle (3), slow-living (3).

An article with no category entry is an orphan — it appears on the homepage and `/articles` but in no category listing. The SEO validator treats this as an error.

---

## Known open items

Not decisions, just things someone should pick up:

1. **GitHub PAT rotation.** The token in `/root/.git-askpass.sh` is a long-lived classic token with repo scope. Rotate before meaningful traffic.
2. **Analytics not installed.** No Plausible or Fathom. "Most read" and content-decision data are unavailable, so article priorities are guesswork.
3. **Internal linking is thin.** 27 articles with very few cross-references between them. Related-articles scoring exists on article pages, but there's no in-body contextual linking.
4. **`lastmod` uses file mtime.** Editing an article updates its sitemap `lastmod` automatically. This is intended, but it means a whitespace-only edit signals to Google that content changed.
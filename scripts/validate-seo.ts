/**
 * Build-time SEO validation for articles.
 *
 * Catches the classes of bugs that silently produce empty meta descriptions,
 * missing images, thin excerpts, and unregistered categories.
 *
 * Run: npx tsx scripts/validate-seo.ts
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content', 'en');
const CATEGORIES_TS = path.join(ROOT, 'src', 'lib', 'article-categories.ts');

const OPTIMAL_DESC_MIN = 70;
const OPTIMAL_DESC_MAX = 160;

type Issue = { level: 'ERROR' | 'WARN'; slug: string; message: string };

const issues: Issue[] = [];

// Parse category map from article-categories.ts
const tsSource = fs.readFileSync(CATEGORIES_TS, 'utf8');
const categoryMap = new Map<string, string>();
for (const m of tsSource.matchAll(/'([a-z0-9-]+)':\s*'([a-z-]+)'/g)) {
  categoryMap.set(m[1], m[2]);
}

const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
const seenSlugs = new Set<string>();
const slugsInCategories: string[] = [];

for (const file of files) {
  const slug = file.replace(/\.mdx$/, '');
  seenSlugs.add(slug);

  const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
  const { data, content } = matter(raw);

  // 1. Title
  const title = (data.title ?? '').trim();
  if (!title) {
    issues.push({ level: 'ERROR', slug, message: 'Missing title' });
  } else if (title.length > 70) {
    issues.push({
      level: 'WARN',
      slug,
      message: `Title is ${title.length} chars (gets truncated in SERPs around 60)`,
    });
  }

  // 2. Excerpt / meta description
  const excerpt = (data.excerpt ?? data.description ?? '').trim();
  if (!excerpt) {
    issues.push({
      level: 'ERROR',
      slug,
      message: 'Missing excerpt — meta description will be empty',
    });
  } else if (excerpt.length < OPTIMAL_DESC_MIN) {
    issues.push({
      level: 'WARN',
      slug,
      message: `Excerpt is ${excerpt.length} chars (aim for ${OPTIMAL_DESC_MIN}-${OPTIMAL_DESC_MAX})`,
    });
  } else if (excerpt.length > OPTIMAL_DESC_MAX) {
    issues.push({
      level: 'WARN',
      slug,
      message: `Excerpt is ${excerpt.length} chars (aim for ${OPTIMAL_DESC_MIN}-${OPTIMAL_DESC_MAX})`,
    });
  }

  // 3. Cover image
  const cover = data.coverImage ?? data.cover;
  if (!cover) {
    issues.push({ level: 'ERROR', slug, message: 'Missing coverImage' });
  } else if (!/^https?:\/\//.test(cover)) {
    issues.push({ level: 'ERROR', slug, message: `coverImage is not an absolute URL: ${cover}` });
  }

  // 4. Body must not duplicate the cover inline (renders the image twice)
  if (cover && content.includes(cover)) {
    issues.push({
      level: 'ERROR',
      slug,
      message: 'Cover image is also inline in the body — renders twice',
    });
  }

  // 5. Date
  if (!data.date) {
    issues.push({ level: 'ERROR', slug, message: 'Missing date' });
  } else if (Number.isNaN(new Date(data.date).getTime())) {
    issues.push({ level: 'ERROR', slug, message: `Unparseable date: ${data.date}` });
  }

  // 6. Tags
  const tags = data.tags ?? [];
  if (!Array.isArray(tags) || tags.length === 0) {
    issues.push({ level: 'WARN', slug, message: 'No tags — article gets no keyword signal' });
  } else if (tags.length < 3) {
    issues.push({ level: 'WARN', slug, message: `Only ${tags.length} tags (aim for 4+)` });
  }

  // 7. Category registration
  if (!categoryMap.has(slug)) {
    slugsInCategories.push(slug);
  } else if (data.category && data.category !== categoryMap.get(slug)) {
    issues.push({
      level: 'WARN',
      slug,
      message: `category frontmatter "${data.category}" ≠ article-categories.ts "${categoryMap.get(slug)}"`,
    });
  }

  // 8. Body must have at least one H2 (otherwise no TOC, poor scannability)
  const h2Count = (content.match(/^##\s+/gm) ?? []).length;
  if (h2Count === 0) {
    issues.push({ level: 'WARN', slug, message: 'No H2 headings — article has no TOC' });
  }

  // 9. Broken markdown image links (non-http sources)
  for (const m of content.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)) {
    if (!/^https?:\/\//.test(m[1])) {
      issues.push({ level: 'ERROR', slug, message: `Non-absolute image URL: ${m[1]}` });
    }
  }
}

// 10. Orphans: registered in article-categories.ts but no article file
for (const slug of categoryMap.keys()) {
  if (!seenSlugs.has(slug)) {
    issues.push({
      level: 'ERROR',
      slug,
      message: 'Registered in article-categories.ts but no MDX file exists (orphan)',
    });
  }
}

// 11. Required documentation must exist (see DECISIONS.md 2026-10-22)
const REQUIRED_DOCS = ['AGENTS.md', 'WRITING_STYLE.md', 'DECISIONS.md'];
for (const doc of REQUIRED_DOCS) {
  if (!fs.existsSync(path.join(ROOT, doc))) {
    issues.push({
      level: 'ERROR',
      slug: '(project)',
      message: `Required documentation missing: ${doc} — see DECISIONS.md`,
    });
  }
}

// Report
const errors = issues.filter((i) => i.level === 'ERROR');
const warns = issues.filter((i) => i.level === 'WARN');

console.log(`\nSEO validation: ${files.length} articles checked`);
console.log(`  ${errors.length} errors, ${warns.length} warnings\n`);

for (const i of [...errors, ...warns]) {
  const tag = i.level === 'ERROR' ? 'ERROR' : ' WARN';
  console.log(`[${tag}] ${i.slug}: ${i.message}`);
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} error(s) must be fixed.\n`);
  process.exit(1);
}

console.log(`\n✓ No errors. ${warns.length} warning(s).\n`);

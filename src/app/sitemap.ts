import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getCategoryForArticle } from '@/lib/article-categories';
import { SITE_URL, SUPPORTED_LOCALES, localePath } from '@/lib/seo';

/**
 * Stable last-modified dates for non-article pages.
 *
 * Using the build timestamp here would tell Google that every static and
 * category page changed on every deploy, which teaches it to ignore the
 * `lastmod` signal entirely. These are the real dates the pages were last
 * meaningfully edited.
 */
const STATIC_LASTMOD: Record<string, string> = {
  '/': '2026-10-21',
  '/articles': '2026-11-02',
  '/about': '2026-10-21',
  '/privacy': '2026-10-21',
  '/cookies': '2026-10-21',
  '/disclosure': '2026-10-21',
};

/** Category pages inherit the most recent modification date of their articles. */
function categoryLastMod(slug: string, locale: string): string {
  const dates = getAllArticles(locale)
    .filter((a) => getCategoryForArticle(a.slug) === slug)
    .map((a) => a.updated)
    .sort();
  if (dates.length === 0) return '2026-10-21';
  return dates[dates.length - 1];
}

const STATIC_PATHS = [
  '/',
  '/articles',
  '/about',
  '/privacy',
  '/cookies',
  '/disclosure',
];

const CATEGORY_SLUGS = [
  'symptoms',
  'conditions',
  'treatment',
  'causes-risk',
  'lifestyle',
  'slow-living',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const items: MetadataRoute.Sitemap = [];

  // Static pages, in every locale.
  for (const locale of SUPPORTED_LOCALES) {
    for (const p of STATIC_PATHS) {
      items.push({
        url: `${SITE_URL}${localePath(locale, p)}`,
        lastModified: new Date(STATIC_LASTMOD[p] ?? '2026-10-21'),
        changeFrequency: p === '/' ? 'weekly' : 'monthly',
        priority: p === '/' ? 1.0 : p === '/articles' ? 0.9 : 0.5,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [l, `${SITE_URL}${localePath(l, p)}`])
          ),
        },
      });
    }

    // Category pages.
    for (const slug of CATEGORY_SLUGS) {
      items.push({
        url: `${SITE_URL}${localePath(locale, `/category/${slug}`)}`,
        lastModified: new Date(categoryLastMod(slug, locale)),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [
              l,
              `${SITE_URL}${localePath(l, `/category/${slug}`)}`,
            ])
          ),
        },
      });
    }
  }

  // Articles — one entry per locale where the article exists.
  const seen = new Set<string>();
  for (const locale of SUPPORTED_LOCALES) {
    const articles = getAllArticles(locale);
    for (const article of articles) {
      const key = `${locale}/${article.slug}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        url: `${SITE_URL}${localePath(locale, `/articles/${article.slug}`)}`,
        lastModified: new Date(article.updated ?? article.date),
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [
              l,
              `${SITE_URL}${localePath(l, `/articles/${article.slug}`)}`,
            ])
          ),
        },
      });
    }
  }

  return items;
}

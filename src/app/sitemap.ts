import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { SITE_URL, SUPPORTED_LOCALES, localePath } from '@/lib/seo';

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
  const now = new Date();
  const items: MetadataRoute.Sitemap = [];

  // Static pages, in every locale.
  for (const locale of SUPPORTED_LOCALES) {
    for (const path of STATIC_PATHS) {
      items.push({
        url: `${SITE_URL}${localePath(locale, path)}`,
        lastModified: now,
        changeFrequency: path === '/' ? 'weekly' : 'monthly',
        priority: path === '/' ? 1.0 : path === '/articles' ? 0.9 : 0.5,
        alternates: {
          languages: Object.fromEntries(
            SUPPORTED_LOCALES.map((l) => [l, `${SITE_URL}${localePath(l, path)}`])
          ),
        },
      });
    }

    // Category pages.
    for (const slug of CATEGORY_SLUGS) {
      items.push({
        url: `${SITE_URL}${localePath(locale, `/category/${slug}`)}`,
        lastModified: now,
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
        lastModified: new Date(article.date),
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
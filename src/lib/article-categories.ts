/**
 * Maps each article slug to its category.
 *
 * To categorize a new article, add an entry to `articleCategoryMap` below.
 * If an article is not in the map, it will appear only on the homepage and
 * the global /articles page (not in any category listing).
 */

export type ArticleCategory = 'prostate-conditions' | 'treatment-recovery' | 'slow-living';

export const articleCategoryMap: Record<string, ArticleCategory> = {
  // Prostate Conditions (what it is, what it feels like)
  'understanding-prostatitis': 'prostate-conditions',
  'prostatitis-types-explained': 'prostate-conditions',
  'bph-explained': 'prostate-conditions',
  'prostate-cancer-guide': 'prostate-conditions',
  'prostate-stones-explained': 'prostate-conditions',
  'prostate-cysts-explained': 'prostate-conditions',

  // Treatment & Recovery (what to do)
  'chronic-prostatitis-recovery': 'treatment-recovery',
  'prostate-milking': 'treatment-recovery',

  // Slow Living (essays)
  'on-slow-looking': 'slow-living',
  'the-grammar-of-rain': 'slow-living',
  'why-i-still-print-photos': 'slow-living',
};

export function getCategoryForArticle(slug: string): ArticleCategory | null {
  return articleCategoryMap[slug] ?? null;
}
/**
 * Maps each article slug to its category.
 *
 * To categorize a new article, add an entry to `articleCategoryMap` below.
 * If an article is not in the map, it will appear only on the homepage and
 * the global /articles page (not in any category listing).
 */

export type ArticleCategory =
  | 'symptoms'
  | 'conditions'
  | 'treatment'
  | 'causes-risk'
  | 'lifestyle'
  | 'slow-living';

export const articleCategoryMap: Record<string, ArticleCategory> = {
  // Symptoms
  'prostate-symptoms-explained': 'symptoms',

  // Causes & Risk
  'prostate-cancer-risk-factors': 'causes-risk',
  'prostatitis-risk-factors': 'causes-risk',

  // Conditions (what it is)
  'prostatitis-types-explained': 'conditions',
  'bph-explained': 'conditions',
  'prostate-cancer-guide': 'conditions',
  'prostate-stones-explained': 'conditions',
  'prostate-cysts-explained': 'conditions',

  // Treatment (what to do)
  'chronic-prostatitis-recovery': 'treatment',
  'prostate-milking': 'treatment',

  // Lifestyle (daily habits, prevention)
  'understanding-prostatitis': 'lifestyle',

  // Slow Living (essays)
  'on-slow-looking': 'slow-living',
  'the-grammar-of-rain': 'slow-living',
  'why-i-still-print-photos': 'slow-living',
};

export function getCategoryForArticle(slug: string): ArticleCategory | null {
  return articleCategoryMap[slug] ?? null;
}
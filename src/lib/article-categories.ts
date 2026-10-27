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
  'when-to-see-urologist': 'symptoms',
  'prostatitis-whole-body-effects': 'symptoms',

  // Causes & Risk
  'prostate-cancer-risk-factors': 'causes-risk',
  'prostatitis-risk-factors': 'causes-risk',
  'frequent-erections-cpps': 'causes-risk',
  'modern-life-bph-worsening': 'causes-risk',
  'stress-anxiety-prostate-symptoms': 'causes-risk',
  'diet-prostate-health-evidence': 'causes-risk',

  // Conditions (what it is)
  'prostatitis-types-explained': 'conditions',
  'bph-explained': 'conditions',
  'prostate-cancer-guide': 'conditions',
  'prostate-stones-explained': 'conditions',
  'prostate-cysts-explained': 'conditions',
  'interstitial-cystitis-vs-cpps': 'conditions',

  // Treatment (what to do)
  'chronic-prostatitis-recovery': 'treatment',
  'prostate-milking': 'treatment',
  'prostate-massage-evidence': 'treatment',
  'prostate-massage-safety': 'treatment',
  'cushions-chairs-prostate-pain': 'treatment',
  'kegels-for-men': 'treatment',
  'finasteride-dutasteride-bph': 'treatment',
  'prostate-health-by-decade': 'conditions',
  'prostatitis-erectile-dysfunction': 'conditions',
  'erectile-dysfunction-prostate-connection': 'conditions',

  // Lifestyle (daily habits, prevention)
  'understanding-prostatitis': 'lifestyle',
  'daily-habits-prostate-health': 'lifestyle',
  'prolonged-erection-no-ejaculation': 'lifestyle',

  // Slow Living (essays)
  'on-slow-looking': 'slow-living',
  'the-grammar-of-rain': 'slow-living',
  'why-i-still-print-photos': 'slow-living',
};

export function getCategoryForArticle(slug: string): ArticleCategory | null {
  return articleCategoryMap[slug] ?? null;
}
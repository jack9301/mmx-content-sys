import type { Article } from '@/lib/articles';
import { articleCategoryMap, getCategoryForArticle } from '@/lib/article-categories';

export type RelatedArticle = Pick<
  Article,
  'slug' | 'locale' | 'title' | 'excerpt' | 'date' | 'tags' | 'coverImage' | 'readingTime'
>;

/**
 * Get up to `count` related articles for a given article slug + locale.
 *
 * Priority:
 *   1. Same category, sharing at least one tag (strongest signal)
 *   2. Same category, any tags
 *   3. Different category but sharing tags
 *   4. Fallback: same category, no tag overlap (recent first)
 *
 * Excludes the current article.
 */
export function getRelatedArticles(
  currentSlug: string,
  locale: string,
  count: number = 3,
  allArticles: Article[] = []
): RelatedArticle[] {
  if (allArticles.length === 0) return [];

  const currentCategory = getCategoryForArticle(currentSlug);
  const currentArticle = allArticles.find((a) => a.slug === currentSlug);
  const currentTags = new Set(currentArticle?.tags ?? []);

  const others = allArticles.filter((a) => a.slug !== currentSlug);

  const scored = others.map((a) => {
    const sameCategory = getCategoryForArticle(a.slug) === currentCategory;
    const sharedTagCount = (a.tags ?? []).filter((t) => currentTags.has(t)).length;
    let score = 0;
    if (sameCategory) score += 10;
    score += sharedTagCount * 3;
    return { article: a, score, sameCategory, sharedTagCount };
  });

  // Strong match: same category AND shared tag
  const strongMatches = scored
    .filter((s) => s.sameCategory && s.sharedTagCount > 0)
    .sort((a, b) => b.score - a.score || +new Date(b.article.date) - +new Date(a.article.date));

  if (strongMatches.length >= count) {
    return strongMatches.slice(0, count).map((s) => toRelated(s.article));
  }

  // Same category, any
  const sameCategoryAll = scored
    .filter((s) => s.sameCategory)
    .sort((a, b) => b.score - a.score || +new Date(b.article.date) - +new Date(a.article.date));

  const result: RelatedArticle[] = strongMatches.map((s) => toRelated(s.article));
  for (const s of sameCategoryAll) {
    if (result.length >= count) break;
    if (!result.find((r) => r.slug === s.article.slug)) {
      result.push(toRelated(s.article));
    }
  }

  // Tag-only match across all categories
  if (result.length < count) {
    const tagOnlyMatches = scored
      .filter((s) => !s.sameCategory && s.sharedTagCount > 0)
      .sort((a, b) => b.sharedTagCount - a.sharedTagCount || +new Date(b.article.date) - +new Date(a.article.date));
    for (const s of tagOnlyMatches) {
      if (result.length >= count) break;
      if (!result.find((r) => r.slug === s.article.slug)) {
        result.push(toRelated(s.article));
      }
    }
  }

  return result.slice(0, count);
}

function toRelated(a: Article): RelatedArticle {
  return {
    slug: a.slug,
    locale: a.locale,
    title: a.title,
    excerpt: a.excerpt,
    date: a.date,
    tags: a.tags,
    coverImage: a.coverImage,
    readingTime: a.readingTime,
  };
}
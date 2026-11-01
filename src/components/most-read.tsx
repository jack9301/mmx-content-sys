'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

type Candidate = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: number;
  coverImage?: string;
};

type RankedArticle = Candidate & { views: number };

/**
 * Renders the most-read articles, ranked by view count.
 *
 * Counts come from /api/views, which is KV-backed and updated on article
 * views. The ranking is computed client-side because the counts change
 * between builds and the site is statically exported.
 *
 * If no article has any recorded views yet, the section hides itself rather
 * than showing an empty or all-zero list.
 */
export function MostRead({
  articles,
  locale,
  limit = 5,
}: {
  articles: Candidate[];
  locale: string;
  limit?: number;
}) {
  const t = useTranslations('home');
  const tArticle = useTranslations('article');
  const [ranked, setRanked] = useState<RankedArticle[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (articles.length === 0) {
      setRanked([]);
      return;
    }

    async function load() {
      try {
        const params = new URLSearchParams();
        for (const a of articles) {
          params.append('slugs', `${locale}/${a.slug}`);
        }
        const res = await fetch(`/api/views?slugs=${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data.views) return;

        const scored = articles
          .map((a) => ({ ...a, views: Number(data.views[`${locale}/${a.slug}`]) || 0 }))
          .filter((a) => a.views > 0)
          .sort((a, b) => b.views - a.views)
          .slice(0, limit);

        if (!cancelled) setRanked(scored);
      } catch {
        // Leave the section hidden on failure.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [articles, locale, limit]);

  // Still loading, or nothing has been read yet — render nothing.
  if (ranked === null || ranked.length === 0) return null;

  return (
    <section className="mt-20 border-t border-neutral-200 pt-12">
      <h2 className="mb-8 font-serif text-2xl text-neutral-800">
        {t('mostRead')}
      </h2>
      <ol className="space-y-6">
        {ranked.map((article, index) => (
          <li key={article.slug}>
            <Link
              href={`/articles/${article.slug}` as any}
              className="group flex gap-5"
            >
              <span
                className="font-serif text-3xl leading-none text-neutral-300 transition group-hover:text-accent"
                aria-hidden="true"
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <h3 className="font-serif text-lg leading-snug text-neutral-900 group-hover:text-accent">
                  {article.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                  {article.excerpt}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  {article.readingTime} {t('minRead')} ·{' '}
                  {article.views.toLocaleString()} {tArticle('views')}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

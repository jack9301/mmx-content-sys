'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Search as SearchIcon, X } from 'lucide-react';
import { formatDate } from '@/lib/format-date';

type SearchableArticle = {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  coverImage?: string;
};

type ScoredResult = SearchableArticle & {
  score: number;
  matchedFields: string[];
};

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[\s,/.\-_!?#()'"]+/).filter(Boolean);
}

function scoreArticle(query: string, article: SearchableArticle): ScoredResult | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const tokens = tokenize(q);
  if (tokens.length === 0) return null;

  let score = 0;
  const matched: string[] = [];

  const titleLower = article.title.toLowerCase();
  const excerptLower = article.excerpt.toLowerCase();
  const tagsLower = article.tags.map((t) => t.toLowerCase()).join(' ');

  for (const tok of tokens) {
    let matchedThisToken = false;
    if (titleLower.includes(tok)) {
      score += 12;
      matchedThisToken = true;
    }
    if (tok.length >= 3 && titleLower.split(/\s+/).some((w) => w.startsWith(tok))) {
      score += 6;
      matchedThisToken = true;
    }
    if (excerptLower.includes(tok)) {
      score += 5;
      matchedThisToken = true;
    }
    if (tagsLower.includes(tok)) {
      score += 4;
      matchedThisToken = true;
    }
    if (tok.length >= 4 && article.slug.toLowerCase().includes(tok)) {
      score += 2;
      matchedThisToken = true;
    }
    if (matchedThisToken) matched.push(tok);
  }

  if (score === 0) return null;
  return { ...article, score, matchedFields: matched };
}

export function SearchClient({ articles }: { articles: SearchableArticle[] }) {
  const t = useTranslations('search');
  const tHome = useTranslations('home');
  const locale = useLocale();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const scored = articles
      .map((a) => scoreArticle(query, a))
      .filter((r): r is ScoredResult => r !== null)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, 30);
  }, [query, articles]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-10">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-neutral-900">
          {t('placeholder')}
        </h1>
      </header>

      <div className="relative mb-8">
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('placeholder')}
          autoFocus
          aria-label={t('placeholder')}
          className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-12 pr-12 text-base text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-[#0f766e]/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            aria-label="Clear"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 transition hover:bg-neutral-100:bg-neutral-800 hover:text-neutral-700:text-neutral-300"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {query.trim() && (
        <p className="mb-6 text-sm text-neutral-500">
          {t('resultsCount', { count: results.length, query })}
        </p>
      )}

      {!query.trim() ? (
        <p className="text-sm text-neutral-400">
          {tHome('latest')}
        </p>
      ) : results.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200 px-6 py-12 text-center">
          <p className="text-neutral-600">{t('noResults', { query })}</p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {results.map((article) => (
            <li key={article.slug} className="group py-5">
              <Link
                href={`/articles/${article.slug}` as any}
                className="block transition"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-lg text-neutral-900 group-hover:text-[#0f766e]:text-[#2dd4bf]">
                    {article.title}
                  </h3>
                  <time className="flex-none text-xs text-neutral-400">
                    {formatDate(article.date, locale)}
                  </time>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                  {article.excerpt}
                </p>
                {article.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Displays view counts for a list of articles.
 *
 * Fetches all counts in one request and renders them per slug. Articles whose
 * count is missing render nothing, so a fresh install doesn't show a wall of
 * zeroes.
 */
export function ViewCounts({
  slugs,
  locale,
}: {
  slugs: string[];
  locale: string;
}) {
  const t = useTranslations('article');
  const [views, setViews] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    if (slugs.length === 0) return;

    async function load() {
      try {
        const params = new URLSearchParams();
        for (const slug of slugs) {
          params.append('slugs', `${locale}/${slug}`);
        }
        const res = await fetch(`/api/views?slugs=${params.toString()}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data.views && typeof data.views === 'object') {
          setViews(data.views);
        }
      } catch {
        // Leave counts hidden on failure.
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slugs, locale]);

  if (slugs.length === 0) return null;

  return (
    <>
      {slugs.map((slug) => {
        const key = `${locale}/${slug}`;
        const count = views[key];
        if (typeof count !== 'number' || count <= 0) return null;
        return (
          <span key={slug} data-testid={`view-count-${slug}`} data-views={count}>
            {count.toLocaleString()} {t('views')}
          </span>
        );
      })}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

/**
 * Displays the view count for an article and registers one view.
 *
 * The count is fetched from /api/views and incremented once per browser
 * session per article (the API also dedupes per IP for 30 minutes).
 */
export function ViewCount({ slug, locale }: { slug: string; locale: string }) {
  const t = useTranslations('article');
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function register() {
      try {
        const res = await fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, locale }),
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && typeof data.views === 'number') {
          setViews(data.views);
        }
      } catch {
        // Network failure — leave the count hidden rather than showing a wrong number.
      }
    }

    register();
    return () => {
      cancelled = true;
    };
  }, [slug, locale]);

  if (views === null) return null;

  return (
    <span data-testid="view-count" data-views={views}>
      {views.toLocaleString()} {t('views')}
    </span>
  );
}

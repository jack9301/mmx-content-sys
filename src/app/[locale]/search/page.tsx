import { getAllArticles } from '@/lib/articles';
import { SearchClient } from '@/components/search-client';
import { setRequestLocale } from 'next-intl/server';

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  // Load every article (all locales) so search works across languages.
  // For 10 articles this is trivial; we can paginate later if needed.
  const allLocales = ['en', 'zh', 'ja'] as const;
  const articles = allLocales.flatMap((loc) =>
    getAllArticles(loc).map((a) => ({
      slug: a.slug,
      locale: a.locale,
      title: a.title,
      excerpt: a.excerpt,
      date: a.date,
      tags: a.tags,
      coverImage: a.coverImage,
    })),
  );
  return <SearchClient articles={articles} />;
}
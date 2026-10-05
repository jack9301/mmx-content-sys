import type { Metadata } from 'next';
import { getAllArticles } from '@/lib/articles';
import { SearchClient } from '@/components/search-client';
import { setRequestLocale } from 'next-intl/server';
import {
  SITE_NAME,
  KEYWORDS_BASE,
  alternatesFor,
  localePath,
  type SupportedLocale,
  LOCALE_OG,
} from '@/lib/seo';

const SUPPORTED = ['en', 'zh', 'ja'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const path = localePath(safeLocale, '/search');
  return {
    title: 'Search',
    description: `Search across all ${SITE_NAME} articles on prostate conditions, symptoms, treatment, and recovery.`,
    keywords: [...KEYWORDS_BASE, 'search'],
    alternates: {
      canonical: path,
      languages: alternatesFor('/search', safeLocale),
    },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[safeLocale],
      url: path,
      siteName: SITE_NAME,
      title: `Search · ${SITE_NAME}`,
      description: `Search articles on ${SITE_NAME}.`,
    },
    robots: { index: false, follow: true }, // search pages shouldn't be indexed
  };
}

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
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllArticles } from '@/lib/articles';
import { getAllNotes, noteExcerpt } from '@/lib/notes';
import { MostRead } from '@/components/most-read';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  KEYWORDS_BASE,
  alternatesFor,
  localePath,
  type SupportedLocale,
  LOCALE_OG,
} from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { organizationJsonLd, websiteJsonLd } from '@/lib/json-ld';

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
  const path = localePath(safeLocale, '/');
  return {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    keywords: [...KEYWORDS_BASE],
    alternates: {
      canonical: path,
      languages: alternatesFor('/', safeLocale),
    },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[safeLocale],
      url: path,
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_TAGLINE,
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_TAGLINE,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tSite = await getTranslations('site');
  const tNotes = await getTranslations('notes');
  const allArticles = getAllArticles(locale);
  const allNotes = getAllNotes();

  /**
   * One unified feed: articles and notes interleaved, newest first.
   *
   * A note published today outranks an article published yesterday, so the
   * homepage always leads with whatever was written most recently — whether
   * that was a full article or a short note.
   */
  type FeedItem =
    | { kind: 'article'; date: string; article: (typeof allArticles)[number] }
    | { kind: 'note'; date: string; note: (typeof allNotes)[number] };

  const feed: FeedItem[] = [
    ...allArticles.map(
      (article): FeedItem => ({ kind: 'article', date: article.date, article })
    ),
    ...allNotes.map((note): FeedItem => ({ kind: 'note', date: note.date, note })),
  ]
    .sort((a, b) => +new Date(b.date) - +new Date(a.date))
    .slice(0, 8);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <header className="mb-16 max-w-2xl">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-900">
          {tSite('title')}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">{tSite('tagline')}</p>
      </header>

      <section>
        <h2 className="mb-8 font-serif text-2xl text-neutral-800">
          {t('latest')}
        </h2>

        {feed.length === 0 ? (
          <p className="text-neutral-500">{t('noArticles')}</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {feed.map((item) =>
              item.kind === 'article' ? (
                <article key={`a-${item.article.slug}`} className="group">
                  <Link
                    href={`/articles/${item.article.slug}` as any}
                    className="block"
                  >
                    {item.article.coverImage && (
                      <div className="aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                        <img
                          src={item.article.coverImage}
                          alt={item.article.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="mt-4">
                      <time className="text-sm text-neutral-500">
                        {new Date(item.article.date).toLocaleDateString(locale, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                      <h3 className="mt-2 font-serif text-xl text-neutral-900 group-hover:text-accent">
                        {item.article.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                        {item.article.excerpt}
                      </p>
                      <p className="mt-2 text-xs text-neutral-400">
                        {item.article.readingTime} {t('minRead')}
                      </p>
                    </div>
                  </Link>
                </article>
              ) : (
                <article key={`n-${item.note.slug}`} className="group">
                  <Link
                    href={`/notes/${item.note.slug}` as any}
                    className="block"
                  >
                    <div className="flex h-full flex-col rounded-lg border border-dashed border-neutral-300 bg-neutral-50/50 p-5 transition-colors group-hover:border-[#0f766e]/50">
                      <div className="flex items-center gap-3">
                        <time className="text-sm text-neutral-500">
                          {new Date(item.note.date).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                        <span className="rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-xs font-medium text-[#0f766e]">
                          {tNotes('indexTitle')}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-xl text-neutral-900 transition-colors group-hover:text-accent">
                        {item.note.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
                        {noteExcerpt(item.note, 220)}
                      </p>
                      {item.note.tags.length > 0 && (
                        <p className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-400">
                          {item.note.tags.map((tag) => (
                            <span key={tag}>#{tag}</span>
                          ))}
                        </p>
                      )}
                    </div>
                  </Link>
                </article>
              )
            )}
          </div>
        )}

        {allNotes.length > 0 && (
          <p className="mt-8">
            <Link
              href={'/notes' as any}
              className="text-sm text-[#0f766e] transition-colors hover:text-neutral-900"
            >
              {tNotes('backToNotes')} &rarr;
            </Link>
          </p>
        )}
      </section>

      <MostRead
        articles={allArticles.map((a) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          date: a.date,
          readingTime: a.readingTime,
          coverImage: a.coverImage,
        }))}
        locale={locale}
        limit={5}
      />
    </div>
  );
}
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllArticles } from '@/lib/articles';
import { getAllNotes } from '@/lib/notes';
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
  const articles = allArticles.slice(0, 6);
  const notes = getAllNotes().slice(0, 3);

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

        {articles.length === 0 ? (
          <p className="text-neutral-500">{t('noArticles')}</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {articles.map((article) => (
              <article key={article.slug} className="group">
                <Link href={`/articles/${article.slug}` as any} className="block">
                  {article.coverImage && (
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <time className="text-sm text-neutral-500">
                      {new Date(article.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h3 className="mt-2 font-serif text-xl text-neutral-900 group-hover:text-accent">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="mt-2 text-xs text-neutral-400">
                      {article.readingTime} {t('minRead')}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {notes.length > 0 && (
        <section className="mt-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl text-neutral-800">
              {tNotes('indexTitle')}
            </h2>
            <Link
              href={'/notes' as any}
              className="text-sm text-[#0f766e] transition-colors hover:text-neutral-900"
            >
              {tNotes('backToNotes')} &rarr;
            </Link>
          </div>

          <div className="divide-y divide-neutral-200 border-t border-neutral-200">
            {notes.map((note) => (
              <article key={note.slug} className="group py-5">
                <Link href={`/notes/${note.slug}` as any} className="block">
                  <time className="text-sm text-neutral-500">
                    {new Date(note.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h3 className="mt-1 font-serif text-lg text-neutral-900 transition-colors group-hover:text-accent">
                    {note.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

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
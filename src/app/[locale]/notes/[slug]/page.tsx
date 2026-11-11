import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getAllNoteSlugs, getNoteBySlug, getAllNotes } from '@/lib/notes';
import { JsonLd } from '@/components/json-ld';
import { SITE_URL, SITE_NAME, localePath, type SupportedLocale } from '@/lib/seo';
import { Link } from '@/i18n/routing';

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug, locale: 'en' }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};

  const path = localePath(locale as SupportedLocale, `/notes/${slug}`);
  const url = `${SITE_URL}${path}`;

  return {
    title: note.title,
    description: note.content
      .replace(/^#+\s+.*$/gm, '')
      .replace(/[*_`>#\[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: note.title,
      description: note.content
        .replace(/^#+\s+.*$/gm, '')
        .replace(/[*_`>#\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 155),
      publishedTime: note.date,
      authors: [SITE_NAME],
      tags: note.tags,
    },
    twitter: {
      card: 'summary',
      title: note.title,
      description: note.content
        .replace(/^#+\s+.*$/gm, '')
        .replace(/[*_`>#\[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 155),
    },
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const t = await getTranslations({ locale, namespace: 'notes' });

  // Previous / next by publication date (newest first ordering).
  const all = getAllNotes();
  const idx = all.findIndex((n) => n.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: note.title,
          url: `${SITE_URL}${localePath(locale as SupportedLocale, `/notes/${slug}`)}`,
          datePublished: note.date,
          dateModified: note.date,
          author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
          inLanguage: locale,
          keywords: note.tags.join(', '),
        }}
      />

      <Link
        href={"/notes" as any}
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        &larr; {t('backToNotes')}
      </Link>

      <header className="mt-8">
        <time dateTime={note.date} className="text-sm text-neutral-500">
          {new Date(note.date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-neutral-900">
          {note.title}
        </h1>
        {note.tags.length > 0 && (
          <p className="mt-3 flex flex-wrap gap-2 text-sm text-neutral-400">
            {note.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </p>
        )}
      </header>

      <div className="prose prose-lg prose-neutral mt-10 max-w-none font-serif">
        <MDXRemote
          source={note.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </div>

      {(older || newer) && (
        <nav className="mt-16 grid gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-2">
          <div>
            {older && (
              <Link href={`/notes/${older.slug}` as any} className="group block">
                <span className="text-xs uppercase tracking-wider text-neutral-400">
                  {t('older')}
                </span>
                <span className="mt-1 block font-serif text-lg text-neutral-900 transition-colors group-hover:text-[#0f766e]">
                  {older.title}
                </span>
              </Link>
            )}
          </div>
          <div className="sm:text-right">
            {newer && (
              <Link href={`/notes/${newer.slug}` as any} className="group block">
                <span className="text-xs uppercase tracking-wider text-neutral-400">
                  {t('newer')}
                </span>
                <span className="mt-1 block font-serif text-lg text-neutral-900 transition-colors group-hover:text-[#0f766e]">
                  {newer.title}
                </span>
              </Link>
            )}
          </div>
        </nav>
      )}
    </article>
  );
}

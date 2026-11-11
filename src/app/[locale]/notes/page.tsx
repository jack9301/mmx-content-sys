import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllNotes } from '@/lib/notes';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd } from '@/lib/json-ld';
import { SITE_URL, SITE_NAME, localePath, type SupportedLocale } from '@/lib/seo';

export function generateStaticParams() {
  return [{ locale: 'en' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const path = localePath(locale as SupportedLocale, '/notes');
  const t = await getTranslations({ locale, namespace: 'notes' });

  return {
    title: t('indexTitle'),
    description: t('indexDescription'),
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: 'website',
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      title: t('indexTitle'),
      description: t('indexDescription'),
    },
    robots: { index: true, follow: true },
  };
}

export default async function NotesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'notes' });

  const notes = getAllNotes();

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}${localePath(locale as SupportedLocale, '/')}` },
    { name: t('indexTitle'), url: `${SITE_URL}${localePath(locale as SupportedLocale, '/notes')}` },
  ]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={breadcrumbs} />

      <header className="mb-12">
        <p className="mb-2 text-sm uppercase tracking-wider text-neutral-500">
          {t('eyebrow')}
        </p>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-900">
          {t('indexTitle')}
        </h1>
        <p className="mt-4 text-lg text-neutral-600">{t('indexDescription')}</p>
      </header>

      {notes.length === 0 ? (
        <p className="text-neutral-500">{t('empty')}</p>
      ) : (
        <div className="space-y-10">
          {notes.map((note) => (
            <article key={note.slug} className="group">
              <Link href={`/notes/${note.slug}` as any} className="block">
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  <time dateTime={note.date}>
                    {new Date(note.date).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  {note.pin && (
                    <span className="rounded-full bg-[#0f766e]/10 px-2 py-0.5 text-xs font-medium text-[#0f766e]">
                      {t('pinned')}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-serif text-2xl text-neutral-900 transition-colors group-hover:text-[#0f766e]">
                  {note.title}
                </h2>
                {note.tags.length > 0 && (
                  <p className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-400">
                    {note.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </p>
                )}
                <p className="mt-3 border-l-2 border-neutral-200 pl-4 text-neutral-600">
                  {note.content
                    .replace(/^#+\s+.*$/gm, '')
                    .replace(/[*_`>#\[\]]/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
                    .slice(0, 220)}
                  ...
                </p>
                <p className="mt-3 text-sm font-medium text-[#0f766e] opacity-0 transition-opacity group-hover:opacity-100">
                  {t('readMore')}
                </p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

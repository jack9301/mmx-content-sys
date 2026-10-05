import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllArticles } from '@/lib/articles';
import { articleCategoryMap, type ArticleCategory } from '@/lib/article-categories';
import { menu } from '@/lib/menu';
import {
  SITE_NAME,
  SITE_URL,
  KEYWORDS_BASE,
  alternatesFor,
  localePath,
  type SupportedLocale,
  LOCALE_OG,
} from '@/lib/seo';
import { JsonLd } from '@/components/json-ld';
import { breadcrumbJsonLd } from '@/lib/json-ld';

const SUPPORTED = ['en', 'zh', 'ja'] as const;

export async function generateStaticParams() {
  const slugs = new Set<string>();
  for (const section of menu.sections) {
    for (const item of section.items) {
      if (item.kind === 'category') slugs.add(item.slug);
    }
  }
  return Array.from(slugs).flatMap((slug) =>
    SUPPORTED.map((locale) => ({ slug, locale }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const safeLocale = (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const catPath = `/category/${slug}`;
  const path = localePath(safeLocale, catPath);
  return {
    title: slug,
    description: `Articles in the ${slug} category on ${SITE_NAME}.`,
    keywords: [...KEYWORDS_BASE, slug],
    alternates: {
      canonical: path,
      languages: alternatesFor(catPath, safeLocale),
    },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[safeLocale],
      url: path,
      siteName: SITE_NAME,
      title: `${slug} · ${SITE_NAME}`,
      description: `Articles in the ${slug} category.`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Validate slug is a known category
  let foundLabelKey: string | undefined;
  let foundDescriptionKey: string | undefined;
  for (const section of menu.sections) {
    for (const item of section.items) {
      if (item.kind === 'category' && item.slug === slug) {
        foundLabelKey = item.labelKey;
        foundDescriptionKey = item.descriptionKey;
      }
    }
  }
  if (!foundLabelKey) notFound();

  const tNav = await getTranslations('nav');
  const tCat = await getTranslations('category');
  const tHome = await getTranslations('home');

  // Find all articles in this category
  const slugsForCategory = Object.entries(articleCategoryMap)
    .filter(([, cat]) => cat === (slug as ArticleCategory))
    .map(([slug]) => slug);

  const articles = slugsForCategory
    .map((s) => getAllArticles(locale).find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => a !== undefined);

  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}${localePath(locale as SupportedLocale, '/')}` },
    { name: 'Articles', url: `${SITE_URL}${localePath(locale as SupportedLocale, '/articles')}` },
    { name: slug, url: `${SITE_URL}${localePath(locale as SupportedLocale, `/category/${slug}`)}` },
  ]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd data={breadcrumbs} />
      <header className="mb-12 max-w-2xl">
        <p className="mb-2 text-sm uppercase tracking-wider text-neutral-500">
          {tCat('title')}
        </p>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-900">
          {tNav(`categories.${foundLabelKey}` as any)}
        </h1>
        {foundDescriptionKey && (
          <p className="mt-4 text-lg text-neutral-600">
            {tNav(`categories.${foundDescriptionKey}` as any)}
          </p>
        )}
      </header>

      {articles.length === 0 ? (
        <p className="text-neutral-500">{tCat('noArticles')}</p>
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
                  <h3 className="mt-2 font-serif text-xl text-neutral-900 transition-colors group-hover:text-[#0f766e]">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    {article.readingTime} {tHome('minRead')}
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
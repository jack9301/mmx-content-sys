import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { ArticleHeader } from '@/components/article-header';
import { ArticleFooter } from '@/components/article-footer';
import { Comments } from '@/components/comments';
import { RelatedArticles } from '@/components/related-articles';
import { TableOfContents } from '@/components/table-of-contents';
import { ReadingProgress } from '@/components/reading-progress';
import { KeyTakeaways } from '@/components/key-takeaways';
import { JsonLd } from '@/components/json-ld';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
import { getRelatedArticles } from '@/lib/related-articles';
import { getAllArticles } from '@/lib/articles';
import { extractHeadings } from '@/lib/mdx-headings';
import {
  SITE_NAME,
  SITE_URL,
  KEYWORDS_BASE,
  alternatesFor,
  alternatesForArticle,
  localePath,
  type SupportedLocale,
  LOCALE_OG,
} from '@/lib/seo';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

const SUPPORTED = ['en', 'zh', 'ja'] as const;

export function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  // Pre-render for every locale we ship translations for.
  return slugs.flatMap((slug) =>
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
  const article = getArticleBySlug(slug, safeLocale);
  if (!article) return {};
  const articlePath = `/articles/${slug}`;
  const path = localePath(safeLocale, articlePath);
  const url = `${SITE_URL}${path}`;
  const keywords = [...KEYWORDS_BASE, ...article.tags].filter(Boolean);
  return {
    title: article.title,
    description: article.excerpt,
    keywords,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    alternates: {
      canonical: path,
      languages: alternatesForArticle(articlePath, safeLocale, (loc) => {
        return getArticleBySlug(slug, loc) !== null;
      }),
    },
    openGraph: {
      type: 'article',
      locale: LOCALE_OG[safeLocale],
      url,
      siteName: SITE_NAME,
      title: article.title,
      description: article.excerpt,
      images: article.coverImage
        ? [
            {
              url: article.coverImage,
              alt: article.title,
            },
          ]
        : undefined,
      publishedTime: article.date,
      authors: [SITE_NAME],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = getArticleBySlug(slug, locale);
  if (!article) notFound();

  const articleUrl = `${SITE_URL}${localePath(locale as SupportedLocale, `/articles/${slug}`)}`;
  const related = getRelatedArticles(slug, locale, 3, getAllArticles(locale));
  const headings = extractHeadings(article.content);
  const articleStructured = articleJsonLd({
    title: article.title,
    description: article.excerpt,
    url: articleUrl,
    image: article.coverImage,
    datePublished: article.date,
    authorName: SITE_NAME,
    inLanguage: locale,
    keywords: [...KEYWORDS_BASE, ...article.tags].filter(Boolean),
  });
  const breadcrumbs = breadcrumbJsonLd([
    { name: 'Home', url: `${SITE_URL}${localePath(locale as SupportedLocale, '/')}` },
    { name: 'Articles', url: `${SITE_URL}${localePath(locale as SupportedLocale, '/articles')}` },
    { name: article.title, url: articleUrl },
  ]);

  return (
    <>
      <ReadingProgress />
      <JsonLd data={articleStructured} />
      <JsonLd data={breadcrumbs} />

      <article className="mx-auto max-w-6xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <ArticleHeader article={article} locale={locale} />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_220px]">
          <div className="prose prose-lg prose-neutral max-w-none font-serif">
            {article.keyTakeaways && article.keyTakeaways.length > 0 && (
              <KeyTakeaways items={article.keyTakeaways} />
            )}
            <MDXRemote
              source={article.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeSlug],
                },
              }}
            />
          </div>
          {headings.length > 0 && (
            <aside className="hidden lg:block">
              <TableOfContents headings={headings} />
            </aside>
          )}
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <ArticleFooter article={article} />
        </div>
        <div className="mx-auto max-w-3xl">
          <RelatedArticles articles={related} />
        </div>
        <div className="mx-auto max-w-3xl">
          <Comments slug={slug} locale={locale} />
        </div>
      </article>
    </>
  );
}
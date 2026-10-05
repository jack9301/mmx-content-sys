import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/articles';
import { ArticleHeader } from '@/components/article-header';
import { ArticleFooter } from '@/components/article-footer';
import { Comments } from '@/components/comments';
import { JsonLd } from '@/components/json-ld';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/json-ld';
import {
  SITE_NAME,
  SITE_URL,
  KEYWORDS_BASE,
  alternatesFor,
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
      languages: alternatesFor(articlePath, safeLocale),
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
    <article className="mx-auto max-w-3xl px-6 py-16">
      <JsonLd data={articleStructured} />
      <JsonLd data={breadcrumbs} />
      <ArticleHeader article={article} locale={locale} />

      <div className="prose prose-lg prose-neutral mx-auto mt-12 font-serif">
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

      <ArticleFooter article={article} />
      <Comments slug={slug} locale={locale} />
    </article>
  );
}
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { RelatedArticle } from '@/lib/related-articles';

export function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  const t = useTranslations('article');
  if (!articles.length) return null;

  return (
    <section className="mx-auto mt-16 max-w-2xl border-t border-neutral-200 pt-10">
      <h2 className="font-serif text-2xl font-semibold tracking-tight text-neutral-900">
        {t('relatedTitle')}
      </h2>
      <p className="mt-2 text-sm text-neutral-600">{t('relatedSubtitle')}</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/articles/${a.slug}` as any}
            className="group block"
          >
            <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white transition-colors group-hover:border-neutral-300">
              {a.coverImage ? (
                <div className="aspect-video bg-neutral-100">
                  <img
                    src={a.coverImage}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-[#f0f9f8] to-[#e0f5f3]" />
              )}
              <div className="p-4">
                <h3 className="font-serif text-base font-semibold leading-snug text-neutral-900 group-hover:text-[#0f766e]">
                  {a.title}
                </h3>
                {a.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{a.excerpt}</p>
                ) : null}
                <p className="mt-3 text-xs text-neutral-500">
                  {Math.max(1, a.readingTime)} {t('minRead')}
                </p>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}
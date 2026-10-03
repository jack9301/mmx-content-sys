import { useTranslations } from 'next-intl';
import type { Article } from '@/lib/articles';
import { Link } from '@/i18n/routing';

export function ArticleHeader({
  article,
  locale,
}: {
  article: Article;
  locale: string;
}) {
  const t = useTranslations('article');

  return (
    <header className="mx-auto max-w-2xl">
      <Link
        href="/"
        className="text-sm text-neutral-500 hover:text-neutral-900:text-neutral-100"
      >
        {t('backToAll')}
      </Link>
      <h1 className="mt-6 font-serif text-4xl font-medium leading-tight tracking-tight text-neutral-900 sm:text-5xl">
        {article.title}
      </h1>
      <p className="mt-4 text-lg text-neutral-600">{article.excerpt}</p>
      <div className="mt-6 flex items-center gap-3 text-sm text-neutral-500">
        <time dateTime={article.date}>
          {t('publishedOn')}{' '}
          {new Date(article.date).toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span>·</span>
        <span>
          {article.readingTime} {t('minRead')}
        </span>
      </div>
      {article.coverImage && (
        <div className="mt-10 overflow-hidden rounded-lg">
          <img
            src={article.coverImage}
            alt={article.title}
            className="h-auto w-full"
          />
        </div>
      )}
    </header>
  );
}
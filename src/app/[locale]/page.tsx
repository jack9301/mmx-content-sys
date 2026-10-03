import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAllArticles } from '@/lib/articles';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');
  const tSite = await getTranslations('site');
  const articles = getAllArticles(locale).slice(0, 6);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-16 max-w-2xl">
        <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
          {tSite('title')}
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 dark:text-neutral-500">{tSite('tagline')}</p>
      </header>

      <section>
        <h2 className="mb-8 font-serif text-2xl text-neutral-800 dark:text-neutral-200">
          {t('latest')}
        </h2>

        {articles.length === 0 ? (
          <p className="text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">{t('noArticles')}</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {articles.map((article) => (
              <article key={article.slug} className="group">
                <Link href={`/articles/${article.slug}` as any} className="block">
                  {article.coverImage && (
                    <div className="aspect-[4/3] overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="mt-4">
                    <time className="text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">
                      {new Date(article.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <h3 className="mt-2 font-serif text-xl text-neutral-900 dark:text-neutral-100 group-hover:text-accent">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 dark:text-neutral-500 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">
                      {article.readingTime} {t('minRead')}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
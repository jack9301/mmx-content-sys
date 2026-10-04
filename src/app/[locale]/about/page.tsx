import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const tSite = await getTranslations('site');

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm uppercase tracking-wider text-neutral-500">
          {t('subtitle')}
        </p>
        <h1 className="font-serif text-5xl font-medium tracking-tight text-neutral-900">
          {tSite('title')}
        </h1>
        <p className="mt-4 text-2xl leading-relaxed text-neutral-800">
          {t('intro')}
        </p>
      </header>

      <section className="mb-10">
        <p className="text-lg leading-relaxed text-neutral-700">{t('lead')}</p>
      </section>

      <div className="space-y-10 text-neutral-700">
        <section>
          <h2 className="mb-3 font-serif text-2xl text-neutral-900">
            {t('whatWeCover')}
          </h2>
          <p className="leading-relaxed">{t('whatWeCoverBody')}</p>
          <p className="mt-4 text-sm">
            <Link
              href="/articles"
              className="text-[#0f766e] underline-offset-2 hover:underline"
            >
              {locale === 'zh'
                ? '查看全部文章 →'
                : locale === 'ja'
                ? 'すべての記事を見る →'
                : 'Browse all articles →'}
            </Link>
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-2xl text-neutral-900">
            {t('whoItsFor')}
          </h2>
          <p className="leading-relaxed">{t('whoItsForBody')}</p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-2xl text-neutral-900">
            {t('howItsWritten')}
          </h2>
          <p className="leading-relaxed">{t('howItsWrittenBody')}</p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-2xl text-neutral-900">
            {t('whatThisIsNot')}
          </h2>
          <p className="leading-relaxed">{t('whatThisIsNotBody')}</p>
        </section>

        <section>
          <h2 className="mb-3 font-serif text-2xl text-neutral-900">
            {t('languages')}
          </h2>
          <p className="leading-relaxed">{t('languagesBody')}</p>
        </section>

        <section className="mt-12 border-t border-neutral-200 pt-8">
          <h2 className="mb-2 font-serif text-2xl text-neutral-900">
            {t('contact')}
          </h2>
          <p className="mb-3 leading-relaxed">{t('contactIntro')}</p>
          <a
            href={`mailto:${t('contactEmail')}`}
            className="text-[#0f766e] underline-offset-2 hover:underline"
          >
            {t('contactEmail')}
          </a>
        </section>
      </div>
    </div>
  );
}
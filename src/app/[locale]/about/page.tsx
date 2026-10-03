import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100">
          {t('title')}
        </h1>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400 dark:text-neutral-500">
          Quiet Pages
        </p>
      </header>

      <p className="mb-6 text-2xl leading-relaxed text-neutral-800 dark:text-neutral-200">
        {t('intro')}
      </p>

      <p className="mb-12 text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
        {t('body')}
      </p>

      <section className="mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-8">
        <h2 className="mb-3 font-serif text-xl text-neutral-900 dark:text-neutral-100">
          {t('contact')}
        </h2>
        <a
          href={`mailto:${t('contactEmail')}`}
          className="text-[#0f766e] dark:text-[#2dd4bf] hover:underline"
        >
          {t('contactEmail')}
        </a>
      </section>
    </div>
  );
}

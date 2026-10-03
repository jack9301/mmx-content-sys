import { getTranslations, setRequestLocale } from 'next-intl/server';

type Section = {
  key: string;
  fallback: string;
  body: string;
};

export async function LegalPage({
  locale,
  namespace,
  date,
  sections,
}: {
  locale: string;
  namespace: 'privacy' | 'cookies' | 'disclosure' | 'about';
  date: string;
  sections: Section[];
}) {
  setRequestLocale(locale);
  const t = await getTranslations(namespace);
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl font-medium tracking-tight text-neutral-900">
          {t('title')}
        </h1>
        <p className="mt-3 text-sm text-neutral-500">
          {t('lastUpdated')}: {date}
        </p>
      </header>

      <p className="mb-10 text-lg leading-relaxed text-neutral-700">
        {t('intro')}
      </p>

      <div className="space-y-10 text-neutral-700">
        {sections.map((section) => (
          <section key={section.key}>
            <h2 className="mb-3 font-serif text-2xl text-neutral-900">
              {t(section.key as any) || section.fallback}
            </h2>
            <p className="leading-relaxed">{t(section.body as any) || section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

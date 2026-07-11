import { useTranslations } from 'next-intl';

export function SiteFooter({ locale: _locale }: { locale: string }) {
  const t = useTranslations('footer');
  const tSite = useTranslations('site');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/60 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-sm text-neutral-500">
          {t('copyright', { year, name: tSite('title') })}
        </p>
        <p className="mt-1 text-xs text-neutral-400">{t('builtWith')}</p>
      </div>
    </footer>
  );
}
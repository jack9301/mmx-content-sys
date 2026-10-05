import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function SiteFooter({ locale: _locale }: { locale: string }) {
  const tFooter = useTranslations('footer');
  const tSite = useTranslations('site');
  const tNav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 py-10">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-neutral-500">
              {tFooter('copyright', { year, name: tSite('title') })}
            </p>
            <p className="mt-1 text-xs text-neutral-400">{tFooter('builtWith')}</p>
          </div>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link
              href="/about"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {tNav('about')}
            </Link>
            <Link
              href="/privacy"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {tNav('privacy')}
            </Link>
            <Link
              href="/cookies"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {tNav('cookies')}
            </Link>
            <Link
              href="/disclosure"
              className="text-neutral-500 transition-colors hover:text-neutral-900"
            >
              {tNav('disclosure')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
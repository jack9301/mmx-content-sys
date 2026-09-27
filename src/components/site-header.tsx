'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';
import { Search as SearchIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SiteHeader({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const tSite = useTranslations('site');
  const pathname = usePathname();

  const links = [
    { href: '/' as const, label: t('home') },
    { href: '/articles' as const, label: t('articles') },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-[#fdfdfc]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight">
          {tSite('title')}
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-neutral-600 transition hover:text-neutral-900',
                pathname === link.href && 'text-neutral-900',
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/search"
            aria-label={t('search')}
            className={cn(
              'flex items-center text-neutral-600 transition hover:text-neutral-900',
              pathname === '/search' && 'text-neutral-900',
            )}
          >
            <SearchIcon className="h-4 w-4" strokeWidth={1.75} />
          </Link>
          <LanguageSwitcher currentLocale={locale} />
        </nav>
      </div>
    </header>
  );
}

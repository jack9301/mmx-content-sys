'use client';

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Search as SearchIcon, Home as HomeIcon, BookOpen } from 'lucide-react';

/**
 * Locale-aware 404 page (client component, no async params).
 * Rendered when a route matches `[locale]` but no specific page exists.
 */
export default function NotFound() {
  const t = useTranslations('notFound');
  const tSite = useTranslations('site');

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="text-center">
        {/* Eyebrow code */}
        <p className="mb-4 text-sm font-medium uppercase tracking-wider text-neutral-500">
          {t('code')}
        </p>

        {/* Large 404 number */}
        <p className="font-serif text-8xl font-medium leading-none tracking-tight text-neutral-900 sm:text-9xl">
          404
        </p>

        {/* Headline */}
        <h1 className="mt-6 font-serif text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
          {t('headline')}
        </h1>

        {/* Body */}
        <p className="mx-auto mt-4 max-w-xl text-base text-neutral-600">
          {t('body')}
        </p>

        {/* Cover illustration */}
        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-lg">
          <img
            src="/404-cover.png"
            alt=""
            className="h-auto w-full"
            width={1024}
            height={576}
          />
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-[#0f766e] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0d6960]"
          >
            <HomeIcon className="h-4 w-4" strokeWidth={1.75} />
            {t('home')}
          </Link>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <BookOpen className="h-4 w-4" strokeWidth={1.75} />
            {t('articles')}
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <SearchIcon className="h-4 w-4" strokeWidth={1.75} />
            {t('search')}
          </Link>
        </div>

        {/* Branding footer */}
        <p className="mt-12 text-xs uppercase tracking-wider text-neutral-400">
          {tSite('title')}
        </p>
      </div>
    </div>
  );
}
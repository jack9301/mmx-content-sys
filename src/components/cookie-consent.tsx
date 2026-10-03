'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const STORAGE_KEY = 'qp-cookie-consent';

type ConsentValue = 'accepted' | 'rejected' | null;

/**
 * Minimal, polite cookie-consent banner.
 * - Only shows if no choice has been made yet (localStorage)
 * - Has Accept and Reject buttons
 * - Persists choice across sessions
 * - Pure presentation; doesn't actually block third-party scripts
 *   (you'd extend this if you need to gate analytics/ads)
 */
export function CookieConsent() {
  const t = useTranslations('cookieConsent');
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ConsentValue;
      if (!saved) setShow(true);
    } catch {
      // localStorage blocked, just don't show
    }
  }, []);

  const setConsent = (value: 'accepted' | 'rejected') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setShow(false);
  };

  if (!mounted || !show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={t('title')}
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/95 p-4 shadow-lg backdrop-blur sm:bottom-4 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex-1 text-sm text-neutral-700 dark:text-neutral-300">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">{t('title')}</p>
          <p className="mt-1 leading-relaxed">{t('body')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-2">
          <button
            type="button"
            onClick={() => setConsent('rejected')}
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-300 transition hover:bg-neutral-50 dark:hover:bg-neutral-800/40 dark:bg-neutral-800/60"
          >
            {t('reject')}
          </button>
          <button
            type="button"
            onClick={() => setConsent('accepted')}
            className="rounded-md bg-[#0f766e] dark:bg-[#2dd4bf] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#0d6960] dark:bg-[#14b8a6]"
          >
            {t('accept')}
          </button>
          <button
            type="button"
            onClick={() => setShow(false)}
            aria-label="Dismiss"
            className="rounded-md p-1.5 text-neutral-400 transition hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 dark:text-neutral-300"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

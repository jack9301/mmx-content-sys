'use client';

import { useRouter, usePathname } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { useState, useTransition } from 'react';

const labels: Record<string, string> = {
  en: 'EN',
  zh: '中文',
  ja: '日本語',
};

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const switchTo = (nextLocale: string) => {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname as any, { locale: nextLocale });
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-neutral-600 hover:text-neutral-900:text-neutral-100"
        aria-label="Switch language"
      >
        {labels[currentLocale] ?? currentLocale.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[80px] rounded-md border border-neutral-200 bg-white py-1 shadow-md">
          {routing.locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-neutral-50:bg-neutral-800/40 ${
                loc === currentLocale ? 'font-medium text-accent' : 'text-neutral-700'
              }`}
            >
              {labels[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
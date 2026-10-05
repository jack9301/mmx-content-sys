'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Info } from 'lucide-react';

export function AffiliateDisclosure({ className }: { className?: string }) {
  const t = useTranslations('disclosure');
  return (
    <aside
      className={
        'my-6 flex items-start gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 ' +
        (className ?? '')
      }
    >
      <Info className="mt-0.5 h-4 w-4 flex-none text-neutral-500" strokeWidth={1.75} />
      <p>
        {t('asideBody')}{' '}
        <Link
          href="/disclosure"
          className="font-medium text-[#0f766e] underline-offset-2 hover:underline"
        >
          {t('title')}
        </Link>
        .
      </p>
    </aside>
  );
}
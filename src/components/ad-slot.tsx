'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

type AdSlotProps = {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'square';
  className?: string;
  /**
   * AdSense client id, e.g. "ca-pub-1234567890".
   * If not provided, the slot renders as an unobtrusive placeholder
   * so layout is reserved before ad code is added.
   */
  publisherId?: string;
};

/**
 * Renders a responsive ad slot. In placeholder mode (no publisherId),
 * shows a subtle "Advertisement" frame at the right size so the page
 * layout doesn't shift when real ads are added later.
 */
export function AdSlot({
  slot,
  format = 'auto',
  className,
  publisherId,
}: AdSlotProps) {
  const t = useTranslations('ads');

  // Placeholder mode: reserve space, show a small label
  if (!publisherId) {
    const sizeClass =
      format === 'horizontal'
        ? 'min-h-[90px]'
        : format === 'vertical'
        ? 'min-h-[600px]'
        : format === 'square'
        ? 'min-h-[250px]'
        : 'min-h-[120px]';

    return (
      <div
        data-ad-slot="placeholder"
        aria-label={t('placeholder')}
        className={cn(
          'my-8 flex w-full items-center justify-center rounded-md border border-dashed border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wider text-neutral-400',
          sizeClass,
          className,
        )}
      >
        {t('placeholder')}
      </div>
    );
  }

  // Real AdSense mode
  return (
    <ins
      className={cn('adsbygoogle my-8 block', className)}
      data-ad-client={publisherId}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}

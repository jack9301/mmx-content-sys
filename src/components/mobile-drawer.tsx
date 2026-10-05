'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { SearchIcon, XIcon, ChevronDown } from 'lucide-react';
import { menu } from '@/lib/menu';
import { cn } from '@/lib/utils';

type Props = {
  onClose: () => void;
  expandedSection: string | null;
  onToggleSection: (slug: string) => void;
};

export function MobileDrawer({ onClose, expandedSection, onToggleSection }: Props) {
  const tNav = useTranslations('nav');
  const tCat = useTranslations('category');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const panel = (
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="absolute inset-y-0 right-0 w-64 max-w-[85vw] overflow-y-auto bg-white shadow-2xl"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
          <span className="font-serif text-lg">{tCat('menu')}</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="-mr-1 flex h-11 w-11 items-center justify-center rounded text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="px-3 py-3">
          <Link
            href="/"
            className="block min-h-[44px] rounded px-3 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            {tNav('home')}
          </Link>

          {menu.sections.map((section) => {
            const isExpanded = expandedSection === section.slug;
            return (
              <div key={section.slug} className="mt-1">
                <button
                  type="button"
                  onClick={() => onToggleSection(section.slug)}
                  aria-expanded={isExpanded}
                  aria-controls={`mobile-section-${section.slug}`}
                  className="flex min-h-[44px] w-full items-center justify-between rounded px-3 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
                >
                  <span>{tNav(`sections.${section.slug}` as any)}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 transition-transform duration-200',
                      isExpanded && 'rotate-180',
                    )}
                    strokeWidth={1.75}
                  />
                </button>
                {isExpanded && (
                  <div
                    id={`mobile-section-${section.slug}`}
                    className="ml-3 mt-1 space-y-0.5 border-l border-neutral-200 pl-3"
                    role="region"
                    aria-label={`${tNav(`sections.${section.slug}` as any)} sub-menu`}
                  >
                    {section.items.map((item) => {
                      if (item.kind === 'category') {
                        const href = `/category/${item.slug}` as any;
                        return (
                          <Link
                            key={item.slug}
                            href={href}
                            className="block min-h-[44px] rounded px-3 py-3 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
                          >
                            {tNav(`categories.${item.labelKey}` as any)}
                          </Link>
                        );
                      }
                      if (item.kind === 'link') {
                        return (
                          <Link
                            key={item.href}
                            href={item.href as any}
                            className="block min-h-[44px] rounded px-3 py-3 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
                          >
                            {item.label}
                          </Link>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <Link
            href="/articles"
            className="mt-1 block min-h-[44px] rounded px-3 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            {tNav('articles')}
          </Link>
          <Link
            href="/search"
            className="flex min-h-[44px] items-center gap-2 rounded px-3 py-3 text-base font-medium text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            <SearchIcon className="h-4 w-4" strokeWidth={1.75} />
            {tNav('search')}
          </Link>
        </nav>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Search as SearchIcon, Menu as MenuIcon, X as XIcon, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { menu, type MenuSection } from '@/lib/menu';
import { cn } from '@/lib/utils';

export function SiteHeader({ locale }: { locale: string }) {
  const tNav = useTranslations('nav');
  const tSite = useTranslations('site');
  const pathname = usePathname();

  const [openSection, setOpenSection] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setExpandedSection(null);
  }, [pathname]);

  // Lock scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleEnter = (slug: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenSection(slug);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => setOpenSection(null), 150);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200/60 bg-[#fdfdfc]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-xl font-medium tracking-tight">
          {tSite('title')}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/"
            className={cn(
              'text-neutral-600 transition hover:text-neutral-900',
              pathname === '/' && 'text-neutral-900',
            )}
          >
            {tNav('home')}
          </Link>

          {/* Menu sections with dropdowns */}
          {menu.sections.map((section) => (
            <MenuDropdown
              key={section.slug}
              section={section}
              label={tNav(`sections.${section.slug}` as any)}
              isOpen={openSection === section.slug}
              onEnter={() => handleEnter(section.slug)}
              onLeave={handleLeave}
              pathname={pathname}
              tNav={tNav}
            />
          ))}

          <Link
            href="/articles"
            className={cn(
              'text-neutral-600 transition hover:text-neutral-900',
              pathname === '/articles' && 'text-neutral-900',
            )}
          >
            {tNav('articles')}
          </Link>

          <Link
            href="/search"
            aria-label={tNav('search')}
            className={cn(
              'flex items-center text-neutral-600 transition hover:text-neutral-900',
              pathname === '/search' && 'text-neutral-900',
            )}
          >
            <SearchIcon className="h-4 w-4" strokeWidth={1.75} />
          </Link>

          <LanguageSwitcher currentLocale={locale} />
        </nav>

        {/* Mobile hamburger button */}
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded text-neutral-700 transition hover:bg-neutral-100 md:hidden"
        >
          <MenuIcon className="h-5 w-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <MobileDrawer
          onClose={() => setMobileOpen(false)}
          expandedSection={expandedSection}
          onToggleSection={(slug) =>
            setExpandedSection(expandedSection === slug ? null : slug)
          }
          pathname={pathname}
        />
      )}
    </header>
  );
}

function MenuDropdown({
  section,
  label,
  isOpen,
  onEnter,
  onLeave,
  pathname,
  tNav,
}: {
  section: MenuSection;
  label: string;
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
  pathname: string;
  tNav: ReturnType<typeof useTranslations>;
}) {
  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          'flex items-center gap-1 text-neutral-600 transition hover:text-neutral-900',
          isOpen && 'text-neutral-900',
        )}
      >
        {label}
        <ChevronDown
          className={cn(
            'h-3 w-3 transition-transform',
            isOpen && 'rotate-180',
          )}
          strokeWidth={1.75}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-1/2 top-full z-10 mt-2 w-64 -translate-x-1/2 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg"
          role="menu"
        >
          {section.items.map((item) => {
            if (item.kind === 'category') {
              const href = `/category/${item.slug}` as any;
              return (
                <Link
                  key={item.slug}
                  href={href}
                  role="menuitem"
                  className={cn(
                    'block rounded px-3 py-2 text-sm transition hover:bg-neutral-50',
                    pathname === href ? 'text-[#0f766e]' : 'text-neutral-700',
                  )}
                >
                  <span className="block font-medium">
                    {tNav(`categories.${item.labelKey}` as any)}
                  </span>
                  {item.descriptionKey && (
                    <span className="mt-0.5 block text-xs text-neutral-500">
                      {tNav(`categories.${item.descriptionKey}` as any)}
                    </span>
                  )}
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href as any}
                role="menuitem"
                className="block rounded px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileDrawer({
  onClose,
  expandedSection,
  onToggleSection,
  pathname,
}: {
  onClose: () => void;
  expandedSection: string | null;
  onToggleSection: (slug: string) => void;
  pathname: string;
}) {
  const tNav = useTranslations('nav');
  const tCat = useTranslations('category');

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <span className="font-serif text-lg">{tCat('menu')}</span>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded text-neutral-700 transition hover:bg-neutral-100"
          >
            <XIcon className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <nav className="px-3 py-3">
          <Link
            href="/"
            className="block rounded px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            {tNav('home')}
          </Link>

          {menu.sections.map((section) => (
            <div key={section.slug} className="mt-1">
              <button
                type="button"
                onClick={() => onToggleSection(section.slug)}
                aria-expanded={expandedSection === section.slug}
                className="flex w-full items-center justify-between rounded px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
              >
                {tNav(`sections.${section.slug}` as any)}
                <ChevronDown
                  className={cn(
                    'h-4 w-4 transition-transform',
                    expandedSection === section.slug && 'rotate-180',
                  )}
                  strokeWidth={1.75}
                />
              </button>
              {expandedSection === section.slug && (
                <div className="mt-1 ml-3 space-y-0.5 border-l border-neutral-200 pl-3">
                  {section.items.map((item) => {
                    if (item.kind === 'category') {
                      const href = `/category/${item.slug}` as any;
                      return (
                        <Link
                          key={item.slug}
                          href={href}
                          className="block rounded px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-50"
                        >
                          {tNav(`categories.${item.labelKey}` as any)}
                        </Link>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href as any}
                        className="block rounded px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-50"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <Link
            href="/articles"
            className="mt-1 block rounded px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            {tNav('articles')}
          </Link>
          <Link
            href="/search"
            className="flex items-center gap-2 rounded px-3 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <SearchIcon className="h-4 w-4" strokeWidth={1.75} />
            {tNav('search')}
          </Link>
        </nav>
      </div>
    </div>
  );
}
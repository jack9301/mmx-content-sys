'use client';

import { useState, useEffect, useRef } from 'react';
import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Search as SearchIcon, Menu as MenuIcon, X as XIcon, ChevronDown } from 'lucide-react';
import { LanguageSwitcher } from './language-switcher';
import { MobileDrawer } from './mobile-drawer';
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
        <Link href="/" className="flex items-center gap-2 font-serif text-xl font-medium tracking-tight">
          <img
            src="/favicon.png"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
          {tSite('title')}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link
            href="/"
            className={cn(
              'text-neutral-600 transition hover:text-neutral-900:text-neutral-100',
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
              'text-neutral-600 transition hover:text-neutral-900:text-neutral-100',
              pathname === '/articles' && 'text-neutral-900',
            )}
          >
            {tNav('articles')}
          </Link>

          <Link
            href="/search"
            aria-label={tNav('search')}
            className={cn(
              'flex items-center text-neutral-600 transition hover:text-neutral-900:text-neutral-100',
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

      {/* Mobile drawer (rendered into <body> via portal to escape sticky/filter context) */}
      {mobileOpen && (
        <MobileDrawer
          onClose={() => setMobileOpen(false)}
          expandedSection={expandedSection}
          onToggleSection={(slug) =>
            setExpandedSection(expandedSection === slug ? null : slug)
          }
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
          'flex items-center gap-1 text-neutral-600 transition hover:text-neutral-900:text-neutral-100',
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
                    'block rounded px-3 py-2 text-sm transition hover:bg-neutral-50:bg-neutral-800/40',
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
            if (item.kind === 'link') {
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  role="menuitem"
                  className="block rounded px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50:bg-neutral-800/40"
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
}


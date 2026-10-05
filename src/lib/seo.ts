/**
 * Centralized SEO config.
 * Used by page-level generateMetadata functions, sitemap, robots, and JSON-LD.
 */

export const SITE_URL = 'https://mmx-content-sys02.pages.dev';
export const SITE_NAME = "Agubi Men's Health";
export const SITE_TAGLINE = 'Evidence-based care for prostate health.';
export const SITE_DESCRIPTION =
  'Evidence-based articles about prostate conditions, treatment, and recovery.';
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;
export const SITE_LOGO_URL = `${SITE_URL}/favicon.png`;
export const TWITTER_HANDLE = '@agubihealth';
export const SITE_LOCALE = 'en_US';

export const SUPPORTED_LOCALES = ['en', 'zh', 'ja'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const LOCALE_OG: Record<SupportedLocale, string> = {
  en: 'en_US',
  zh: 'zh_CN',
  ja: 'ja_JP',
};

export const KEYWORDS_BASE = [
  'prostate health',
  "men's health",
  'prostatitis',
  'BPH',
  'prostate cancer',
  'urology',
  'evidence-based',
] as const;

/**
 * Build a localized path: `/en/articles/foo` etc.
 */
export function localePath(locale: SupportedLocale, path = ''): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${p}`;
}

/**
 * Build alternate-language links for hreflang.
 * Returns an array suitable for Next.js `alternates.languages`.
 */
export function alternatesFor(
  path: string,
  canonicalLocale: SupportedLocale
): Record<string, string> & { 'x-default': string } {
  const result: Record<string, string> = {};
  for (const loc of SUPPORTED_LOCALES) {
    result[loc] = `${SITE_URL}${localePath(loc, path)}`;
  }
  // x-default points to the canonical locale (EN)
  result['x-default'] = `${SITE_URL}${localePath(canonicalLocale, path)}`;
  return result as Record<string, string> & { 'x-default': string };
}

/**
 * Common OpenGraph image spec.
 */
export const OG_IMAGE_SPEC = {
  url: OG_IMAGE_URL,
  width: 1376,
  height: 768,
  alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
} as const;
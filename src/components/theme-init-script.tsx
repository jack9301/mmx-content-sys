import Script from 'next/script';
import { themeInitScript } from '@/components/theme-provider';

/**
 * Runs the theme-init inline script in <head> before React hydrates.
 * This must be rendered inside the <body> in App Router layouts —
 * Next.js will hoist it appropriately.
 */
export function ThemeInitScript() {
  return (
    <Script
      id="theme-init"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: themeInitScript }}
    />
  );
}
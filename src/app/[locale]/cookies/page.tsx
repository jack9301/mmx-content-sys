import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';
import {
  SITE_NAME,
  alternatesFor,
  localePath,
  type SupportedLocale,
  LOCALE_OG,
} from '@/lib/seo';

const SUPPORTED = ['en', 'zh', 'ja'] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = (SUPPORTED as readonly string[]).includes(locale)
    ? (locale as SupportedLocale)
    : 'en';
  const path = localePath(safeLocale, '/cookies');
  return {
    title: 'Cookies Policy',
    description: `${SITE_NAME} cookies policy: what cookies we set, third-party cookies, and how to control them.`,
    alternates: {
      canonical: path,
      languages: alternatesFor('/cookies', safeLocale),
    },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[safeLocale],
      url: path,
      siteName: SITE_NAME,
      title: `Cookies Policy · ${SITE_NAME}`,
      description: `${SITE_NAME} cookies policy.`,
    },
  };
}

export default async function CookiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      namespace="cookies"
      date="2026-10-05"
      sections={[
        { key: 'what', fallback: 'What Are Cookies', body: 'whatBody' },
        { key: 'use', fallback: 'Cookies We Use', body: 'useBody' },
        { key: 'thirdParty', fallback: 'Third-Party Cookies', body: 'thirdPartyBody' },
        { key: 'control', fallback: 'How to Control Cookies', body: 'controlBody' },
        { key: 'changes', fallback: 'Changes to This Policy', body: 'changesBody' },
      ]}
    />
  );
}
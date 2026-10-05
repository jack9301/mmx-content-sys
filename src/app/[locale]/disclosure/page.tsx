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
  const path = localePath(safeLocale, '/disclosure');
  return {
    title: 'Affiliate Disclosure',
    description: `${SITE_NAME} affiliate disclosure: how affiliate links work, what programs we join, and our editorial independence policy.`,
    alternates: {
      canonical: path,
      languages: alternatesFor('/disclosure', safeLocale),
    },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[safeLocale],
      url: path,
      siteName: SITE_NAME,
      title: `Affiliate Disclosure · ${SITE_NAME}`,
      description: `${SITE_NAME} affiliate disclosure.`,
    },
  };
}

export default async function DisclosurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      namespace="disclosure"
      date="2026-10-05"
      sections={[
        { key: 'what', fallback: 'What Are Affiliate Links', body: 'whatBody' },
        { key: 'programs', fallback: 'Affiliate Programs We May Join', body: 'programsBody' },
        { key: 'funded', fallback: 'How the Site Is Funded', body: 'fundedBody' },
        { key: 'medical', fallback: 'Medical Independence', body: 'medicalBody' },
        { key: 'changes', fallback: 'Changes to This Disclosure', body: 'changesBody' },
      ]}
    />
  );
}
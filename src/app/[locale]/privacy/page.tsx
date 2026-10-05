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
  const path = localePath(safeLocale, '/privacy');
  return {
    title: 'Privacy Policy',
    description: `${SITE_NAME} privacy policy: what data we collect, how comments are handled, and your rights.`,
    alternates: {
      canonical: path,
      languages: alternatesFor('/privacy', safeLocale),
    },
    openGraph: {
      type: 'website',
      locale: LOCALE_OG[safeLocale],
      url: path,
      siteName: SITE_NAME,
      title: `Privacy Policy · ${SITE_NAME}`,
      description: `${SITE_NAME} privacy policy.`,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <LegalPage
      locale={locale}
      namespace="privacy"
      date="2026-10-05"
      sections={[
        { key: 'dataCollected', fallback: 'Information We Collect', body: 'dataCollectedBody' },
        { key: 'comments', fallback: 'Comments', body: 'commentsBody' },
        { key: 'cookies', fallback: 'Cookies and Tracking', body: 'cookiesBody' },
        { key: 'rights', fallback: 'Your Rights', body: 'rightsBody' },
        { key: 'children', fallback: "Children's Privacy", body: 'childrenBody' },
        { key: 'changes', fallback: 'Changes to This Policy', body: 'changesBody' },
      ]}
    />
  );
}
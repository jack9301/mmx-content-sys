import { LegalPage } from '@/components/legal-page';

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
      date="2026-07-16"
      sections={[
        { key: 'what', fallback: 'What Are Cookies', body: 'whatBody' },
        { key: 'use', fallback: 'Cookies We Use', body: 'useBody' },
        { key: 'thirdParty', fallback: 'Third-Party Cookies', body: 'thirdPartyBody' },
        { key: 'control', fallback: 'How to Control Cookies', body: 'controlBody' },
        { key: 'more', fallback: 'More Information', body: 'moreBody' },
      ]}
    />
  );
}

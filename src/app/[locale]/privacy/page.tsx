import { LegalPage } from '@/components/legal-page';

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
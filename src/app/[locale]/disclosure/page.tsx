import { LegalPage } from '@/components/legal-page';

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
      date="2026-07-16"
      sections={[
        { key: 'what', fallback: 'What Is an Affiliate Link', body: 'whatBody' },
        { key: 'presence', fallback: 'How You Can Identify Them', body: 'presenceBody' },
        { key: 'recommendations', fallback: 'Editorial Independence', body: 'recommendationsBody' },
        { key: 'programs', fallback: 'Programs', body: 'programsBody' },
        { key: 'questions', fallback: 'Questions', body: 'questionsBody' },
      ]}
    />
  );
}

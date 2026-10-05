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
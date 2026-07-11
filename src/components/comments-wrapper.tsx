'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Comments } from '@/components/comments';

type Props = { slug: string; locale: string };

export function CommentsWrapper({ slug, locale }: Props) {
  const t = useTranslations('article');
  const [translations, setTranslations] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    // Pull translations for the dynamic strings we added
    setTranslations({
      name: t('name'),
      namePlaceholder: t('namePlaceholder'),
      yourComment: t('yourComment'),
      commentPlaceholder: t('commentPlaceholder'),
      submit: t('submit'),
      submitting: t('submitting'),
      noComments: t('noComments'),
    });
  }, [t]);

  if (!translations) return null;
  return <Comments slug={slug} locale={locale} t={(key) => translations[key] ?? key} />;
}
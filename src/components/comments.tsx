'use client';

import Giscus from '@giscus/react';
import { useTheme } from '@/components/theme-provider';
import { useTranslations } from 'next-intl';

export function Comments({ locale, slug }: { locale: string; slug: string }) {
  const { theme } = useTheme();
  const t = useTranslations('article');

  return (
    <section className="mx-auto mt-16 max-w-2xl border-t border-neutral-200 pt-12">
      <h2 className="mb-2 font-serif text-2xl text-neutral-900">
        {t('comments')}
      </h2>
      <p className="mb-6 text-sm text-neutral-500">{t('commentNote')}</p>
      <Giscus
        id={`comments-${slug}`}
        repo="your-username/your-repo"
        repoId="R_replace_with_repo_id"
        category="Announcements"
        categoryId="DIC_replace_with_category_id"
        mapping="pathname"
        strict="1"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'dark' : 'light'}
        lang={locale === 'zh' ? 'zh-CN' : locale === 'ja' ? 'ja' : 'en'}
        loading="lazy"
      />
    </section>
  );
}
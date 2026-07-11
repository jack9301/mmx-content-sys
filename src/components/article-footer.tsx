import { useTranslations } from 'next-intl';
import type { Article } from '@/lib/articles';

export function ArticleFooter({ article }: { article: Article }) {
  const t = useTranslations('article');
  if (!article.tags?.length) return null;
  return (
    <footer className="mx-auto mt-16 max-w-2xl border-t border-neutral-200 pt-8">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-neutral-500">{t('tags')}:</span>
        {article.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
            #{tag}
          </span>
        ))}
      </div>
    </footer>
  );
}
import { useTranslations } from 'next-intl';

type Props = {
  items: string[];
};

/**
 * Key Takeaways box — executive summary at the top of an article.
 * Renders 3-5 concise bullets in a bordered, highlighted callout.
 *
 * Reads translation key `article.keyTakeaways` for the section label.
 */
export function KeyTakeaways({ items }: Props) {
  const t = useTranslations('article');
  if (!items || items.length === 0) return null;

  return (
    <aside className="not-prose my-8 rounded-lg border border-[#0f766e]/20 bg-[#0f766e]/5 p-6">
      <h2 className="mb-3 font-serif text-lg font-semibold text-[#0f766e]">
        {t('keyTakeaways')}
      </h2>
      <ul className="space-y-2 text-base text-neutral-800">
        {items.map((item, idx) => (
          <li key={idx} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0f766e]"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
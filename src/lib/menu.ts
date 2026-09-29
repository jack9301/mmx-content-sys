/**
 * Centralized site menu architecture.
 *
 * To extend later, just add another entry to the appropriate top-level
 * section's `items` array. Items can be:
 *   - { kind: 'category', slug, labelKey, descriptionKey?, items?: [...] }
 *   - { kind: 'link', href, label }
 *
 * Categories can be nested (a category can have its own `items` array).
 * A nested category also gets its own page at /[locale]/category/[slug].
 */

export type MenuLink = {
  kind: 'link';
  /** Where the link goes. Internal (starts with /) or external (https://). */
  href: string;
  label: string;
};

export type MenuCategory = {
  kind: 'category';
  /** Unique slug, also used as URL: /[locale]/category/[slug]/ */
  slug: string;
  /** Translation key inside `messages.{locale}.json` under `nav.categories.{slug}` */
  labelKey: string;
  /** Optional short description for the category page header */
  descriptionKey?: string;
  /** Optional nested sub-categories. Leaf categories have no items. */
  items?: MenuCategory[];
};

export type MenuItem = MenuCategory | MenuLink;

export type MenuSection = {
  kind: 'section';
  /** Translation key inside `messages.{locale}.json` under `nav.sections.{slug}` */
  slug: string;
  labelKey: string;
  items: MenuItem[];
};

export type Menu = {
  sections: MenuSection[];
};

/**
 * Flat list of every category, in menu order. Used to generate static params.
 * Walked recursively.
 */
export function flattenCategories(menu: Menu): MenuCategory[] {
  const out: MenuCategory[] = [];
  const walk = (cats: MenuItem[]) => {
    for (const c of cats) {
      if (c.kind === 'category') {
        out.push(c);
        if (c.items?.length) walk(c.items);
      }
    }
  };
  for (const section of menu.sections) walk(section.items);
  return out;
}

/**
 * Single source of truth for the whole site menu.
 * Translations live in messages/{en,zh,ja}.json under `nav.sections.*` and
 * `nav.categories.*`.
 */
export const menu: Menu = {
  sections: [
    {
      kind: 'section',
      slug: 'health',
      labelKey: 'health',
      items: [
        {
          kind: 'category',
          slug: 'symptoms',
          labelKey: 'symptoms',
          descriptionKey: 'symptomsDesc',
        },
        {
          kind: 'category',
          slug: 'conditions',
          labelKey: 'conditions',
          descriptionKey: 'conditionsDesc',
        },
        {
          kind: 'category',
          slug: 'treatment',
          labelKey: 'treatment',
          descriptionKey: 'treatmentDesc',
        },
        {
          kind: 'category',
          slug: 'causes-risk',
          labelKey: 'causesRisk',
          descriptionKey: 'causesRiskDesc',
        },
        {
          kind: 'category',
          slug: 'lifestyle',
          labelKey: 'lifestyle',
          descriptionKey: 'lifestyleDesc',
        },
      ],
    },
    {
      kind: 'section',
      slug: 'essays',
      labelKey: 'essays',
      items: [
        {
          kind: 'category',
          slug: 'slow-living',
          labelKey: 'slowLiving',
          descriptionKey: 'slowLivingDesc',
        },
      ],
    },
  ],
};
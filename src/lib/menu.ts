/**
 * Centralized site menu architecture.
 *
 * To extend later, just add another entry to the appropriate top-level
 * section's `items` array. Each item is one of:
 *   - { kind: 'category', slug, label, items: [{ slug, label }] }
 *   - { kind: 'link', href, label }
 *
 * The mapping of `slug` to articles lives in `article-categories.ts`.
 * Categories with no articles are still rendered in the menu but show an
 * "empty" state on the listing page, so we can pre-build buckets.
 */

import type { ReactNode } from 'react';

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
};

export type MenuSection = {
  kind: 'section';
  /** Translation key inside `messages.{locale}.json` under `nav.sections.{slug}` */
  slug: string;
  labelKey: string;
  items: (MenuCategory | MenuLink)[];
};

export type Menu = {
  sections: MenuSection[];
};

/**
 * Single source of truth for the whole site menu.
 * Translations live in messages/{en,zh,ja}.json under `nav.sections.*` and `nav.categories.*`.
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
          slug: 'prostate-conditions',
          labelKey: 'prostateConditions',
          descriptionKey: 'prostateConditionsDesc',
        },
        {
          kind: 'category',
          slug: 'treatment-recovery',
          labelKey: 'treatmentRecovery',
          descriptionKey: 'treatmentRecoveryDesc',
        },
        // Future-proof: just add another category here when you write one
        // Example: { kind: 'category', slug: 'symptoms', labelKey: 'symptoms' },
        // Example: { kind: 'category', slug: 'causes-risk', labelKey: 'causesRisk' },
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
        // Future-proof: add more essay categories here later
        // Example: { kind: 'category', slug: 'travel', labelKey: 'travel' },
      ],
    },
  ],
};
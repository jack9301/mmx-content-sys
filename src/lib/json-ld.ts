/**
 * JSON-LD structured data helpers.
 * Used by server components via <script type="application/ld+json">.
 */

import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOGO_URL,
} from './seo';

type JsonLdObject = Record<string, unknown>;

/**
 * Organization JSON-LD for the home page.
 * https://schema.org/Organization
 */
export function organizationJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO_URL,
    description: SITE_DESCRIPTION,
    sameAs: [
      // Add social profiles here as you create them.
    ],
  };
}

/**
 * WebSite JSON-LD with a SearchAction for sitelinks search box.
 * https://schema.org/WebSite
 */
export function websiteJsonLd(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/en/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Article JSON-LD for individual articles.
 * https://schema.org/Article
 */
export function articleJsonLd(args: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string; // ISO 8601
  authorName: string;
  inLanguage: string;
  keywords: string[];
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: args.title,
    description: args.description,
    url: args.url,
    image: args.image ? [args.image] : undefined,
    datePublished: args.datePublished,
    dateModified: args.datePublished,
    author: {
      '@type': 'Organization',
      name: args.authorName,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: SITE_LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': args.url,
    },
    inLanguage: args.inLanguage,
    keywords: args.keywords.join(', '),
    isAccessibleForFree: true,
  };
}

/**
 * BreadcrumbList JSON-LD.
 * https://schema.org/BreadcrumbList
 */
export function breadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
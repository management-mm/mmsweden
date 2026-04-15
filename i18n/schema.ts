import type { AppLocale } from '@i18n/config';

type MultiLang = Record<string, string>;

function isMultiLang(value: unknown): value is MultiLang {
  return typeof value === 'object' && value !== null;
}

export function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

export function getLocalizedText(
  value: unknown,
  locale: AppLocale,
  fallback: string
): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (isMultiLang(value)) {
    return value[locale] || value.en || Object.values(value)[0] || fallback;
  }

  return fallback;
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildOrganizationSchema(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Meat Machines',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
  };
}

export function buildWebsiteSchema(siteUrl: string, locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Meat Machines',
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
  };
}

type BuildProductSchemaParams = {
  locale: AppLocale;
  canonicalUrl: string;
  name: string;
  description: string;
  images?: string[];
  manufacturer?: string;
  condition?: 'new' | 'used' | string;
  sku?: string;
};

export function buildProductSchema({
  locale,
  canonicalUrl,
  name,
  description,
  images = [],
  manufacturer,
  condition,
  sku,
}: BuildProductSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku,
    productID: sku,
    image: images,
    brand: manufacturer
      ? {
          '@type': 'Brand',
          name: manufacturer,
        }
      : undefined,
    itemCondition:
      condition === 'new'
        ? 'https://schema.org/NewCondition'
        : condition === 'used'
          ? 'https://schema.org/UsedCondition'
          : undefined,
    url: canonicalUrl,
    inLanguage: locale,
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'SEK',
      availability: 'https://schema.org/InStock',
    },
  } satisfies Record<string, unknown>;
}

type BuildCollectionPageSchemaParams = {
  locale: AppLocale;
  url: string;
  name: string;
  description: string;
};

export function buildCollectionPageSchema({
  locale,
  url,
  name,
  description,
}: BuildCollectionPageSchemaParams) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url,
    inLanguage: locale,
  };
}

type BreadcrumbItem = {
  name: string;
  item: string;
};

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

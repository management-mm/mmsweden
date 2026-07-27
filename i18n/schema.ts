import type { AppLocale } from '@i18n/config';

type MultiLang = Record<string, string>;

function isMultiLang(value: unknown): value is MultiLang {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(item => typeof item === 'string')
  );
}

function getNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

export function getSiteUrl(): string {
  return (
    process.env.SITE_URL?.trim().replace(/\/$/, '') ?? 'https://www.mmsweden.se'
  );
}

export function getLocalizedText(
  value: unknown,
  locale: AppLocale,
  fallback: string
): string {
  const directValue = getNonEmptyString(value);

  if (directValue) {
    return directValue;
  }

  if (isMultiLang(value)) {
    const candidates = [value[locale], value.en, ...Object.values(value)];

    for (const candidate of candidates) {
      const localizedValue = getNonEmptyString(candidate);

      if (localizedValue) {
        return localizedValue;
      }
    }
  }

  return fallback;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function buildOrganizationSchema(siteUrl: string, logoUrl?: string) {
  const normalizedLogoUrl = getNonEmptyString(logoUrl);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MM Sweden',
    url: siteUrl,
    logo: normalizedLogoUrl,
  };
}

export function buildWebsiteSchema(siteUrl: string, locale: AppLocale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MM Sweden',
    url: `${siteUrl}/${locale}`,
    inLanguage: locale,
  };
}

type ProductAvailability =
  | 'InStock'
  | 'OutOfStock'
  | 'SoldOut'
  | 'Discontinued'
  | 'LimitedAvailability'
  | 'PreOrder'
  | 'BackOrder';

type BuildProductSchemaParams = {
  locale: AppLocale;
  canonicalUrl: string;
  name: string;
  description: string;
  images?: string[];
  manufacturer?: string;
  condition?: 'new' | 'used' | string;
  sku?: string;

  price?: number;
  priceCurrency?: string;
  availability?: ProductAvailability;
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
  price,
  priceCurrency,
  availability = 'InStock',
}: BuildProductSchemaParams) {
  const normalizedImages = images.map(image => image.trim()).filter(Boolean);

  const normalizedManufacturer = getNonEmptyString(manufacturer);

  const normalizedSku = getNonEmptyString(sku);
  const normalizedCurrency = getNonEmptyString(priceCurrency)?.toUpperCase();

  const hasValidOffer =
    typeof price === 'number' &&
    Number.isFinite(price) &&
    price > 0 &&
    Boolean(normalizedCurrency);

  const itemCondition =
    condition === 'new'
      ? 'https://schema.org/NewCondition'
      : condition === 'used'
        ? 'https://schema.org/UsedCondition'
        : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    sku: normalizedSku,
    productID: normalizedSku,
    image: normalizedImages.length > 0 ? normalizedImages : undefined,
    brand: normalizedManufacturer
      ? {
          '@type': 'Brand',
          name: normalizedManufacturer,
        }
      : undefined,
    itemCondition,
    url: canonicalUrl,
    inLanguage: locale,

    offers: hasValidOffer
      ? {
          '@type': 'Offer',
          url: canonicalUrl,
          price,
          priceCurrency: normalizedCurrency,
          availability: `https://schema.org/${availability}`,
          itemCondition,
        }
      : undefined,
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

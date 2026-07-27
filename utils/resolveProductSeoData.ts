import type { IProduct } from '@interfaces/IProduct';

import slugToLabel from './slugToLabel';

import { type AppLocale, DEFAULT_LOCALE } from '@i18n/config';

type SeoRef = {
  slug?: string;
  name?: string | Record<string, string>;
};

export type ProductWithSeo = IProduct & {
  seoCategory?: SeoRef | string | null;
  seoSubcategory?: SeoRef | string | null;
};

export type ProductSeoData = {
  categorySlug: string;
  subcategorySlug: string;
  productSlug: string;
  categoryLabel: string;
  subcategoryLabel: string;
  hasCanonicalPath: boolean;
  shouldRedirect: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMultiLang(value: unknown): value is Record<string, string> {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).some(item => typeof item === 'string');
}

function getNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

function isMongoObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function extractStringSlug(value: unknown): string | undefined {
  const slug = getNonEmptyString(value);

  if (!slug || isMongoObjectId(slug)) {
    return undefined;
  }

  return slug;
}

function extractObjectSlug(value: unknown): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  return extractStringSlug(value.slug);
}

function extractName(
  value: unknown
): string | Record<string, string> | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const { name } = value;

  if (typeof name === 'string' || isMultiLang(name)) {
    return name;
  }

  return undefined;
}

function getLocalizedText(
  value: unknown,
  locale: AppLocale,
  fallback: string
): string {
  const directValue = getNonEmptyString(value);

  if (directValue) {
    return directValue;
  }

  if (isMultiLang(value)) {
    const candidates = [
      value[locale],
      value[DEFAULT_LOCALE],
      ...Object.values(value),
    ];

    for (const candidate of candidates) {
      const localizedValue = getNonEmptyString(candidate);

      if (localizedValue) {
        return localizedValue;
      }
    }
  }

  return fallback;
}

export function resolveProductSeoData(
  product: ProductWithSeo,
  locale: AppLocale,
  routeCategorySlug: string,
  routeSubcategorySlug: string,
  routeSlug: string
): ProductSeoData {
  const actualCategorySlug =
    extractStringSlug(product.seoCategorySlug) ??
    extractObjectSlug(product.seoCategory) ??
    extractObjectSlug(product.seoCategoryId);

  const actualSubcategorySlug =
    extractStringSlug(product.seoSubcategorySlug) ??
    extractObjectSlug(product.seoSubcategory) ??
    extractObjectSlug(product.seoSubcategoryId);

  const actualProductSlug = extractStringSlug(product.slug);

  const hasCanonicalPath = Boolean(
    actualCategorySlug && actualSubcategorySlug && actualProductSlug
  );

  const categorySlug = actualCategorySlug ?? routeCategorySlug;
  const subcategorySlug = actualSubcategorySlug ?? routeSubcategorySlug;
  const productSlug = actualProductSlug ?? routeSlug;

  const categoryNameSource =
    extractName(product.seoCategory) ?? extractName(product.seoCategoryId);

  const subcategoryNameSource =
    extractName(product.seoSubcategory) ??
    extractName(product.seoSubcategoryId);

  const categoryLabel = getLocalizedText(
    categoryNameSource,
    locale,
    slugToLabel(categorySlug)
  );

  const subcategoryLabel = getLocalizedText(
    subcategoryNameSource,
    locale,
    slugToLabel(subcategorySlug)
  );

  const shouldRedirect =
    hasCanonicalPath &&
    (routeCategorySlug !== actualCategorySlug ||
      routeSubcategorySlug !== actualSubcategorySlug ||
      routeSlug !== actualProductSlug);

  return {
    categorySlug,
    subcategorySlug,
    productSlug,
    categoryLabel,
    subcategoryLabel,
    hasCanonicalPath,
    shouldRedirect,
  };
}

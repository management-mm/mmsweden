import { getSiteUrl } from './config';
import type {
  ProductSitemapItem,
  SeoCategorySitemapItem,
  SitemapUrlItem,
} from './types';
import { escapeXml, isNonEmptyString, safeDate } from './utils';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

export const STATIC_PAGES = [
  '',
  '/about-us',
  '/all-products',
  '/sell-to-us',
  '/contact-us',
] as const;

export function buildLocalizedUrl(
  siteUrl: string,
  locale: AppLocale,
  path: string
) {
  return `${siteUrl}/${locale}${path}`;
}

export function buildAlternateLinks(path: string) {
  const siteUrl = getSiteUrl();

  return SUPPORTED_LOCALES.map(
    locale =>
      `<xhtml:link rel="alternate" hreflang="${escapeXml(locale)}" href="${escapeXml(
        buildLocalizedUrl(siteUrl, locale, path)
      )}" />`
  ).join('');
}

export function buildStaticPageEntries(): SitemapUrlItem[] {
  const siteUrl = getSiteUrl();

  return SUPPORTED_LOCALES.flatMap(locale =>
    STATIC_PAGES.map(path => ({
      loc: buildLocalizedUrl(siteUrl, locale, path),
      alternates: buildAlternateLinks(path),
    }))
  );
}

export function buildCategoryEntries(
  categories: SeoCategorySitemapItem[]
): SitemapUrlItem[] {
  const siteUrl = getSiteUrl();

  const validCategories = categories.filter(category =>
    isNonEmptyString(category.slug)
  );

  const categoryEntries = SUPPORTED_LOCALES.flatMap(locale =>
    validCategories.map(category => {
      const categoryPath = `/all-products/${category.slug}`;

      return {
        loc: buildLocalizedUrl(siteUrl, locale, categoryPath),
        lastmod: safeDate(category.updatedAt),
        alternates: buildAlternateLinks(categoryPath),
      };
    })
  );

  const subcategoryEntries = SUPPORTED_LOCALES.flatMap(locale =>
    validCategories.flatMap(category =>
      (category.subcategories ?? [])
        .filter(subcategory => isNonEmptyString(subcategory.slug))
        .map(subcategory => {
          const subcategoryPath = `/all-products/${category.slug}/${subcategory.slug}`;

          return {
            loc: buildLocalizedUrl(siteUrl, locale, subcategoryPath),
            lastmod: safeDate(subcategory.updatedAt),
            alternates: buildAlternateLinks(subcategoryPath),
          };
        })
    )
  );

  return [...categoryEntries, ...subcategoryEntries];
}

export function getProductPath(product: ProductSitemapItem) {
  return `/all-products/${product.seoCategorySlug}/${product.seoSubcategorySlug}/${product.slug}`;
}

export function buildProductEntries(
  products: ProductSitemapItem[]
): SitemapUrlItem[] {
  const siteUrl = getSiteUrl();

  const validProducts = products.filter(
    product =>
      isNonEmptyString(product.slug) &&
      isNonEmptyString(product.seoCategorySlug) &&
      isNonEmptyString(product.seoSubcategorySlug)
  );

  return SUPPORTED_LOCALES.flatMap(locale =>
    validProducts.map(product => {
      const productPath = getProductPath(product);

      return {
        loc: buildLocalizedUrl(siteUrl, locale, productPath),
        lastmod: safeDate(product.updatedAt),
        alternates: buildAlternateLinks(productPath),
      };
    })
  );
}

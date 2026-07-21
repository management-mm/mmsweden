import { getSiteUrl } from './config';
import type {
  ProductSitemapItem,
  SeoCategorySitemapItem,
  SitemapUrlItem,
} from './types';
import { escapeXml, isNonEmptyString, safeDate } from './utils';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from '@i18n/config';

export const STATIC_PAGES = [
  '',
  '/about-us',
  '/all-products',
  '/new-arrivals',
  '/sell-to-us',
  '/contact-us',
] as const;

function normalizePath(path: string): string {
  const normalizedPath = path.trim();

  if (!normalizedPath || normalizedPath === '/') {
    return '';
  }

  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

function encodeSlug(slug: string): string {
  return encodeURIComponent(normalizeSlug(slug));
}

export function buildLocalizedUrl(
  siteUrl: string,
  locale: AppLocale,
  path: string
): string {
  return `${siteUrl}/${locale}${normalizePath(path)}`;
}

export function buildAlternateLinks(
  path: string,
  locales: readonly AppLocale[] = SUPPORTED_LOCALES
): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = normalizePath(path);

  const uniqueLocales = [...new Set(locales)].filter(locale =>
    SUPPORTED_LOCALES.includes(locale)
  );

  const localeLinks = uniqueLocales.map(locale => {
    const href = buildLocalizedUrl(siteUrl, locale, normalizedPath);

    return `<xhtml:link rel="alternate" hreflang="${escapeXml(
      locale
    )}" href="${escapeXml(href)}" />`;
  });

  const defaultHref = buildLocalizedUrl(
    siteUrl,
    DEFAULT_LOCALE,
    normalizedPath
  );

  const defaultLink = `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
    defaultHref
  )}" />`;

  return [...localeLinks, defaultLink].join('');
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

  const validCategories = categories
    .map(category => ({
      ...category,
      slug: normalizeSlug(category.slug),
    }))
    .filter(category => isNonEmptyString(category.slug));

  const categoryEntries = SUPPORTED_LOCALES.flatMap(locale =>
    validCategories.map(category => {
      const categoryPath = `/all-products/${encodeSlug(category.slug)}`;

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
        .map(subcategory => ({
          ...subcategory,
          slug: normalizeSlug(subcategory.slug),
        }))
        .filter(subcategory => isNonEmptyString(subcategory.slug))
        .map(subcategory => {
          const subcategoryPath = `/all-products/${encodeSlug(
            category.slug
          )}/${encodeSlug(subcategory.slug)}`;

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

export function getProductPath(product: ProductSitemapItem): string {
  return `/all-products/${encodeSlug(
    product.seoCategorySlug
  )}/${encodeSlug(product.seoSubcategorySlug)}/${encodeSlug(product.slug)}`;
}

export function buildProductEntries(
  products: ProductSitemapItem[]
): SitemapUrlItem[] {
  const siteUrl = getSiteUrl();

  const validProducts = products
    .map(product => ({
      ...product,
      slug: normalizeSlug(product.slug),
      seoCategorySlug: normalizeSlug(product.seoCategorySlug),
      seoSubcategorySlug: normalizeSlug(product.seoSubcategorySlug),
    }))
    .filter(
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

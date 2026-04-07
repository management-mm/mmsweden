import type { MetadataRoute } from 'next';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type ProductSitemapItem = {
  slug: string;
  updatedAt?: string;
  categorySlug: string;
  subcategorySlug: string;
};

type SeoSubcategorySitemapItem = {
  slug: string;
  updatedAt?: string;
};

type SeoCategorySitemapItem = {
  slug: string;
  updatedAt?: string;
  subcategories?: SeoSubcategorySitemapItem[];
};

const STATIC_PAGES = [
  '',
  '/about-us',
  '/all-products',
  '/sell-to-us',
  '/contact-us',
] as const;

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
}

async function getProductsForSitemap(): Promise<ProductSitemapItem[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];

  const res = await fetch(`${apiUrl}/products/sitemap`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  return res.json();
}

async function getSeoCategoriesForSitemap(): Promise<SeoCategorySitemapItem[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];

  const res = await fetch(`${apiUrl}/seo-categories/tree?activeOnly=true`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  return res.json();
}

function buildLocalizedUrl(siteUrl: string, locale: AppLocale, path: string) {
  return `${siteUrl}/${locale}${path}`;
}

function buildAlternates(path: string) {
  const siteUrl = getSiteUrl();

  return {
    languages: Object.fromEntries(
      SUPPORTED_LOCALES.map(locale => [
        locale,
        buildLocalizedUrl(siteUrl, locale, path),
      ])
    ),
  };
}

function safeDate(value?: string) {
  if (!value) return undefined;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [products, categories] = await Promise.all([
    getProductsForSitemap(),
    getSeoCategoriesForSitemap(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      STATIC_PAGES.map(path => ({
        url: buildLocalizedUrl(siteUrl, locale, path),
        alternates: buildAlternates(path),
      }))
  );

  const validCategories = categories.filter(
    category =>
      typeof category.slug === 'string' && category.slug.trim().length > 0
  );

  const categoryEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      validCategories.map(category => {
        const categoryPath = `/all-products/${category.slug}`;

        return {
          url: buildLocalizedUrl(siteUrl, locale, categoryPath),
          lastModified: safeDate(category.updatedAt),
          alternates: buildAlternates(categoryPath),
        };
      })
  );

  const subcategoryEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      validCategories.flatMap(category =>
        (category.subcategories ?? [])
          .filter(
            subcategory =>
              typeof subcategory.slug === 'string' &&
              subcategory.slug.trim().length > 0
          )
          .map(subcategory => {
            const subcategoryPath = `/all-products/${category.slug}/${subcategory.slug}`;

            return {
              url: buildLocalizedUrl(siteUrl, locale, subcategoryPath),
              lastModified: safeDate(subcategory.updatedAt),
              alternates: buildAlternates(subcategoryPath),
            };
          })
      )
  );

  const validProducts = products.filter(
    product =>
      typeof product.slug === 'string' &&
      product.slug.trim().length > 0 &&
      typeof product.categorySlug === 'string' &&
      product.categorySlug.trim().length > 0 &&
      typeof product.subcategorySlug === 'string' &&
      product.subcategorySlug.trim().length > 0
  );

  const productEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      validProducts.map(product => {
        const productPath = `/all-products/${product.categorySlug}/${product.subcategorySlug}/${product.slug}`;

        return {
          url: buildLocalizedUrl(siteUrl, locale, productPath),
          lastModified: safeDate(product.updatedAt),
          alternates: buildAlternates(productPath),
        };
      })
  );

  return [
    ...staticEntries,
    ...categoryEntries,
    ...subcategoryEntries,
    ...productEntries,
  ];
}

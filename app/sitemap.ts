import type { MetadataRoute } from 'next';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type ProductSitemapItem = {
  slug: string;
  updatedAt?: string;
  seoCategorySlug: string;
  seoSubcategorySlug: string;
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
  return (
    process.env.API_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
    'https://mmsweden-server.onrender.com'
  );
}

async function safeFetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return [] as T;
    }

    return res.json();
  } catch {
    return [] as T;
  }
}

async function getProductsForSitemap(): Promise<ProductSitemapItem[]> {
  const apiUrl = getApiUrl();
  return safeFetchJson<ProductSitemapItem[]>(`${apiUrl}/products/sitemap`);
}

async function getSeoCategoriesForSitemap(): Promise<SeoCategorySitemapItem[]> {
  const apiUrl = getApiUrl();
  return safeFetchJson<SeoCategorySitemapItem[]>(
    `${apiUrl}/seo-categories/tree?activeOnly=true`
  );
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
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

  const validCategories = categories.filter(category =>
    isNonEmptyString(category.slug)
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
          .filter(subcategory => isNonEmptyString(subcategory.slug))
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
      isNonEmptyString(product.slug) &&
      isNonEmptyString(product.seoCategorySlug) &&
      isNonEmptyString(product.seoSubcategorySlug)
  );

  const productEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      validProducts.map(product => {
        const productPath = `/all-products/${product.seoCategorySlug}/${product.seoSubcategorySlug}/${product.slug}`;

        return {
          url: buildLocalizedUrl(siteUrl, locale, productPath),
          lastModified: safeDate(product.updatedAt),
          alternates: buildAlternates(productPath),
        };
      })
  );

  const allEntries = [
    ...staticEntries,
    ...categoryEntries,
    ...subcategoryEntries,
    ...productEntries,
  ];

  const uniqueEntries = Array.from(
    new Map(allEntries.map(entry => [entry.url, entry])).values()
  );

  return uniqueEntries;
}

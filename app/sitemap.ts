import type { MetadataRoute } from 'next';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type ProductSitemapItem = {
  slug: string;
  updatedAt?: string;
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

async function getProductsForSitemap(): Promise<ProductSitemapItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  const res = await fetch(`${apiUrl}/products/sitemap`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return [];
  }

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

function getStaticPriority(path: string) {
  if (path === '') return 1;
  if (path === '/all-products') return 0.9;
  return 0.7;
}

function getStaticChangeFrequency(
  path: string
): 'daily' | 'weekly' | 'monthly' | 'yearly' {
  if (path === '') return 'weekly';
  if (path === '/all-products') return 'weekly';
  return 'monthly';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const products = await getProductsForSitemap();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      STATIC_PAGES.map(path => ({
        url: buildLocalizedUrl(siteUrl, locale, path),
        lastModified: now,
        changeFrequency: getStaticChangeFrequency(path),
        priority: getStaticPriority(path),
        alternates: buildAlternates(path),
      }))
  );

  const validProducts = products.filter(
    product =>
      typeof product.slug === 'string' && product.slug.trim().length > 0
  );

  const productEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      validProducts.map(product => {
        const productPath = `/all-products/${product.slug}`;

        return {
          url: buildLocalizedUrl(siteUrl, locale, productPath),
          lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
          changeFrequency: 'weekly',
          priority: 0.6,
          alternates: buildAlternates(productPath),
        };
      })
  );

  return [...staticEntries, ...productEntries];
}

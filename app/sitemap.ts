import type { MetadataRoute } from 'next';

import { SUPPORTED_LOCALES, type AppLocale } from '@i18n/config';

type ProductSitemapItem = {
  slug: string;
  updatedAt?: string;
};

const STATIC_PAGES = [
  '',
  '/about-us',
  '/all-products',
  '/sell-to-us',
  '/contact-us'
] as const;

async function getProductsForSitemap(): Promise<ProductSitemapItem[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL!;

  const res = await fetch(`${apiUrl}/products/sitemap`, {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

function buildLocalizedUrl(locale: AppLocale, path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  return `${siteUrl}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      STATIC_PAGES.map(path => ({
        url: buildLocalizedUrl(locale, path),
        lastModified: new Date(),
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        priority: path === '' ? 1 : 0.8
      }))
  );

  const products = await getProductsForSitemap();

  const productEntries: MetadataRoute.Sitemap = SUPPORTED_LOCALES.flatMap(
    locale =>
      products.map(product => ({
        url: buildLocalizedUrl(locale, `/all-products/${product.slug}`),
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
      }))
  );

  return [...staticEntries, ...productEntries];
}
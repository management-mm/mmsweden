import { getApiUrl } from './config';
import type { ProductSitemapItem, SeoCategorySitemapItem } from './types';

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

export async function getProductsForSitemap(): Promise<ProductSitemapItem[]> {
  const apiUrl = getApiUrl();
  return safeFetchJson<ProductSitemapItem[]>(`${apiUrl}/products/sitemap`);
}

export async function getSeoCategoriesForSitemap(): Promise<
  SeoCategorySitemapItem[]
> {
  const apiUrl = getApiUrl();

  return safeFetchJson<SeoCategorySitemapItem[]>(
    `${apiUrl}/seo-categories/tree?activeOnly=true`
  );
}

import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

import type { AppLocale } from '@i18n/config';

const baseUrl =
  process.env.API_URL || process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export interface GetProductsParams {
  lang?: AppLocale;
  sort?: string;
  perPage?: number;
  page?: number;
  keyword?: string;
  category?: string[];
  industry?: string[];
  manufacturer?: string;
  condition?: string;
  categorySlug?: string;
  subcategorySlug?: string;
}

export interface GetProductsResponse {
  products: IProduct[];
  total: number;
}

export const fetchRecommendedProductsBySlug = async (
  slug: string | undefined
): Promise<IProduct[]> => {
  const response = await axios.get(
    `${baseUrl}/products/${slug}/recommended-products`
  );
  return response.data;
};

export async function getProducts(query: GetProductsParams) {
  const searchParams = new URLSearchParams();

  if (query.keyword) {
    searchParams.append('keyword', query.keyword);
  }

  if (query.manufacturer) {
    searchParams.append('manufacturer', query.manufacturer);
  }

  if (query.condition) {
    searchParams.append('condition', query.condition);
  }

  if (query.categorySlug) {
    searchParams.append('categorySlug', query.categorySlug);
  }

  if (query.subcategorySlug) {
    searchParams.append('subcategorySlug', query.subcategorySlug);
  }

  query.category?.forEach(category => {
    searchParams.append('category', category);
  });

  query.industry?.forEach(industry => {
    searchParams.append('industry', industry);
  });

  if (query.page) {
    searchParams.append('page', String(query.page));
  }

  if (query.perPage) {
    searchParams.append('perPage', String(query.perPage));
  }

  if (query.lang) {
    searchParams.append('lang', query.lang);
  }

  const url = `${baseUrl}/products?${searchParams.toString()}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}. Body: ${text}`
    );
  }

  return text ? JSON.parse(text) : null;
}

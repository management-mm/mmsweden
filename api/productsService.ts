import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';
import type { AppLocale } from '@i18n/config';

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
}

export interface GetProductsResponse {
  products: IProduct[];
  total: number;
}

export const fetchRecommendedProductsBySlug = async (
  slug: string | undefined
): Promise<IProduct[]> => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}/recommended-products`
  );
  return response.data;
};

export async function getProducts(
  params: GetProductsParams
): Promise<GetProductsResponse> {
  const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error('API_URL is not defined on the server');
  }

  const searchParams = new URLSearchParams();

  if (params.lang) searchParams.set('lang', params.lang);
  if (params.sort) searchParams.set('sort', params.sort);
  if (params.perPage) searchParams.set('perPage', String(params.perPage));
  if (params.page) searchParams.set('page', String(params.page));
  if (params.keyword) searchParams.set('keyword', params.keyword);
  if (params.manufacturer) searchParams.set('manufacturer', params.manufacturer);
  if (params.condition) searchParams.set('condition', params.condition);

  params.category?.forEach(value => searchParams.append('category', value));
  params.industry?.forEach(value => searchParams.append('industry', value));

  const url = `${baseUrl}products?${searchParams.toString()}`;

  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}. URL: ${url}. Body: ${text}`
    );
  }

  return res.json();
}
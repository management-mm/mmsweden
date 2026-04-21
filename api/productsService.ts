import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

import type { AppLocale } from '@i18n/config';

const rawBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const baseUrl = rawBaseUrl?.replace(/\/$/, '');

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

interface RequestOptions {
  signal?: AbortSignal;
}

function getBaseUrl(): string {
  if (!baseUrl) {
    throw new Error(
      'API URL is not configured. Set API_URL or NEXT_PUBLIC_API_URL.'
    );
  }

  return baseUrl;
}

function buildUrl(path: string, searchParams?: URLSearchParams): string {
  const queryString = searchParams?.toString();
  return queryString
    ? `${getBaseUrl()}${path}?${queryString}`
    : `${getBaseUrl()}${path}`;
}

function createProductsSearchParams(query: GetProductsParams): URLSearchParams {
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

  if (query.sort) {
    searchParams.append('sort', query.sort);
  }

  query.category?.forEach(category => {
    searchParams.append('category', category);
  });

  query.industry?.forEach(industry => {
    searchParams.append('industry', industry);
  });

  if (typeof query.page === 'number') {
    searchParams.append('page', String(query.page));
  }

  if (typeof query.perPage === 'number') {
    searchParams.append('perPage', String(query.perPage));
  }

  if (query.lang) {
    searchParams.append('lang', query.lang);
  }

  return searchParams;
}

export const fetchRecommendedProductsBySlug = async (
  slug: string | undefined,
  options: RequestOptions = {}
): Promise<IProduct[]> => {
  if (!slug) {
    return [];
  }

  const response = await axios.get<IProduct[]>(
    buildUrl(`/products/${slug}/recommended-products`),
    {
      signal: options.signal,
    }
  );

  return response.data;
};

export async function getProducts(
  query: GetProductsParams,
  options: RequestOptions = {}
): Promise<GetProductsResponse> {
  const url = buildUrl('/products', createProductsSearchParams(query));

  const res = await fetch(url, {
    signal: options.signal,
    next: { revalidate: 60 },
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      `Failed to fetch products: ${res.status} ${res.statusText}. Body: ${text}`
    );
  }

  if (!text) {
    throw new Error('Failed to fetch products: empty response body');
  }

  return JSON.parse(text) as GetProductsResponse;
}

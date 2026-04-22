import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

import { AppError, type AppErrorCode } from '@utils/errors/AppError';
import { normalizeError } from '@utils/errors/normalizeError';

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
    throw new AppError(
      'API URL is not configured. Set API_URL or NEXT_PUBLIC_API_URL.',
      'UNKNOWN',
      {
        isOperational: false,
      }
    );
  }

  return baseUrl;
}

function getErrorCodeByStatus(status: number): AppErrorCode {
  if (status === 400 || status === 422) return 'VALIDATION';
  if (status === 401) return 'UNAUTHORIZED';
  if (status === 403) return 'FORBIDDEN';
  if (status === 404) return 'NOT_FOUND';
  if (status >= 500) return 'SERVER';

  return 'UNKNOWN';
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

  try {
    const response = await axios.get<IProduct[]>(
      buildUrl(`/products/${slug}/recommended-products`),
      {
        signal: options.signal,
      }
    );

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export async function getProducts(
  query: GetProductsParams,
  options: RequestOptions = {}
): Promise<GetProductsResponse> {
  try {
    const url = buildUrl('/products', createProductsSearchParams(query));

    const res = await fetch(url, {
      signal: options.signal,
      next: { revalidate: 60 },
    });

    const text = await res.text();

    if (!res.ok) {
      throw new AppError(
        `Failed to fetch products: ${res.status} ${res.statusText}`,
        getErrorCodeByStatus(res.status),
        {
          status: res.status,
          details: text,
        }
      );
    }

    if (!text) {
      throw new AppError(
        'Failed to fetch products: empty response body',
        'SERVER'
      );
    }

    try {
      return JSON.parse(text) as GetProductsResponse;
    } catch {
      throw new AppError('Failed to parse products response JSON', 'SERVER', {
        details: text,
      });
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

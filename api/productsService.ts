import axios from 'axios';
import type { IProduct } from 'interfaces/IProduct';

import { api } from '@store/api';

import { AppError, type AppErrorCode } from '@utils/errors/AppError';
import { normalizeError } from '@utils/errors/normalizeError';

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
  categorySlug?: string;
  subcategorySlug?: string;
  isAdmin?: boolean;
  hasDeletionDate?: boolean;
  isDraft?: boolean;
  hasNotes?: boolean;
}

export interface GetProductsResponse {
  products: IProduct[];
  total: number;
}

interface RequestOptions {
  signal?: AbortSignal;
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim().replace(/\/+$/, '');

  return normalizedValue || undefined;
}

function getBaseUrl(): string {
  const baseUrl =
    normalizeBaseUrl(process.env.API_URL) ??
    normalizeBaseUrl(process.env.NEXT_PUBLIC_API_URL);

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

function appendPositiveIntegerParam(
  searchParams: URLSearchParams,
  key: string,
  value: number | undefined,
  max?: number
) {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    !Number.isInteger(value) ||
    value < 1
  ) {
    return;
  }

  const normalizedValue =
    typeof max === 'number' ? Math.min(value, max) : value;

  searchParams.append(key, String(normalizedValue));
}

function getErrorCodeByStatus(status: number): AppErrorCode {
  if (status === 400 || status === 422) {
    return 'VALIDATION';
  }

  if (status === 401) {
    return 'UNAUTHORIZED';
  }

  if (status === 403) {
    return 'FORBIDDEN';
  }

  if (status === 404) {
    return 'NOT_FOUND';
  }

  if (status >= 500) {
    return 'SERVER';
  }

  return 'UNKNOWN';
}

function buildUrl(path: string, searchParams?: URLSearchParams): string {
  const queryString = searchParams?.toString();

  return queryString
    ? `${getBaseUrl()}${path}?${queryString}`
    : `${getBaseUrl()}${path}`;
}

function isMongoObjectId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function normalizeString(value?: string) {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue || undefined;
}

function normalizeSlug(value?: string) {
  const normalizedValue = normalizeString(value);

  if (!normalizedValue) {
    return undefined;
  }

  try {
    const decodedValue = decodeURIComponent(normalizedValue).trim();

    if (!decodedValue || isMongoObjectId(decodedValue)) {
      return undefined;
    }

    return decodedValue;
  } catch {
    if (isMongoObjectId(normalizedValue)) {
      return undefined;
    }

    return normalizedValue;
  }
}

function appendStringParam(
  searchParams: URLSearchParams,
  key: string,
  value?: string
) {
  const normalizedValue = normalizeString(value);

  if (normalizedValue) {
    searchParams.append(key, normalizedValue);
  }
}

function appendSlugParam(
  searchParams: URLSearchParams,
  key: string,
  value?: string
) {
  const normalizedValue = normalizeSlug(value);

  if (normalizedValue) {
    searchParams.append(key, normalizedValue);
  }
}

function appendArrayParam(
  searchParams: URLSearchParams,
  key: string,
  values?: string[]
) {
  values?.forEach(value => {
    const normalizedValue = normalizeString(value);

    if (normalizedValue) {
      searchParams.append(key, normalizedValue);
    }
  });
}

function createProductsSearchParams(query: GetProductsParams): URLSearchParams {
  const searchParams = new URLSearchParams();

  appendStringParam(searchParams, 'keyword', query.keyword);
  appendStringParam(searchParams, 'manufacturer', query.manufacturer);
  appendStringParam(searchParams, 'condition', query.condition);
  appendStringParam(searchParams, 'sort', query.sort);

  appendSlugParam(searchParams, 'categorySlug', query.categorySlug);
  appendSlugParam(searchParams, 'subcategorySlug', query.subcategorySlug);

  appendArrayParam(searchParams, 'category', query.category);
  appendArrayParam(searchParams, 'industry', query.industry);

  appendPositiveIntegerParam(searchParams, 'page', query.page);
  appendPositiveIntegerParam(searchParams, 'perPage', query.perPage, 100);

  if (query.lang) {
    searchParams.append('lang', query.lang);
  }

  if (query.hasDeletionDate) {
    searchParams.append('hasDeletionDate', 'true');
  }

  if (query.isDraft) {
    searchParams.append('isDraft', 'true');
  }

  if (query.hasNotes) {
    searchParams.append('hasNotes', 'true');
  }

  return searchParams;
}

export const fetchRecommendedProductsBySlug = async (
  slug: string | undefined,
  options: RequestOptions = {}
): Promise<IProduct[]> => {
  const normalizedSlug = normalizeSlug(slug);

  if (!normalizedSlug) {
    return [];
  }

  try {
    const response = await axios.get<IProduct[]>(
      buildUrl(
        `/products/${encodeURIComponent(normalizedSlug)}/recommended-products`
      ),
      {
        signal: options.signal,
      }
    );

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
};

export async function getAdminProducts(
  query: GetProductsParams,
  options: RequestOptions = {}
): Promise<GetProductsResponse> {
  try {
    const response = await api.get<GetProductsResponse>('/products/admin', {
      params: createProductsSearchParams(query),
      signal: options.signal,
    });

    return response.data;
  } catch (error) {
    throw normalizeError(error);
  }
}

function isGetProductsResponse(value: unknown): value is GetProductsResponse {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    Array.isArray(response.products) &&
    typeof response.total === 'number' &&
    Number.isFinite(response.total)
  );
}

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
          details: text.slice(0, 2000),
        }
      );
    }

    if (!text) {
      return {
        products: [],
        total: 0,
      };
    }

    const data: unknown = JSON.parse(text);

    if (!isGetProductsResponse(data)) {
      throw new AppError(
        'Invalid products response: expected products array and total number.',
        'SERVER',
        {
          details: text.slice(0, 2000),
        }
      );
    }

    return data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw normalizeError(error);
  }
}

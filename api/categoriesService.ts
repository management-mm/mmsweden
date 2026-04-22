import { ISeoCategory } from '@interfaces/ISeoCategory';

import { AppError, type AppErrorCode } from '@utils/errors/AppError';
import { normalizeError } from '@utils/errors/normalizeError';

const rawBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
const baseUrl = rawBaseUrl?.replace(/\/$/, '');

type GetSeoCategoriesParams = {
  activeOnly?: boolean;
};

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

function buildUrl(
  path: string,
  params?: Record<string, string | boolean | undefined>
): string {
  const url = new URL(`${getBaseUrl()}${path}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function fetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
    });

    const text = await res.text();

    if (!res.ok) {
      throw new AppError(
        `Failed to fetch SEO categories: ${res.status} ${res.statusText}`,
        getErrorCodeByStatus(res.status),
        {
          status: res.status,
          details: {
            url,
            body: text,
          },
        }
      );
    }

    if (!text) {
      throw new AppError(
        'Failed to fetch SEO categories: empty response body',
        'SERVER',
        {
          details: { url },
        }
      );
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      throw new AppError(
        'Failed to parse SEO categories response JSON',
        'SERVER',
        {
          details: {
            url,
            body: text,
          },
        }
      );
    }
  } catch (error) {
    throw normalizeError(error);
  }
}

export async function getTree(
  params: GetSeoCategoriesParams = {}
): Promise<ISeoCategory[]> {
  const url = buildUrl('/seo-categories/tree', {
    activeOnly: params.activeOnly,
  });

  return fetchJson<ISeoCategory[]>(url);
}

export async function getTopLevel(
  params: GetSeoCategoriesParams = {}
): Promise<ISeoCategory[]> {
  const url = buildUrl('/seo-categories', {
    activeOnly: params.activeOnly,
  });

  return fetchJson<ISeoCategory[]>(url);
}

export async function getChildren(
  parentId: string,
  params: GetSeoCategoriesParams = {}
): Promise<ISeoCategory[]> {
  const url = buildUrl(`/seo-categories/parent/${parentId}/children`, {
    activeOnly: params.activeOnly,
  });

  return fetchJson<ISeoCategory[]>(url);
}

export async function getCategoryBySlug(slug: string): Promise<ISeoCategory> {
  const url = buildUrl(`/seo-categories/${slug}`);

  return fetchJson<ISeoCategory>(url);
}

export async function getSubcategoryByPath(
  categorySlug: string,
  childSlug: string
): Promise<ISeoCategory> {
  const url = buildUrl(`/seo-categories/${categorySlug}/${childSlug}`);

  return fetchJson<ISeoCategory>(url);
}

import { ISeoCategory } from '@interfaces/ISeoCategory';

const baseUrl = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ''
).replace(/\/$/, '');

type GetSeoCategoriesParams = {
  activeOnly?: boolean;
};

function buildUrl(
  path: string,
  params?: Record<string, string | boolean | undefined>
) {
  const url = new URL(`${baseUrl}${path}`);

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
  const res = await fetch(url, {
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Failed to fetch SEO categories: ${res.status} ${res.statusText}. URL: ${url}. Body: ${text}`
    );
  }

  return res.json();
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

/** Shared, URL-only catalog pagination helpers (safe on server and client). */
export type CatalogSearchParams = {
  page?: string;
  title?: string;
  manufacturer?: string;
  condition?: string;
  sort?: string;
  category?: string | string[];
  industry?: string | string[];
};

export function getCatalogPageNumber(value?: string): number {
  if (!value || !/^\d+$/.test(value)) return 1;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 1;
}

function hasValue(value?: string): boolean {
  return Boolean(value?.trim());
}

function hasArrayValue(value?: string | string[]): boolean {
  return (Array.isArray(value) ? value : value ? [value] : []).some(hasValue);
}

/** Filtered and sorted pages should not become separate indexable listings. */
export function hasCatalogFilters(query: CatalogSearchParams): boolean {
  return (
    hasValue(query.title) ||
    hasValue(query.manufacturer) ||
    hasValue(query.condition) ||
    hasValue(query.sort) ||
    hasArrayValue(query.category) ||
    hasArrayValue(query.industry)
  );
}

/** Unfiltered page 2+ has its OWN canonical and hreflang, not page 1. */
export function getCatalogCanonicalPath(
  path: string,
  query: CatalogSearchParams = {}
): string {
  const page = getCatalogPageNumber(query.page);
  return page > 1 && !hasCatalogFilters(query) ? `${path}?page=${page}` : path;
}

/** Keep all active filters (including multi-valued ones) when changing page. */
export function getCatalogFilterQuery(query: CatalogSearchParams): string {
  const params = new URLSearchParams();
  for (const key of ['title', 'manufacturer', 'condition', 'sort'] as const) {
    const value = query[key]?.trim();
    if (value) params.set(key, value);
  }
  for (const key of ['category', 'industry'] as const) {
    const values = query[key];
    for (const value of Array.isArray(values)
      ? values
      : values
        ? [values]
        : []) {
      if (value.trim()) params.append(key, value.trim());
    }
  }
  return params.toString();
}

export function buildCatalogPageHref(
  pathname: string,
  page: number,
  queryString = ''
): string {
  const params = new URLSearchParams(queryString);
  params.delete('page');
  if (page > 1 && Number.isSafeInteger(page)) {
    params.set('page', String(page));
  }
  const search = params.toString();
  return search ? `${pathname}?${search}` : pathname;
}

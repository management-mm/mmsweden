import {
  buildCatalogPageHref,
  getCatalogCanonicalPath,
  getCatalogFilterQuery,
  getCatalogPageNumber,
  hasCatalogFilters,
} from '@lib/catalogPagination';
import { describe, expect, it } from 'vitest';

describe('catalog SEO pagination', () => {
  it('links page 1 to the clean category URL and page 2 to its own address', () => {
    expect(buildCatalogPageHref('/en/all-products/bakery-machinery', 1)).toBe(
      '/en/all-products/bakery-machinery'
    );
    expect(buildCatalogPageHref('/en/all-products/bakery-machinery', 2)).toBe(
      '/en/all-products/bakery-machinery?page=2'
    );
  });

  it('preserves repeated filters and a sorting parameter across pages', () => {
    const filters = getCatalogFilterQuery({
      category: ['bakery', 'packaging'],
      manufacturer: 'Rondo',
      sort: 'newest',
      page: '7',
    });
    const href = buildCatalogPageHref('/de/all-products', 3, filters);
    const url = new URL(href, 'https://example.com');
    expect(url.searchParams.getAll('category')).toEqual([
      'bakery',
      'packaging',
    ]);
    expect(url.searchParams.get('manufacturer')).toBe('Rondo');
    expect(url.searchParams.get('sort')).toBe('newest');
    expect(url.searchParams.get('page')).toBe('3');
    expect(url.searchParams.getAll('page')).toHaveLength(1);
  });

  it('gives unfiltered page 2 a self canonical without merging it into page 1', () => {
    const pathname = '/sv/all-products/bakery-machinery/dough-mixers';
    expect(getCatalogCanonicalPath(pathname, { page: '2' })).toBe(
      `${pathname}?page=2`
    );
    expect(getCatalogCanonicalPath(pathname, { page: '1' })).toBe(pathname);
  });

  it('keeps filtered and sorted listings nonindexable with a clean canonical', () => {
    const pathname = '/de/all-products';
    const filters = { page: '2', category: ['bakery'], sort: 'newest' };
    expect(hasCatalogFilters(filters)).toBe(true);
    expect(getCatalogCanonicalPath(pathname, filters)).toBe(pathname);
  });

  it('normalizes invalid page numbers and ignores them in the canonical', () => {
    for (const invalid of ['0', '-1', 'x', '1.5', '999999999999999999999']) {
      expect(getCatalogPageNumber(invalid)).toBe(1);
      expect(
        getCatalogCanonicalPath('/en/all-products', { page: invalid })
      ).toBe('/en/all-products');
    }
  });
});

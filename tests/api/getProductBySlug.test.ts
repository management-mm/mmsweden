import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getProductBySlug } from '../../api/getProductBySlug';
import type { ProductWithSeo } from '../../utils/resolveProductSeoData';

const fetchMock = vi.fn<typeof fetch>();

const multilingual = (value: string) => ({
  en: value,
  sv: value,
  de: value,
  fr: value,
  es: value,
  ru: value,
  uk: value,
  pl: value,
});

const product: ProductWithSeo = {
  _id: '507f1f77bcf86cd799439011',
  name: multilingual('Hobart H600 Mixer'),
  slug: 'hobart-h600-mixer',
  idNumber: 'MM-1001',
  description: multilingual('Industrial mixer'),
  dimensions: '',
  photos: [],
  video: '',
  category: multilingual('Food processing'),
  manufacturer: 'Hobart',
  industries: [multilingual('Food industry')],
  condition: 'used',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  deletionDate: null,
  seoCategorySlug: 'food-processing-machines',
  seoSubcategorySlug: 'industrial-mixers',
  productCategory: multilingual('Mixers'),
};

function createResponse(params: {
  status: number;
  statusText?: string;
  body?: unknown;
}): Response {
  const {
    status,
    statusText = status === 200 ? 'OK' : 'Error',
    body = product,
  } = params;

  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: vi.fn().mockResolvedValue(body),
  } as unknown as Response;
}

describe('getProductBySlug', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('API_URL', 'https://api.example.com/');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('returns null for an empty slug without calling fetch', async () => {
    await expect(getProductBySlug('   ')).resolves.toBeNull();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns null for a MongoDB ObjectId without calling fetch', async () => {
    await expect(
      getProductBySlug('507f1f77bcf86cd799439011')
    ).resolves.toBeNull();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('encodes the slug and requests the product API', async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        status: 200,
      })
    );

    await getProductBySlug('industrial mixer/ä');

    expect(fetchMock).toHaveBeenCalledOnce();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/products/by-slug/industrial%20mixer%2F%C3%A4',
      {
        next: {
          revalidate: 300,
        },
      }
    );
  });

  it('returns the product for a successful response', async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        status: 200,
        body: product,
      })
    );

    await expect(getProductBySlug('hobart-h600-mixer')).resolves.toEqual(
      product
    );
  });

  it.each([404, 410])(
    'returns null when the API responds with %i',
    async status => {
      fetchMock.mockResolvedValue(
        createResponse({
          status,
        })
      );

      await expect(getProductBySlug('missing-product')).resolves.toBeNull();
    }
  );

  it('throws a descriptive error for a server error', async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        status: 500,
        statusText: 'Internal Server Error',
      })
    );

    await expect(getProductBySlug('broken-product')).rejects.toThrow(
      'Failed to fetch product "broken-product": 500 Internal Server Error'
    );
  });

  it.each([
    ['an array', []],
    ['null', null],
    ['a string', 'invalid response'],
    ['a number', 123],
  ])('rejects %s returned instead of a product object', async (_, body) => {
    fetchMock.mockResolvedValue(
      createResponse({
        status: 200,
        body,
      })
    );

    await expect(getProductBySlug('invalid-product')).rejects.toThrow(
      'Invalid product response for "invalid-product": expected an object'
    );
  });

  it('uses NEXT_PUBLIC_API_URL when API_URL is unavailable', async () => {
    vi.stubEnv('API_URL', '');
    vi.stubEnv('NEXT_PUBLIC_API_URL', 'https://public-api.example.com/');

    fetchMock.mockResolvedValue(
      createResponse({
        status: 200,
      })
    );

    await getProductBySlug('hobart-h600-mixer');

    expect(fetchMock).toHaveBeenCalledWith(
      'https://public-api.example.com/products/by-slug/hobart-h600-mixer',
      {
        next: {
          revalidate: 300,
        },
      }
    );
  });
});

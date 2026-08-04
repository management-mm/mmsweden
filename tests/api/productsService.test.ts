import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getProducts } from '../../api/productsService';
import { AppError } from '../../utils/errors/AppError';

const fetchMock = vi.fn<typeof fetch>();

function createResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    text: vi.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

function createErrorResponse(
  status: number,
  statusText: string,
  body: unknown = { message: 'API error' }
): Response {
  return {
    ok: false,
    status,
    statusText,
    text: vi.fn().mockResolvedValue(JSON.stringify(body)),
  } as unknown as Response;
}

describe('getProducts', () => {
  beforeEach(() => {
    fetchMock.mockReset();

    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('API_URL', 'https://api.example.com/');
    vi.stubEnv('NEXT_PUBLIC_API_URL', '');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('builds a normalized request URL and returns products', async () => {
    const responseBody = {
      products: [],
      total: 0,
    };

    fetchMock.mockResolvedValue(createResponse(responseBody));

    const controller = new AbortController();

    const result = await getProducts(
      {
        keyword: '  mixer  ',
        categorySlug: '  food-processing  ',
        page: 2,
        perPage: 50,
        lang: 'en',
      },
      {
        signal: controller.signal,
      }
    );

    expect(result).toEqual(responseBody);

    expect(fetchMock).toHaveBeenCalledOnce();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/products?keyword=mixer&categorySlug=food-processing&page=2&perPage=50&lang=en',
      {
        signal: controller.signal,
        next: {
          revalidate: 60,
        },
      }
    );
  });
  it('ignores invalid pagination values and limits perPage to 100', async () => {
    const responseBody = {
      products: [],
      total: 0,
    };

    fetchMock.mockResolvedValue(createResponse(responseBody));

    const result = await getProducts({
      page: -5,
      perPage: 500,
    });

    expect(result).toEqual(responseBody);

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.example.com/products?perPage=100',
      {
        signal: undefined,
        next: {
          revalidate: 60,
        },
      }
    );
  });
  it('does not include fractional pagination values in the URL', async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        products: [],
        total: 0,
      })
    );

    await getProducts({
      page: 1.5,
      perPage: 20.7,
    });

    expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/products', {
      signal: undefined,
      next: {
        revalidate: 60,
      },
    });
  });
  it.each([
    {
      status: 400,
      statusText: 'Bad Request',
      expectedCode: 'VALIDATION',
    },
    {
      status: 422,
      statusText: 'Unprocessable Entity',
      expectedCode: 'VALIDATION',
    },
    {
      status: 401,
      statusText: 'Unauthorized',
      expectedCode: 'UNAUTHORIZED',
    },
    {
      status: 403,
      statusText: 'Forbidden',
      expectedCode: 'FORBIDDEN',
    },
    {
      status: 404,
      statusText: 'Not Found',
      expectedCode: 'NOT_FOUND',
    },
    {
      status: 500,
      statusText: 'Internal Server Error',
      expectedCode: 'SERVER',
    },
    {
      status: 418,
      statusText: "I'm a Teapot",
      expectedCode: 'UNKNOWN',
    },
  ])(
    'maps HTTP $status to $expectedCode',
    async ({ status, statusText, expectedCode }) => {
      fetchMock.mockResolvedValue(createErrorResponse(status, statusText));

      try {
        await getProducts({
          keyword: 'mixer',
        });

        throw new Error('Expected getProducts to reject');
      } catch (error) {
        expect(error).toBeInstanceOf(AppError);

        expect(error).toMatchObject({
          code: expectedCode,
          status,
        });

        expect((error as Error).message).toBe(
          `Failed to fetch products: ${status} ${statusText}`
        );
      }
    }
  );
  it('throws a server error when the response has an invalid structure', async () => {
    fetchMock.mockResolvedValue(
      createResponse({
        products: 'not-an-array',
        total: 'not-a-number',
      })
    );

    try {
      await getProducts({});

      throw new Error('Expected getProducts to reject');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);

      expect(error).toMatchObject({
        code: 'SERVER',
      });

      expect((error as Error).message).toBe(
        'Invalid products response: expected products array and total number.'
      );
    }
  });
});

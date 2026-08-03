import type { ProductWithSeo } from '@utils/resolveProductSeoData';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMongoObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function normalizeApiUrl(value: string | undefined): string | undefined {
  const normalizedValue = value?.trim().replace(/\/+$/, '');

  return normalizedValue || undefined;
}

function getApiUrl(): string {
  return (
    normalizeApiUrl(process.env.API_URL) ??
    normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL) ??
    'https://mmsweden-server.onrender.com'
  );
}

export async function getProductBySlug(
  slug: string
): Promise<ProductWithSeo | null> {
  const normalizedSlug = slug.trim();

  if (!normalizedSlug || isMongoObjectId(normalizedSlug)) {
    return null;
  }

  const response = await fetch(
    `${getApiUrl()}/products/by-slug/${encodeURIComponent(normalizedSlug)}`,
    {
      next: {
        revalidate: 300,
      },
    }
  );

  if (response.status === 404 || response.status === 410) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product "${normalizedSlug}": ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();

  if (!isRecord(data)) {
    throw new Error(
      `Invalid product response for "${normalizedSlug}": expected an object`
    );
  }

  return data as unknown as ProductWithSeo;
}

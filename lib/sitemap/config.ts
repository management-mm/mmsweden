export const MAX_URLS_PER_SITEMAP = 50_000;

function normalizeBaseUrl(value: string, variableName: string): string {
  const normalizedValue = value.trim().replace(/\/+$/, '');

  if (!normalizedValue) {
    throw new Error(`${variableName} is empty`);
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(normalizedValue);
  } catch {
    throw new Error(`${variableName} must be a valid absolute URL`);
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    throw new Error(`${variableName} must use http or https`);
  }

  return normalizedValue;
}

export function getSiteUrl(): string {
  const siteUrl = process.env.SITE_URL?.trim() || 'https://www.mmsweden.se';

  return normalizeBaseUrl(siteUrl, 'SITE_URL');
}

export function getApiUrl(): string {
  const apiUrl =
    process.env.API_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim();

  if (!apiUrl) {
    throw new Error(
      'API_URL is not configured. Add API_URL to the deployment environment.'
    );
  }

  return normalizeBaseUrl(apiUrl, 'API_URL');
}

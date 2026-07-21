import { buildProductEntries } from '@lib/sitemap/builders';
import { MAX_URLS_PER_SITEMAP } from '@lib/sitemap/config';
import { getProductsForSitemap } from '@lib/sitemap/fetchers';
import { uniqueByLoc } from '@lib/sitemap/utils';
import { buildUrlSetXml, xmlResponse } from '@lib/sitemap/xml';

type RouteContext = {
  params: Promise<{
    page: string;
  }>;
};

function parseSitemapPage(value: string): number | null {
  const normalizedValue = value.trim();
  const match = /^(\d+)(?:\.xml)?$/.exec(normalizedValue);

  if (!match) {
    return null;
  }

  const pageNumber = Number(match[1]);

  return Number.isSafeInteger(pageNumber) && pageNumber >= 1
    ? pageNumber
    : null;
}

function notFoundResponse(): Response {
  return new Response('Not Found', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<Response> {
  const { page } = await params;
  const pageNumber = parseSitemapPage(page);

  if (pageNumber === null) {
    return notFoundResponse();
  }

  const products = await getProductsForSitemap();
  const entries = uniqueByLoc(buildProductEntries(products));

  const totalPages = Math.ceil(entries.length / MAX_URLS_PER_SITEMAP);

  if (totalPages === 0 || pageNumber > totalPages) {
    return notFoundResponse();
  }

  const startIndex = (pageNumber - 1) * MAX_URLS_PER_SITEMAP;
  const endIndex = startIndex + MAX_URLS_PER_SITEMAP;
  const pageEntries = entries.slice(startIndex, endIndex);

  return xmlResponse(buildUrlSetXml(pageEntries));
}

import { buildProductEntries } from '@lib/sitemap/builders';
import { MAX_URLS_PER_SITEMAP } from '@lib/sitemap/config';
import { getProductsForSitemap } from '@lib/sitemap/fetchers';
import { chunkArray, uniqueByLoc } from '@lib/sitemap/utils';
import { buildUrlSetXml, xmlResponse } from '@lib/sitemap/xml';

type RouteContext = {
  params: Promise<{
    page: string;
  }>;
};

export async function GET(_: Request, { params }: RouteContext) {
  const { page } = await params;
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return new Response('Not Found', { status: 404 });
  }

  const products = await getProductsForSitemap();
  const entries = uniqueByLoc(buildProductEntries(products));

  const chunks = chunkArray(entries, MAX_URLS_PER_SITEMAP);
  const chunk = chunks[pageNumber - 1];

  if (!chunk) {
    return new Response('Not Found', { status: 404 });
  }

  return xmlResponse(buildUrlSetXml(chunk));
}

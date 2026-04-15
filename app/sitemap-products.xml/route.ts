import { buildProductEntries } from '@lib/sitemap/builders';
import { MAX_URLS_PER_SITEMAP, getSiteUrl } from '@lib/sitemap/config';
import { getProductsForSitemap } from '@lib/sitemap/fetchers';
import { chunkArray, uniqueByLoc } from '@lib/sitemap/utils';
import {
  buildSitemapIndexXml,
  buildUrlSetXml,
  xmlResponse,
} from '@lib/sitemap/xml';

export async function GET() {
  const siteUrl = getSiteUrl();
  const products = await getProductsForSitemap();

  const entries = uniqueByLoc(buildProductEntries(products));

  if (entries.length <= MAX_URLS_PER_SITEMAP) {
    return xmlResponse(buildUrlSetXml(entries));
  }

  const chunks = chunkArray(entries, MAX_URLS_PER_SITEMAP);

  const sitemapIndexItems = chunks.map((chunk, index) => {
    const lastmodValues = chunk
      .map(item => item.lastmod)
      .filter((value): value is string => Boolean(value));

    const latestLastmod =
      lastmodValues.length > 0
        ? new Date(
            Math.max(...lastmodValues.map(value => new Date(value).getTime()))
          ).toISOString()
        : undefined;

    return {
      loc: `${siteUrl}/sitemap-products/${index + 1}.xml`,
      lastmod: latestLastmod,
    };
  });

  return xmlResponse(buildSitemapIndexXml(sitemapIndexItems));
}

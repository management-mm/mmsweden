import { getSiteUrl } from '@lib/sitemap/config';
import { buildSitemapIndexXml, xmlResponse } from '@lib/sitemap/xml';

export async function GET() {
  const siteUrl = getSiteUrl();

  const xml = buildSitemapIndexXml([
    { loc: `${siteUrl}/sitemap-pages.xml` },
    { loc: `${siteUrl}/sitemap-categories.xml` },
    { loc: `${siteUrl}/sitemap-products.xml` },
    { loc: `${siteUrl}/sitemap-blog.xml` },
  ]);

  return xmlResponse(xml);
}

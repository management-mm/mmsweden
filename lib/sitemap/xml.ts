import type { SitemapIndexItem, SitemapUrlItem } from './types';
import { escapeXml } from './utils';

export function buildUrlSetXml(items: SitemapUrlItem[]) {
  const body = items
    .map(item => {
      const lastmod = item.lastmod
        ? `\n    <lastmod>${escapeXml(item.lastmod)}</lastmod>`
        : '';

      const alternates = item.alternates ? `\n    ${item.alternates}` : '';

      return `
  <url>
    <loc>${escapeXml(item.loc)}</loc>${lastmod}${alternates}
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>${body}
</urlset>`;
}

export function buildSitemapIndexXml(items: SitemapIndexItem[]) {
  const body = items
    .map(item => {
      const lastmod = item.lastmod
        ? `\n    <lastmod>${escapeXml(item.lastmod)}</lastmod>`
        : '';

      return `
  <sitemap>
    <loc>${escapeXml(item.loc)}</loc>${lastmod}
  </sitemap>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</sitemapindex>`;
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

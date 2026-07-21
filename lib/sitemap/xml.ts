import type { SitemapIndexItem, SitemapUrlItem } from './types';
import { escapeXml } from './utils';

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';

export function buildUrlSetXml(items: SitemapUrlItem[]): string {
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

  return `${XML_DECLARATION}
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>${body}
</urlset>`;
}

export function buildSitemapIndexXml(items: SitemapIndexItem[]): string {
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

  return `${XML_DECLARATION}
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</sitemapindex>`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control':
        'public, max-age=0, s-maxage=3600, stale-while-revalidate=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

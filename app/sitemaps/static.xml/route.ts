import { NextResponse } from 'next/server';

const BASE_URL = 'https://www.mmsweden.se';

function xmlEscape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET() {
  const now = new Date().toISOString();

  const urls = [
    `${BASE_URL}/`,
    `${BASE_URL}/about-us`,
    `${BASE_URL}/all-products`,
    `${BASE_URL}/sell-to-us`,
    `${BASE_URL}/contact-us`,
    `${BASE_URL}/about-us`,
    `${BASE_URL}/new-arrivals`,
    `${BASE_URL}/my-price-quote`,
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (loc) => `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${now}</lastmod>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
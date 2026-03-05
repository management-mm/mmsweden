import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.mmsweden.se';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const PAGE_SIZE = 5000;

async function getProductsCount(): Promise<number> {
  if (!API_URL) return 0;

  const res = await fetch(`${API_URL}/products/count`, {
    cache: 'no-store',
  });

  if (!res.ok) return 0;

  const data = await res.json();
  return Number(data.count ?? 0);
}

function xmlEscape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export async function GET(_req: NextRequest) {
  const count = await getProductsCount();
  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  const now = new Date().toISOString();

  const sitemaps = [
    `${BASE_URL}/sitemaps/static.xml`,
    ...Array.from(
      { length: pages },
      (_, i) => `${BASE_URL}/sitemaps/products/${i + 1}.xml`
    ),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps
  .map(
    loc => `  <sitemap>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`
  )
  .join('\n')}
</sitemapindex>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

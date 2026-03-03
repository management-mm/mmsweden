import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE_URL = 'https://www.mmsweden.se';
const API_URL = process.env.API_URL;

const PAGE_SIZE = 5000;

function xmlEscape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

async function getProductsPage(page: number) {
  if (!API_URL) return [];

  const res = await fetch(
    `${API_URL}/products?page=${page}&perPage=${PAGE_SIZE}&lang=en`,
    { cache: 'no-store' }
  );

  if (!res.ok) return [];

  const data = await res.json();

  if (Array.isArray(data)) return data;


  return [];
}

export async function GET(
  _request: NextRequest,

  const products = await getProductsPage(page);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${products
  .map((p: any) => {
    if (!p?.slug) return '';

    const loc = `${BASE_URL}/all-products/${p.slug}`;


    return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  })
  .filter(Boolean)
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
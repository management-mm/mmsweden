import slugify from 'slugify';
import { NextRequest } from 'next/server';

const BASE_URL = 'https://www.mmsweden.se';
const PAGE_SIZE = 5000;

function xmlEscape(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function getNameEn(name: any): string | null {
  if (!name) return null;
  if (typeof name === 'string') return name;
  return name.en ?? null;
}

async function getProductsPage(page: number) {
  const skip = (page - 1) * PAGE_SIZE;

  const res = await fetch(
    `${process.env.API_URL}/products?limit=${PAGE_SIZE}&skip=${skip}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];
  const data = await res.json();

  return Array.isArray(data) ? data : data.items ?? [];
}

export async function GET(
  _request: NextRequest,
<<<<<<< Updated upstream
  context: { params: Promise<{}> } // ✅ must be broad enough for Next
) {
  const params = (await context.params) as { page?: string }; // ✅ cast inside
=======
  context: { params: Promise<{}> } 
) {
  const params = (await context.params) as { page?: string };
>>>>>>> Stashed changes
  const page = Math.max(1, Number(params.page ?? '1'));

  const products = await getProductsPage(page);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${products
  .map((p: any) => {
    const rawName = getNameEn(p.name) ?? 'product';
    const slug = slugify(rawName, { lower: true, strict: true });

    const loc = `${BASE_URL}/all-products/${slug}-${p._id}`;
    const lastmod = new Date(p.updatedAt || p.createdAt || Date.now()).toISOString();

    return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
  })
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
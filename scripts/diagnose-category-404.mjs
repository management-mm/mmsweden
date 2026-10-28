#!/usr/bin/env node

/**
 * Example: node scripts/diagnose-category-404.mjs bakery-machinery dough-mixers
 * Reads .env.local / .env from the cwd, without adding dependencies.
 */
import { existsSync } from 'node:fs';

for (const file of ['.env.local', '.env']) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const [categorySlug = 'bakery-machinery', subcategorySlug = 'dough-mixers'] =
  process.argv.slice(2);
const baseUrl = (
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://mmsweden-server.onrender.com'
).replace(/\/$/, '');

console.log(`Backend URL: ${baseUrl}`);
console.log(`Category: ${categorySlug}`);
console.log(`Subcategory: ${subcategorySlug}\n`);

async function inspect(path) {
  const url = `${baseUrl}${path}`;
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    console.log(`${response.status} ${url}`);
    return { status: response.status, data };
  } catch (error) {
    console.error(`ERROR ${url}: ${error.message}`);
    return { status: -1, data: null };
  }
}

const category = await inspect(
  `/seo-categories/${encodeURIComponent(categorySlug)}`
);
const subcategory = await inspect(
  `/seo-categories/${encodeURIComponent(categorySlug)}/${encodeURIComponent(subcategorySlug)}`
);
const tree = await inspect('/seo-categories/tree?activeOnly=true');

if (Array.isArray(tree.data)) {
  const parent = tree.data.find(item => item?.slug === categorySlug);
  const child = parent?.subcategories?.find(
    item => item?.slug === subcategorySlug
  );
  console.log(`\nCategory in tree: ${Boolean(parent)}`);
  console.log(`Subcategory in tree: ${Boolean(child)}`);
  if (child && subcategory.status === 404) {
    console.log(
      'Diagnosis: the tree lists the subcategory but the SEO detail API returns 404. The fallback in this patch handles this inconsistency.'
    );
  }
} else {
  console.log('\nCategory tree not available from the configured backend.');
}

if (category.status === -1 || subcategory.status === -1) {
  console.log('Check API_URL and whether your local backend is running.');
}

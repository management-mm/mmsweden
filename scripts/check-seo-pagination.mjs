#!/usr/bin/env node
// Against a running Next.js server: node scripts/check-seo-pagination.mjs http://localhost:3000/en/all-products/bakery-machinery
const input = process.argv[2];
if (!input) {
  console.error(
    'Usage: node scripts/check-seo-pagination.mjs http://localhost:3000/en/all-products/<category>'
  );
  process.exit(2);
}
const url = new URL(input);
url.search = '';
for (const page of [1, 2]) {
  const target = new URL(url.href);
  if (page > 1) target.searchParams.set('page', String(page));
  const response = await fetch(target, { headers: { accept: 'text/html' } });
  const html = await response.text();
  const anchors = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)].map(match =>
    match[1].replaceAll('&amp;', '&')
  );
  const pageLinks = anchors.filter(href => /[?&]page=\d+/.test(href));
  const canonicalTag =
    html.match(/<link\b[^>]*\brel="canonical"[^>]*>/i)?.[0] ?? '';
  const canonical = canonicalTag.match(/\bhref="([^"]+)"/i)?.[1] ?? '<missing>';
  const noindex =
    /<meta\b[^>]*\bname="robots"[^>]*\bcontent="[^"]*noindex/i.test(html);
  console.log(`\n${target}: HTTP ${response.status}`);
  console.log('Canonical:', canonical);
  console.log('noindex:', noindex);
  console.log(
    'Links to other pages in server HTML:',
    [...new Set(pageLinks)].slice(0, 15)
  );
  if (
    !response.ok ||
    pageLinks.length === 0 ||
    noindex ||
    (page === 2 && !canonical.includes('page=2'))
  ) {
    process.exitCode = 1;
  }
}

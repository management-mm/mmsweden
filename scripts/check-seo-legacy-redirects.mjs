#!/usr/bin/env node
/**
 * Test the actual 301 response from a running Next.js server, without
 * automatically following it. Usage:
 * node scripts/check-seo-legacy-redirects.mjs http://localhost:3000
 * node scripts/check-seo-legacy-redirects.mjs https://www.mmsweden.se
 */
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');
const tests = [
  ['/', '/en'],
  ['/engelska.html', '/en'],
  ['/nyinkommit.html', '/sv/new-arrivals'],
  ['/begagnade-maskiner1.html', '/sv/all-products'],
  ['/bakery-machinery', '/sv/all-products/bakery-machinery'],
  ['/fish-processing-machinery', '/sv/all-products/fish-processing-machinery'],
  [
    '/all-products/meat-processing-machinery/meat-grinders',
    '/sv/all-products/meat-processing-machinery/meat-grinders',
  ],
  [
    '/all-products/bakery-machinery/dough-mixers?page=2',
    '/sv/all-products/bakery-machinery/dough-mixers?page=2',
  ],
];

let failures = 0;

for (const [source, destination] of tests) {
  try {
    const response = await fetch(`${base}${source}`, { redirect: 'manual' });
    const location = response.headers.get('location');
    const actual = location ? new URL(location, base) : null;
    const expected = new URL(destination, base);
    const ok =
      response.status === 301 &&
      actual?.pathname === expected.pathname &&
      actual?.search === expected.search;

    console.log(
      `${ok ? 'PASS' : 'FAIL'} ${source}: HTTP ${response.status} → ${location || '(no Location)'}`
    );
    if (!ok) failures++;
  } catch (error) {
    failures++;
    console.error(`FAIL ${source}: ${error.message}`);
  }
}

// Requesting current localized pages should not run through the old URL map.
// If these return a 404, the category API must be fixed separately.
for (const path of [
  '/sv/all-products/bakery-machinery',
  '/sv/all-products/meat-processing-machinery/meat-grinders',
  '/sv/new-arrivals',
]) {
  try {
    const response = await fetch(`${base}${path}`);
    const ok = response.status === 200;
    console.log(
      `${ok ? 'PASS' : 'FAIL'} destination ${path}: HTTP ${response.status}`
    );
    if (!ok) failures++;
  } catch (error) {
    failures++;
    console.error(`FAIL destination ${path}: ${error.message}`);
  }
}

try {
  const response = await fetch(`${base}/en/my-price-quote`);
  const html = await response.text();
  const robotsTags = [
    ...html.matchAll(/<meta\b[^>]*name=["']robots["'][^>]*>/gi),
  ].map(match => match[0]);
  const noindex = robotsTags.some(tag => /noindex/i.test(tag));
  const ok = response.status === 200 && noindex;
  console.log(
    `${ok ? 'PASS' : 'FAIL'} /en/my-price-quote: HTTP ${response.status}; robots noindex=${noindex}`
  );
  if (!ok) failures++;
} catch (error) {
  failures++;
  console.error(`FAIL /en/my-price-quote: ${error.message}`);
}

console.log(
  `\n${failures === 0 ? 'All checks passed.' : `${failures} check(s) failed.`}`
);
process.exitCode = failures ? 1 : 0;

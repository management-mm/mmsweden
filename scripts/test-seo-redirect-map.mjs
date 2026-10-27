#!/usr/bin/env node
// Run on Node 22 with: node --experimental-strip-types scripts/test-seo-redirect-map.mjs
// (No Next.js or installed npm dependencies needed.)
import assert from 'node:assert/strict';

import { getSeoRedirectTarget } from '../lib/seoLegacyRedirects.ts';

const testCases = [
  [
    'http://localhost:3000/engelska.html',
    'localhost:3000',
    'http://localhost:3000/en',
  ],
  [
    'http://localhost:3000/nyinkommit.html',
    'localhost:3000',
    'http://localhost:3000/sv/new-arrivals',
  ],
  [
    'https://www.mmsweden.se/engelska.html',
    'www.mmsweden.se',
    'https://www.mmsweden.se/en',
  ],
  [
    'https://www.mmsweden.se/nyinkommit.html',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/new-arrivals',
  ],
  [
    'https://www.mmsweden.se/begagnade-maskiner1.html',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/all-products',
  ],
  [
    'https://www.mmsweden.se/bakery-machinery',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/all-products/bakery-machinery',
  ],
  [
    'https://www.mmsweden.se/fish-processing-machinery',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/all-products/fish-processing-machinery',
  ],
  [
    'https://www.mmsweden.se/all-products/meat-processing-machinery/meat-grinders',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/all-products/meat-processing-machinery/meat-grinders',
  ],
  [
    'https://www.mmsweden.se/new-arrivals',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/new-arrivals',
  ],
  ['https://mmsweden.se/', 'mmsweden.se', 'https://www.mmsweden.se/en'],
  [
    'https://mmsweden.se/sv/all-products?page=2',
    'mmsweden.se',
    'https://www.mmsweden.se/sv/all-products?page=2',
  ],
  [
    'http://internal:3000/bakery-machinery',
    'www.mmsweden.se',
    'https://www.mmsweden.se/sv/all-products/bakery-machinery',
  ],
];

for (const [source, host, expected] of testCases) {
  assert.equal(
    getSeoRedirectTarget(new URL(source), host)?.href,
    expected,
    source
  );
}
assert.equal(
  getSeoRedirectTarget(
    new URL('http://localhost:3000/en/all-products'),
    'localhost:3000'
  ),
  null
);
assert.equal(
  getSeoRedirectTarget(
    new URL('https://www.mmsweden.se/unknown.html'),
    'www.mmsweden.se'
  ),
  null
);
console.log(`PASS: ${testCases.length + 2} SEO redirect mapping checks`);

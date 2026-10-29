import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

import { getSeoRedirectTarget } from '../lib/seoLegacyRedirects.ts';

const base = 'https://www.mmsweden.se';
const tests = [
  ['/index.html', '/sv'],
  ['/engelska.html', '/en'],
  ['/begagnade-maskiner1.html', '/sv/all-products'],
  ['/fr/index.html', '/fr'],
  ['/sv/index.html', '/sv'],
  [
    '/index.html/all-products/bakery-machinery/bakery-ovens',
    '/sv/all-products/bakery-machinery/bakery-ovens',
  ],
  [
    '/engelska.html/all-products/bakery-machinery/dough-mixers',
    '/en/all-products/bakery-machinery/dough-mixers',
  ],
  [
    '/begagnade-maskiner1.html/all-products/meat-processing-machinery/meat-grinders',
    '/sv/all-products/meat-processing-machinery/meat-grinders',
  ],
  [
    '/fr/index.html/all-products/bakery-machinery/dough-mixers',
    '/fr/all-products/bakery-machinery/dough-mixers',
  ],
  ['/pl/engelska.html/contact-us', '/pl/contact-us'],
  [
    '/index.html/all-products/meat-processing-machinery/meat-slicers/berkel',
    '/sv/all-products/meat-processing-machinery/meat-slicers/berkel-manual-slicer-with-built-in-sharpener',
  ],
  [
    '/engelska.html/all-products/meat-processing-machinery/meat-slicers/berkel',
    '/en/all-products/meat-processing-machinery/meat-slicers/berkel-manual-slicer-with-built-in-sharpener',
  ],
];
for (const [from, to] of tests) {
  const resolved = getSeoRedirectTarget(
    new URL(base + from + '?utm_source=seo'),
    'www.mmsweden.se'
  );
  assert.ok(resolved, `Missing redirect for ${from}`);
  assert.equal(resolved.pathname, to, from);
  assert.equal(resolved.searchParams.get('utm_source'), 'seo');
}
for (const path of [
  '/en/all-products/bakery-machinery',
  '/_next/static/css/old.css',
  '/engelska.html/unknown-page',
  '/arbitrary.html/all-products/anything',
])
  assert.equal(
    getSeoRedirectTarget(new URL(base + path), 'www.mmsweden.se'),
    null
  );

const proxy = readFileSync(new URL('../proxy.ts', import.meta.url), 'utf8');
for (const m of [
  '/index.html/:path*',
  '/engelska.html/:path*',
  '/begagnade-maskiner1.html/:path*',
  '/:locale/index.html/:path*',
  '/:locale/engelska.html/:path*',
  '/:locale/begagnade-maskiner1.html/:path*',
]) {
  assert.ok(proxy.includes(m), `Missing proxy matcher ${m}`);
}
let count = 0;
const sampleFile = new URL('gsc-404-samples.csv', import.meta.url);
if (existsSync(sampleFile)) {
  const sample = readFileSync(sampleFile, 'utf8')
    .trim()
    .split(/\r?\n/)
    .slice(1);
  for (const entry of sample) {
    const path = new URL(entry.split(',')[0]).pathname;
    if (
      !/(?:^|\/)(?:index|engelska|begagnade-maskiner1)\.html(?:\/|$)/i.test(
        path
      )
    )
      continue;
    const target = getSeoRedirectTarget(
      new URL(base + path),
      'www.mmsweden.se'
    );
    assert.ok(target, `GSC historical path missed: ${path}`);
    assert.ok(
      !target.pathname.includes('.html'),
      `HTML prefix retained ${path}`
    );
    count++;
  }
  assert.equal(count, 974);
}
console.log(
  `OK: ${tests.length} specific redirects, ${count} GSC samples, 4 negative cases, 6 proxy matchers.`
);

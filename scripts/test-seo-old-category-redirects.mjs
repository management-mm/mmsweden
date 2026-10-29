import assert from 'node:assert/strict';

import { getSeoRedirectTarget } from '../lib/seoLegacyRedirects.ts';

const host = 'https://www.mmsweden.se';
const sourceCategory = '/all-products/conveying-handling-equipment';
const destinationCategory = '/all-products/food-processing-equipment';
const pairs = [
  [
    '/bucket-elevators/edmo-lift-tcr-500',
    '/bucket-elevators/edmo-lift-tcr-500-lifting-table-500-kg-2011',
  ],
  [
    '/bucket-elevators/nimo-kg-lift',
    '/bucket-elevators/nimo-kg-lift-with-safety-cage-3-m-tipping-height',
  ],
  [
    '/food-grade-containers/wexiodisk-wd12-cd',
    '/food-grade-containers/wexiodisk-wd12-cd',
  ],
  [
    '/stainless-steel-work-tables/table-2',
    '/stainless-steel-work-tables/stainless-steel-work-table-with-shelf-100-x-60-x-87-cm',
  ],
  [
    '/bucket-elevators/nimo-kg-container-lift',
    '/bucket-elevators/nimo-kg-container-lift',
  ],
  ['/conveyor-belts/nn-conveyor-belt', '/conveyor-belts/nn-conveyor-belt'],
];
const locales = ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl'];
let count = 0;
function check(from, expected, origin = host) {
  const source = new URL(`${origin}${from}?utm_source=gsc&page=2`);
  const target = getSeoRedirectTarget(source, source.host);
  assert.ok(target, `No redirect: ${from}`);
  assert.equal(target.pathname, expected, from);
  assert.equal(target.search, '?utm_source=gsc&page=2');
  assert.equal(target.host, 'www.mmsweden.se');
  assert.equal(target.protocol, 'https:');
  // No further SEO redirection at the destination (single hop).
  assert.equal(
    getSeoRedirectTarget(target, target.host),
    null,
    `Redirect chain: ${target}`
  );
  count++;
}

// Eight languages, plus the historical unprefixed Swedish-facing URLs.
for (const [oldSuffix, finalSuffix] of pairs) {
  for (const locale of locales) {
    check(
      `/${locale}${sourceCategory}${oldSuffix}`,
      `/${locale}${destinationCategory}${finalSuffix}`
    );
    // `.html/` prefixes must resolve to the final target in a single hop.
    check(
      `/${locale}/index.html${sourceCategory}${oldSuffix}`,
      `/${locale}${destinationCategory}${finalSuffix}`
    );
  }
  check(
    `${sourceCategory}${oldSuffix}`,
    `/sv${destinationCategory}${finalSuffix}`
  );
  check(
    `/index.html${sourceCategory}${oldSuffix}`,
    `/sv${destinationCategory}${finalSuffix}`
  );
}

// Preserve the previously deployed 156 product-name redirects, old `.html`
// landing pages, root landing pages, and legitimate category addresses.
check(
  '/en/all-products/food-processing-equipment/bucket-elevators/edmo-lift-tcr-500',
  '/en/all-products/food-processing-equipment/bucket-elevators/edmo-lift-tcr-500-lifting-table-500-kg-2011'
);
check(
  '/en/all-products/food-processing-equipment/stainless-steel-work-tables/table-2',
  '/en/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-shelf-100-x-60-x-87-cm'
);
check(
  '/en/all-products/meat-processing-machinery/meat-slicers/berkel',
  '/en/all-products/meat-processing-machinery/meat-slicers/berkel-manual-slicer-with-built-in-sharpener'
);
check('/index.html', '/sv');
check('/bakery-machinery', '/sv/all-products/bakery-machinery');
check('/', '/en');

for (const unchanged of [
  '/en/all-products/conveying-handling-equipment',
  '/en/all-products/conveying-handling-equipment/bucket-elevators',
  '/en/all-products/conveying-handling-equipment/conveyor-belts/an-unrelated-machine',
  '/en/all-products/food-processing-equipment/food-grade-containers/wexiodisk-wd12-cd',
  '/en/all-products/food-processing-equipment/bucket-elevators/nimo-kg-container-lift',
  '/en/all-products/food-processing-equipment/conveyor-belts/nn-conveyor-belt',
  '/_next/static/chunks/something.js',
]) {
  assert.equal(
    getSeoRedirectTarget(new URL(host + unchanged), 'www.mmsweden.se'),
    null,
    `Unexpected redirect for ${unchanged}`
  );
}

// On localhost, the original local host is preserved; on the apex domain the
// redirect must canonicalize www and must not leak an internal port.
const local = getSeoRedirectTarget(
  new URL('http://localhost:3000/en' + sourceCategory + pairs[0][0]),
  'localhost:3000'
);
assert.equal(local.host, 'localhost:3000');
assert.equal(local.protocol, 'http:');
const apex = getSeoRedirectTarget(
  new URL('http://mmsweden.se:3000/en' + sourceCategory + pairs[0][0]),
  'mmsweden.se'
);
assert.equal(apex.origin, 'https://www.mmsweden.se');

console.log(
  `OK: ${count} redirect cases, 7 unrelated negative paths, local and apex host checks.`
);

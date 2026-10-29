#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { getSeoRedirectTarget } from '../lib/seoLegacyRedirects.ts';

const cases = JSON.parse(
  readFileSync(
    new URL('./seo-redirect-156-testcases.json', import.meta.url),
    'utf8'
  )
);
assert.equal(cases.length, 156);
const locales = ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl'];
let count = 0;
for (const [oldPath, newPath] of cases) {
  for (const locale of locales) {
    const old = new URL(
      `https://www.mmsweden.se/${locale}${oldPath}?utm_source=test&page=2`
    );
    const expected = `https://www.mmsweden.se/${locale}${newPath}?utm_source=test&page=2`;
    assert.equal(
      getSeoRedirectTarget(old, old.hostname)?.href,
      expected,
      `${locale}: ${oldPath}`
    );
    count++;
    const current = new URL(expected);
    assert.equal(getSeoRedirectTarget(current, current.hostname), null);
    count++;
  }
  const rootOld = new URL(`https://www.mmsweden.se${oldPath}`);
  assert.equal(
    getSeoRedirectTarget(rootOld, rootOld.hostname)?.pathname,
    `/sv${newPath}`
  );
  count++;
}
const [oldPath, newPath] = cases[0];
assert.equal(
  getSeoRedirectTarget(
    new URL(`https://mmsweden.se/en${oldPath}`),
    'mmsweden.se'
  )?.href,
  `https://www.mmsweden.se/en${newPath}`
);
count++;
assert.equal(
  getSeoRedirectTarget(
    new URL(`http://localhost:3000/en${oldPath}`),
    'localhost:3000'
  )?.href,
  `http://localhost:3000/en${newPath}`
);
count++;
assert.equal(
  getSeoRedirectTarget(
    new URL('https://www.mmsweden.se/en/all-products/unknown/unknown/unknown'),
    'www.mmsweden.se'
  ),
  null
);
count++;
console.log(`PASS: ${count} checks for 156 products, all 8 locales`);

#!/usr/bin/env node
// Read-only live HTTP check for the six confirmed historical category paths.
// Default: six English URLs. Pass --all-locales to check 8 * 6 URLs.
const args = process.argv.slice(2);
const base = (
  args.find(arg => /^https?:\/\//.test(arg)) || 'http://localhost:3000'
).replace(/\/$/, '');
const locales = args.includes('--all-locales')
  ? ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl']
  : ['en'];
const source = '/all-products/conveying-handling-equipment';
const dest = '/all-products/food-processing-equipment';
const cases = [
  [
    'bucket-elevators/edmo-lift-tcr-500',
    'bucket-elevators/edmo-lift-tcr-500-lifting-table-500-kg-2011',
  ],
  [
    'bucket-elevators/nimo-kg-lift',
    'bucket-elevators/nimo-kg-lift-with-safety-cage-3-m-tipping-height',
  ],
  [
    'food-grade-containers/wexiodisk-wd12-cd',
    'food-grade-containers/wexiodisk-wd12-cd',
  ],
  [
    'stainless-steel-work-tables/table-2',
    'stainless-steel-work-tables/stainless-steel-work-table-with-shelf-100-x-60-x-87-cm',
  ],
  [
    'bucket-elevators/nimo-kg-container-lift',
    'bucket-elevators/nimo-kg-container-lift',
  ],
  ['conveyor-belts/nn-conveyor-belt', 'conveyor-belts/nn-conveyor-belt'],
];
let ok = 0,
  failed = 0;
for (const locale of locales) {
  for (const [oldPart, newPart] of cases) {
    const oldUrl = `${base}/${locale}${source}/${oldPart}`;
    const targetUrl = `${base}/${locale}${dest}/${newPart}`;
    try {
      const response = await fetch(oldUrl, {
        redirect: 'manual',
        signal: AbortSignal.timeout(20000),
      });
      if (response.status !== 301) {
        throw new Error(`old URL HTTP ${response.status}, expected 301`);
      }
      const rawLocation = response.headers.get('location');
      if (!rawLocation) throw new Error('No Location header');
      const actualTarget = new URL(rawLocation, oldUrl).href;
      if (actualTarget !== targetUrl) {
        throw new Error(
          `Location mismatch: got ${actualTarget}; expected ${targetUrl}`
        );
      }
      const finalResponse = await fetch(targetUrl, {
        redirect: 'manual',
        signal: AbortSignal.timeout(20000),
      });
      if (finalResponse.status !== 200) {
        throw new Error(`target HTTP ${finalResponse.status}, expected 200`);
      }
      console.log(`OK ${locale}/${oldPart} — 301 → 200`);
      ok++;
    } catch (error) {
      console.error(`FAIL ${locale}/${oldPart}: ${error.message}`);
      failed++;
    }
  }
}
console.log(`\nChecked ${ok + failed}: OK ${ok}, FAIL ${failed}`);
if (failed) process.exitCode = 1;

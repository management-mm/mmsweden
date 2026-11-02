#!/usr/bin/env node
/**
 * Read-only safety audit for proposed category merges from the SEO spreadsheet.
 * Checks live inventory rather than treating matching keywords as proof of
 * equivalent equipment. Does not update MongoDB or redirect any URL.
 *
 * node scripts/audit-category-merge-proposals.mjs
 * node scripts/audit-category-merge-proposals.mjs --api http://localhost:5000
 */

const proposals = [
  {
    label: 'Dairy Slicers → Meat Slicers (proposed)',
    from: ['dairy-processing-equipment', 'slicers'],
    // The SEO sheet gives /meat-slicers but its full parent path must be verified.
    // Unknown target: deliberately do not guess a URL.
    to: null,
    note: 'Cheese cutter and meat slicer are NOT interchangeable; confirm machine types and destination URL.',
  },
  {
    label: 'Fruit/Vegetable Dicing → Meat Dicing',
    from: ['fruit-vegetable-processing-machinery', 'dicing-machines'],
    to: ['meat-processing-machinery', 'dicing-machines'],
    note: 'Check each machine for vegetable-only, meat-only or multi-purpose use before merging.',
  },
  {
    label: 'Thermal Heating Tunnels → Packaging Shrink Tunnels',
    from: ['thermal-processing-equipment', 'heating-tunnels'],
    to: ['packaging-machinery', 'shrink-tunnels'],
    note: 'Steam cooking/pasteurization and film-shrinking are different processes; do not merge by keyword.',
  },
];

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  if (!process.argv[idx + 1] || process.argv[idx + 1].startsWith('--')) {
    throw new Error(`Missing value after ${flag}`);
  }
  return process.argv[idx + 1];
}

const api = (
  getArg('--api') ??
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://mmsweden-server.onrender.com'
).replace(/\/+$/, '');
const timeoutMs = Number(getArg('--timeout') ?? '12000');
if (!Number.isInteger(timeoutMs) || timeoutMs <= 0)
  throw new Error('--timeout must be a positive integer');

async function getInventory(path) {
  if (!path) return null;
  const [categorySlug, subcategorySlug] = path;
  const qs = new URLSearchParams({
    categorySlug,
    subcategorySlug,
    page: '1',
    perPage: '9',
    lang: 'en',
  });
  const url = `${api}/products?${qs}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} from ${url}`);
  const body = await res.json();
  if (!body || !Array.isArray(body.products) || !Number.isFinite(body.total)) {
    throw new Error(`Unexpected API response from ${url}`);
  }
  return {
    total: body.total,
    examples: body.products.map(p => ({
      id: String(p.idNumber ?? ''),
      title:
        typeof p.name === 'object'
          ? (p.name.en ?? Object.values(p.name)[0])
          : String(p.name ?? ''),
      slug: String(p.slug ?? ''),
    })),
  };
}

function printGroup(label, path, data) {
  console.log(
    `  ${label}: ${path ? '/' + path.join('/') : '(target not confirmed)'}`
  );
  if (data === null)
    return console.log('    SKIPPED — target URL not confirmed');
  console.log(`    Live inventory: ${data.total} products`);
  for (const p of data.examples)
    console.log(`    - #${p.id || '?'} ${p.title} [${p.slug}]`);
}

let errors = 0;
console.log(`Read-only SEO category merge audit\nAPI: ${api}\n`);
for (const proposal of proposals) {
  console.log(`== ${proposal.label} ==`);
  try {
    const [src, dest] = await Promise.all([
      getInventory(proposal.from),
      getInventory(proposal.to),
    ]);
    printGroup('SOURCE', proposal.from, src);
    printGroup('TARGET', proposal.to, dest);
    console.log(`  NOTICE: ${proposal.note}`);
    console.log(
      '  DECISION: MANUAL REVIEW REQUIRED — no redirect or data change made.'
    );
  } catch (e) {
    errors += 1;
    console.error(`  ERROR: ${e instanceof Error ? e.message : String(e)}`);
  }
  console.log('');
}
console.log(
  errors
    ? `Completed with ${errors} API errors. No changes made.`
    : 'Completed. No changes made.'
);
if (errors) process.exitCode = 1;

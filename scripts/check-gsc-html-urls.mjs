// HTTP smoke test for historical .html URLs exported from Search Console.
// Usage: node scripts/check-gsc-html-urls.mjs http://localhost:3000 --limit 30
// Usage: node scripts/check-gsc-html-urls.mjs https://www.mmsweden.se --all
import { readFileSync, writeFileSync } from 'node:fs';

const base = process.argv[2];
if (!base || !/^https?:\/\//.test(base)) {
  console.error(
    'Usage: node scripts/check-gsc-html-urls.mjs http://localhost:3000 --limit 30   (or --all)'
  );
  process.exit(1);
}
const all = process.argv.includes('--all');
const limitArg = process.argv.indexOf('--limit');
const limit = all
  ? Number.POSITIVE_INFINITY
  : limitArg >= 0
    ? Number(process.argv[limitArg + 1])
    : 30;
if ((!Number.isInteger(limit) && limit !== Infinity) || limit <= 0)
  throw Error('Invalid limit');
const paths = readFileSync(
  new URL('gsc-404-samples.csv', import.meta.url),
  'utf8'
)
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(row => {
    try {
      return new URL(row.split(',')[0]);
    } catch {
      return null;
    }
  })
  .filter(
    u =>
      u &&
      /(?:^|\/)(?:index|engelska|begagnade-maskiner1)\.html(?:\/|$)/i.test(
        u.pathname
      )
  )
  .slice(0, limit);
const results = [];
function csv(v) {
  const s = String(v ?? '');
  return '"' + s.replaceAll('"', '""') + '"';
}
async function probe(url) {
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      signal: AbortSignal.timeout(15000),
    });
    return {
      status: response.status,
      location: response.headers.get('location'),
    };
  } catch (e) {
    return { status: 'ERROR', location: '', error: String(e.message ?? e) };
  }
}
let n = 0;
async function worker() {
  while (n < paths.length) {
    const index = n++;
    const historical = paths[index];
    const from = new URL(historical.pathname + historical.search, base);
    const first = await probe(from);
    let to = '',
      finalStatus = '',
      state = 'CHECK';
    if (first.status === 301 || first.status === 308) {
      if (!first.location) state = 'REDIRECT_NO_LOCATION';
      else {
        const dest = new URL(first.location, from);
        to = dest.href;
        const final = await probe(dest);
        finalStatus = final.status;
        state =
          final.status === 200
            ? 'OK'
            : final.status === 404
              ? 'REDIRECT_TO_404'
              : final.status >= 300 && final.status < 400
                ? 'REDIRECT_CHAIN'
                : 'TARGET_ERROR';
      }
    } else
      state =
        first.status === 404
          ? 'OLD_404'
          : first.status === 200
            ? 'OLD_STILL_200'
            : `STATUS_${first.status}`;
    results[index] = {
      from: from.href,
      firstStatus: first.status,
      to,
      finalStatus,
      state,
    };
  }
}
await Promise.all(
  Array.from({ length: Math.min(5, paths.length) }, () => worker())
);
const count = {};
for (const r of results) count[r.state] = (count[r.state] ?? 0) + 1;
const cols = ['from', 'firstStatus', 'to', 'finalStatus', 'state'];
const csvRows = [
  cols.join(','),
  ...results.map(r => cols.map(c => csv(r[c])).join(',')),
];
writeFileSync('seo-gsc-html-http-audit.csv', csvRows.join('\n') + '\n');
console.log(
  JSON.stringify(
    {
      checked: results.length,
      results: count,
      output: 'seo-gsc-html-http-audit.csv',
    },
    null,
    2
  )
);

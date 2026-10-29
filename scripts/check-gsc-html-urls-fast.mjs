/**
 * SEO redirect checker. Read-only: sends HTTP GET requests and writes CSV reports.
 * Two modes:
 *   redirects - fast check of old URLs, without fetching target product pages
 *   full      - checks both old URL and redirect destination (slower)
 * Usage:
 * node scripts/check-gsc-html-urls-fast.mjs http://localhost:3000 --all --mode redirects
 * node scripts/check-gsc-html-urls-fast.mjs http://localhost:3000 --limit 30 --mode full
 */
import { readFileSync, writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const base = args[0];
if (!base || !/^https?:\/\//.test(base)) {
  console.error(
    'Usage: node scripts/check-gsc-html-urls-fast.mjs http://localhost:3000 --all --mode redirects'
  );
  process.exit(1);
}
const option = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i < 0 ? fallback : args[i + 1];
};
const mode = option('--mode', 'redirects');
if (!['redirects', 'full'].includes(mode))
  throw Error('--mode must be redirects or full');
const isAll = args.includes('--all');
const limit = isAll ? Infinity : Number(option('--limit', 30));
if (!(Number.isInteger(limit) && limit > 0) && limit !== Infinity)
  throw Error('Invalid --limit');
const timeout = Number(option('--timeout', mode === 'full' ? 20000 : 8000));
const concurrency = Number(option('--concurrency', mode === 'full' ? 2 : 8));
if (!Number.isInteger(timeout) || timeout < 1000 || timeout > 60000)
  throw Error('--timeout 1000..60000');
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16)
  throw Error('--concurrency 1..16');
const output = option(
  '--output',
  mode === 'full' ? 'seo-gsc-targets-check.csv' : 'seo-gsc-redirects-check.csv'
);
if (!output?.endsWith('.csv')) throw Error('Output must have .csv extension');
const data = readFileSync(
  new URL('gsc-404-samples.csv', import.meta.url),
  'utf8'
)
  .trim()
  .split(/\r?\n/)
  .slice(1)
  .map(line => {
    try {
      return new URL(line.split(',')[0].replace(/^"|"$/g, ''));
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
  );
const seen = new Set();
const paths = data
  .filter(u => {
    const key = u.pathname + u.search;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .slice(0, limit);

const cols = [
  'from',
  'firstStatus',
  'to',
  'finalStatus',
  'state',
  'error',
  'elapsedMs',
];
const rows = Array(paths.length);
const csv = v => `"${String(v ?? '').replaceAll('"', '""')}"`;
const save = () =>
  writeFileSync(
    output,
    [
      cols.join(','),
      ...rows.filter(Boolean).map(r => cols.map(c => csv(r[c])).join(',')),
    ].join('\n') + '\n'
  );

async function probe(url) {
  const start = Date.now();
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(timeout),
      headers: { accept: 'text/html' },
    });
    // Do not download the full HTML body. HTTP status and Location are enough.
    if (response.body) await response.body.cancel().catch(() => {});
    return {
      status: response.status,
      location: response.headers.get('location'),
      ms: Date.now() - start,
    };
  } catch (e) {
    const message = String(e?.message ?? e);
    const code =
      e?.name === 'TimeoutError' || e?.name === 'AbortError'
        ? 'TIMEOUT'
        : 'ERROR';
    return {
      status: code,
      location: null,
      error: message,
      ms: Date.now() - start,
    };
  }
}

let next = 0,
  completed = 0,
  interrupted = false;
const started = Date.now();
process.on('SIGINT', () => {
  interrupted = true;
  save();
  console.log(
    `\nStopped: ${completed}/${paths.length} checked. Saved partial results in ${output}`
  );
  process.exit(130);
});
const timer = setInterval(() => {
  console.log(
    `Progress: ${completed}/${paths.length}, elapsed ${Math.round((Date.now() - started) / 1000)}s`
  );
  save();
}, 10000);

async function worker() {
  while (next < paths.length && !interrupted) {
    const index = next++;
    const historical = paths[index];
    const from = new URL(historical.pathname + historical.search, base);
    const first = await probe(from);
    let to = '',
      finalStatus = '',
      error = first.error || '';
    let state;
    let elapsedMs = first.ms;
    if (first.status === 301 || first.status === 308) {
      if (!first.location) state = 'REDIRECT_NO_LOCATION';
      else {
        const dest = new URL(first.location, from);
        to = dest.href;
        if (dest.href === from.href) state = 'SELF_REDIRECT';
        else if (mode === 'redirects') state = 'PERMANENT_REDIRECT';
        else {
          const final = await probe(dest);
          finalStatus = final.status;
          elapsedMs += final.ms;
          error = final.error || '';
          state =
            final.status === 200
              ? 'OK'
              : final.status === 404
                ? 'REDIRECT_TO_404'
                : final.status === 'TIMEOUT'
                  ? 'TARGET_TIMEOUT'
                  : typeof final.status === 'number' &&
                      final.status >= 300 &&
                      final.status < 400
                    ? 'REDIRECT_CHAIN'
                    : 'TARGET_ERROR';
        }
      }
    } else if ([302, 303, 307].includes(first.status))
      state = 'TEMPORARY_REDIRECT';
    else if (first.status === 404) state = 'OLD_404';
    else if (first.status === 200) state = 'OLD_STILL_200';
    else if (first.status === 'TIMEOUT') state = 'OLD_TIMEOUT';
    else state = 'STATUS_' + first.status;
    rows[index] = {
      from: from.href,
      firstStatus: first.status,
      to,
      finalStatus,
      state,
      error,
      elapsedMs,
    };
    completed++;
    if (completed % 25 === 0 || completed === paths.length) {
      save();
      console.log(`Progress: ${completed}/${paths.length}`);
    }
  }
}
console.log(
  `Checking ${paths.length} unique old URLs, mode=${mode}, concurrency=${concurrency}, timeout=${timeout}ms`
);
try {
  await Promise.all(
    Array.from({ length: Math.min(concurrency, paths.length) }, () => worker())
  );
} finally {
  clearInterval(timer);
  save();
}
const counts = {};
for (const r of rows.filter(Boolean))
  counts[r.state] = (counts[r.state] || 0) + 1;
console.log(
  JSON.stringify({ checked: completed, mode, results: counts, output }, null, 2)
);

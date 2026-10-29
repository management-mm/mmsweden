#!/usr/bin/env node
// Read-only audit of a small sample of GSC duplicate URLs on the public site.
// Usage: node scripts/check-live-gsc-duplicates.mjs --limit 20
//        node scripts/check-live-gsc-duplicates.mjs --all
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const entries = JSON.parse(
  fs.readFileSync(path.join(here, 'gsc-live-duplicate-sample.json'), 'utf8')
).urls;
const args = process.argv.slice(2);
const flag = name => args.includes(name);
const arg = (name, defaultValue) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : defaultValue;
};
const isAll = flag('--all');
const limit = Math.max(
  1,
  Math.min(
    entries.length,
    Number(arg('--limit', isAll ? entries.length : 12)) || 20
  )
);
const timeoutMs = Math.max(
  3000,
  Math.min(60000, Number(arg('--timeout', 15000)) || 15000)
);
const delayMs = Math.max(0, Math.min(5000, Number(arg('--delay', 350)) || 350));
const csvName = arg('--output', 'seo-gsc-live-duplicates.csv');
const rows = [];
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const quote = v =>
  '"' +
  String(v ?? '')
    .replace(/"/g, '""')
    .replace(/\r?\n/g, ' ') +
  '"';
function attr(tag, key) {
  const regex = new RegExp(
    '\\b' + key + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))',
    'i'
  );
  const match = tag.match(regex);
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : '';
}
function canonicalFromHtml(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = match[0];
    const rel = attr(tag, 'rel').toLowerCase().split(/\s+/);
    if (rel.includes('canonical')) return attr(tag, 'href');
  }
  return '';
}
function robotsFromHtml(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const tag = match[0];
    if (['robots', 'googlebot'].includes(attr(tag, 'name').toLowerCase()))
      return attr(tag, 'content');
  }
  return '';
}
async function probe(url) {
  const response = await fetch(url, {
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      'user-agent': 'MM-Sweden-SEO-QA/1.0 (+manual site owner audit)',
      accept: 'text/html,application/xhtml+xml',
    },
  });
  return response;
}
async function inspect(entry) {
  const original = entry.url;
  let url = original,
    initialStatus = null,
    finalStatus = null,
    finalUrl = '',
    targetCanonical = '',
    robots = '',
    hops = 0,
    error = '',
    history = [];
  try {
    for (let i = 0; i < 6; i++) {
      const r = await probe(url);
      if (initialStatus === null) initialStatus = r.status;
      history.push(r.status);
      finalStatus = r.status;
      finalUrl = url;
      if ([301, 302, 303, 307, 308].includes(r.status)) {
        const location = r.headers.get('location');
        if (!location) {
          error = 'Redirect without Location';
          break;
        }
        const next = new URL(location, url).href;
        if (
          !next.startsWith('https://www.mmsweden.se/') &&
          !next.startsWith('http://www.mmsweden.se/')
        ) {
          error = 'Redirect goes to a different host';
          finalUrl = next;
          break;
        }
        url = next;
        hops++;
        continue;
      }
      if (r.status === 200) {
        const html = await r.text();
        const raw = canonicalFromHtml(html);
        targetCanonical = raw ? new URL(raw, url).href : '';
        robots = robotsFromHtml(html);
      }
      break;
    }
    if (hops >= 6 && [301, 302, 303, 307, 308].includes(finalStatus))
      error = 'Too many redirects';
  } catch (e) {
    error =
      e?.name === 'TimeoutError' || e?.name === 'AbortError'
        ? 'Request timed out'
        : String(e?.message || e).slice(0, 160);
  }
  let result = 'REVIEW';
  const norm = u => {
    try {
      const x = new URL(u);
      return (x.origin + x.pathname + (x.search || '')).replace(/\/$/, '');
    } catch {
      return u;
    }
  };
  if (error) result = 'NETWORK_OR_REDIRECT_ERROR';
  else if ([404, 410].includes(finalStatus))
    result = hops ? 'REDIRECT_TO_404' : 'NOT_FOUND';
  else if (finalStatus >= 500) result = 'SERVER_ERROR';
  else if (history.slice(0, -1).some(s => s === 302 || s === 307))
    result = 'TEMPORARY_REDIRECT';
  else if (hops > 1) result = 'REVIEW_REDIRECT_CHAIN';
  else if (
    hops === 1 &&
    [301, 308].includes(initialStatus) &&
    finalStatus === 200
  )
    result =
      targetCanonical && norm(targetCanonical) !== norm(finalUrl)
        ? 'REVIEW_TARGET_CANONICAL'
        : 'OK_PERMANENT_REDIRECT';
  else if (finalStatus === 200) {
    if (/noindex/i.test(robots)) result = 'REVIEW_NOINDEX';
    else if (targetCanonical && norm(targetCanonical) !== norm(finalUrl))
      result = 'CANONICAL_POINTS_ELSEWHERE';
    else if (targetCanonical) result = 'REVIEW_200_SELF_CANONICAL';
    else result = 'REVIEW_NO_CANONICAL';
  }
  return {
    ...entry,
    initialStatus,
    finalStatus,
    finalUrl,
    targetCanonical,
    robots,
    hops,
    history: history.join(' > '),
    result,
    error,
  };
}
const sample = entries.slice(0, limit);
console.log(
  `Checking ${sample.length} historical GSC URLs against live www.mmsweden.se. Read-only; ${timeoutMs}ms timeout per request.`
);
for (let i = 0; i < sample.length; i++) {
  const item = await inspect(sample[i]);
  rows.push(item);
  console.log(
    `[${i + 1}/${sample.length}] ${item.result}: ${item.initialStatus ?? '?'} -> ${item.finalStatus ?? '?'}  ${new URL(item.url).pathname.slice(0, 90)}`
  );
  if (i < sample.length - 1) await wait(delayMs);
}
const columns = [
  'group',
  'url',
  'lastCrawled',
  'initialStatus',
  'hops',
  'finalStatus',
  'finalUrl',
  'targetCanonical',
  'robots',
  'history',
  'result',
  'error',
  'note',
];
fs.writeFileSync(
  csvName,
  '\ufeff' +
    columns.join(',') +
    '\n' +
    rows.map(r => columns.map(k => quote(r[k])).join(',')).join('\n') +
    '\n',
  'utf8'
);
const summary = Object.fromEntries(
  [...new Set(rows.map(r => r.result))].map(status => [
    status,
    rows.filter(r => r.result === status).length,
  ])
);
console.log('Results:', JSON.stringify(summary, null, 2));
console.log('Report:', path.resolve(csvName));

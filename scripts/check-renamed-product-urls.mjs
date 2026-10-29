#!/usr/bin/env node

/**
 * Check renamed MM Sweden product slugs against CURRENT product URLs in sitemap-products.xml.
 * Requires Node.js 18+; no external packages. Read-only; does not change your site/database.
 * Usage:
 *    node scripts/check-renamed-product-urls.mjs http://localhost:3000
 *    node scripts/check-renamed-product-urls.mjs https://www.mmsweden.se --locale en,sv
 *
 * Caution: the hypothetical old URL uses the product's CURRENT category/subcategory
 * path and its old product slug. If a product also changed category, its real
 * historical URL may have been different and must be checked separately in GSC.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(
    `Usage: node scripts/check-renamed-product-urls.mjs [base-url] [--locale en,sv] [--out output.csv] [--limit 10] [--concurrency 4]\nDefault: base-url=http://localhost:3000; locale=en; limit=all (156).\nThe script READS the site/sitemap; it does not modify the database or site.`
  );
  process.exit(0);
}
function opt(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : fallback;
}
const baseInput =
  args.find(
    x =>
      !x.startsWith('--') &&
      !['--locale', '--out', '--limit', '--concurrency'].some(flag => {
        const at = args.indexOf(flag);
        return at >= 0 && args[at + 1] === x;
      })
  ) || 'http://localhost:3000';
const base = new URL(baseInput);
if (!['http:', 'https:'].includes(base.protocol))
  throw Error('Only http/https URLs are allowed');
if (base.pathname !== '/' || base.search || base.hash)
  throw Error('Use the site origin only (e.g. http://localhost:3000)');
const locales = opt('--locale', 'en')
  .split(',')
  .map(x => x.trim())
  .filter(Boolean);
const allowedLocales = new Set([
  'en',
  'sv',
  'de',
  'fr',
  'es',
  'ru',
  'uk',
  'pl',
]);
if (!locales.length || locales.some(x => !allowedLocales.has(x)))
  throw Error('Unsupported locale. Allowed: en,sv,de,fr,es,ru,uk,pl');
const limit = Number(opt('--limit', '0'));
const concurrency = Number(opt('--concurrency', '4'));
if (!Number.isInteger(limit) || limit < 0)
  throw Error('--limit must be 0 (all) or positive integer');
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 10)
  throw Error('--concurrency must be 1..10');
const output = path.resolve(opt('--out', 'seo-renamed-url-audit.csv'));
const reportJson = output.replace(/\.csv$/i, '') + '-summary.json';
const mapping = JSON.parse(
  await readFile(path.join(dirname, 'seo-old-new-slugs.json'), 'utf8')
);
const items = mapping.redirectCandidates.slice(0, limit || undefined);
console.log(
  `Checking ${items.length} changed products in ${locales.join(',')} on ${base.origin}`
);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function load(url, { maxMs = 16000, redirect = 'follow' } = {}) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await fetch(url, {
        method: 'GET',
        redirect,
        headers: {
          'user-agent': 'MM-Sweden-SEO-URL-Audit/1.0',
          accept: 'text/html,application/xml;q=0.9,*/*;q=0.5',
        },
        signal: AbortSignal.timeout(maxMs),
      });
    } catch (err) {
      if (attempt === 1) throw err;
      await sleep(300);
    }
  }
}
function decodeXml(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
function locs(xml, tag) {
  const blocks =
    xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, 'gi')) ??
    [];
  const found = [];
  for (const block of blocks) {
    const match = block.match(/<loc>\s*([^<]+)\s*<\/loc>/i);
    if (match) found.push(decodeXml(match[1].trim()));
  }
  return found;
}
async function readSitemap(relative = '/sitemap-products.xml', depth = 0) {
  if (depth > 3) throw Error('Sitemap nesting too deep');
  // Rewrite sitemap location to requested origin so localhost tests don't silently hit production.
  const uri = new URL(relative, base.origin);
  const requestedUrl = new URL(uri.pathname + uri.search, base.origin).href;
  const response = await load(requestedUrl);
  if (!response.ok)
    throw Error(`${requestedUrl} returned HTTP ${response.status}`);
  const xml = await response.text();
  if (/<sitemapindex\b/i.test(xml)) {
    const childUrls = locs(xml, 'sitemap');
    if (!childUrls.length)
      throw Error(`Empty sitemap index at ${requestedUrl}`);
    const child = [];
    for (const url of childUrls)
      child.push(...(await readSitemap(url, depth + 1)));
    return child;
  }
  if (!/<urlset\b/i.test(xml))
    throw Error(`${requestedUrl} does not contain a sitemap urlset`);
  return locs(xml, 'url');
}
let allSiteUrls;
try {
  allSiteUrls = await readSitemap();
} catch (error) {
  console.error(`Cannot read product sitemap: ${error.message}`);
  console.error(
    'Start the site with "npm run dev" and ensure /sitemap-products.xml opens. If API_URL is missing, restore .env.local.'
  );
  process.exitCode = 1;
  process.exit();
}
console.log(`Product URLs in sitemap: ${allSiteUrls.length}`);

// Index current site paths per locale+product slug (exact last path component).
const urlsByLocaleSlug = new Map();
for (const raw of allSiteUrls) {
  let u;
  try {
    u = new URL(raw);
  } catch {
    continue;
  }
  const segments = u.pathname
    .split('/')
    .filter(Boolean)
    .map(s => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    });
  if (segments.length !== 5 || segments[1] !== 'all-products') continue;
  const locale = segments[0],
    slug = segments[4];
  const key = `${locale}\0${slug}`;
  if (!urlsByLocaleSlug.has(key)) urlsByLocaleSlug.set(key, []);
  urlsByLocaleSlug.get(key).push(u.pathname);
}
function localUrl(pathname) {
  return new URL(pathname, base.origin).href;
}
function normalizeUrlPath(url) {
  try {
    return new URL(url).pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
}
function sameRedirectDestination(actual, expected) {
  try {
    const a = new URL(actual),
      e = new URL(expected);
    return (
      a.origin === e.origin &&
      normalizeUrlPath(actual) === normalizeUrlPath(expected) &&
      a.search === e.search
    );
  } catch {
    return false;
  }
}
async function checkRedirect(url) {
  const statuses = [],
    locations = [];
  let current = url;
  try {
    for (let step = 0; step < 6; step++) {
      const r = await load(current, { redirect: 'manual' });
      statuses.push(r.status);
      const location = r.headers.get('location');
      if ([301, 302, 303, 307, 308].includes(r.status) && location) {
        const nextUrl = new URL(location, current).href;
        locations.push(nextUrl);
        await r.body?.cancel();
        current = nextUrl;
        if (step === 5)
          return {
            statuses,
            locations,
            finalStatus: 0,
            finalUrl: current,
            error: 'Redirect loop / too many redirects',
          };
        continue;
      }
      await r.body?.cancel();
      return {
        statuses,
        locations,
        finalStatus: r.status,
        finalUrl: current,
        error: '',
      };
    }
  } catch (err) {
    return {
      statuses,
      locations,
      finalStatus: 0,
      finalUrl: current,
      error: String(err.message ?? err),
    };
  }
}
async function checkNewPage(url) {
  try {
    const r = await load(url, { redirect: 'follow' });
    const status = r.status;
    const html =
      (r.headers.get('content-type') ?? '').includes('text/html') &&
      status === 200
        ? await r.text()
        : '';
    const canonicalTag = (html.match(
      /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i
    ) ?? [''])[0];
    const canonical = (canonicalTag.match(/\bhref=["']([^"']+)["']/i) ?? [
      '',
      '',
    ])[1];
    return {
      status,
      finalUrl: r.url,
      canonical: canonical ? new URL(canonical, r.url).href : '',
      noindex:
        /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(
          html
        ),
      error: '',
    };
  } catch (err) {
    return {
      status: 0,
      finalUrl: '',
      canonical: '',
      noindex: false,
      error: String(err.message ?? err),
    };
  }
}
const rows = [];
const jobs = [];
for (const item of items)
  for (const locale of locales) jobs.push({ item, locale });
let nextIndex = 0,
  completed = 0;
async function worker() {
  while (nextIndex < jobs.length) {
    const { item, locale } = jobs[nextIndex++];
    const matches = urlsByLocaleSlug.get(`${locale}\0${item.newSlug}`) || [];
    const row = {
      mongoId: item.mongoId,
      idNumber: item.idNumber,
      locale,
      oldSlug: item.oldSlug,
      newSlug: item.newSlug,
      proposedOldUrl: '',
      currentNewUrl: '',
      oldHttp: '',
      redirectChain: '',
      oldFinalHttp: '',
      oldFinalUrl: '',
      newHttp: '',
      newCanonical: '',
      status: '',
      notes: '',
    };
    if (!matches.length) {
      row.status = 'REVIEW_NOT_IN_SITEMAP';
      row.notes =
        'No current product URL in sitemap. May be unpublished/sold, or sitemap is stale.';
    } else if (matches.length > 1) {
      row.status = 'REVIEW_AMBIGUOUS_SLUG';
      row.notes =
        'Several current product URLs have the same slug; compare MongoDB IDs.';
    } else {
      const currentPath = matches[0];
      const segments = currentPath.split('/');
      segments[segments.length - 1] = encodeURIComponent(item.oldSlug);
      const oldUrl = localUrl(segments.join('/'));
      const newUrl = localUrl(currentPath);
      row.proposedOldUrl = oldUrl;
      row.currentNewUrl = newUrl;
      const [old, newPage] = await Promise.all([
        checkRedirect(oldUrl),
        checkNewPage(newUrl),
      ]);
      row.oldHttp = old.statuses[0] ?? 0;
      row.redirectChain = old.statuses.join(' -> ');
      row.oldFinalHttp = old.finalStatus;
      row.oldFinalUrl = old.finalUrl;
      row.newHttp = newPage.status;
      row.newCanonical = newPage.canonical;
      if (old.error || newPage.error) {
        row.status = 'ERROR_NETWORK';
        row.notes = [old.error, newPage.error].filter(Boolean).join('; ');
      } else if (newPage.status !== 200) {
        row.status = 'BROKEN_NEW_URL';
        row.notes = `New URL HTTP ${newPage.status}`;
      } else if (![301, 308].includes(old.statuses[0])) {
        if ([302, 307].includes(old.statuses[0])) {
          row.status = 'BAD_TEMPORARY_REDIRECT';
          row.notes = 'Old URL must redirect permanently (301 or 308).';
        } else if (old.statuses[0] === 404 || old.statuses[0] === 410) {
          row.status = 'BROKEN_OLD_404';
          row.notes = 'Old URL is lost; add permanent redirect to current URL.';
        } else {
          row.status = 'BAD_OLD_URL_STATUS';
          row.notes = `Old URL HTTP ${old.statuses[0]}; expected 301 or 308.`;
        }
      } else if (
        old.finalStatus !== 200 ||
        !sameRedirectDestination(old.finalUrl, newUrl)
      ) {
        row.status = 'WRONG_REDIRECT_TARGET';
        row.notes = `Expected redirect to ${newUrl}, got ${old.finalUrl}`;
      } else if (newPage.noindex) {
        row.status = 'WARN_NOINDEX';
        row.notes = 'New product page has noindex.';
      } else if (
        newPage.canonical &&
        normalizeUrlPath(newPage.canonical) !== normalizeUrlPath(newUrl)
      ) {
        row.status = 'WARN_CANONICAL';
        row.notes = `New page canonical points elsewhere: ${newPage.canonical}`;
      } else if (!newPage.canonical) {
        row.status = 'WARN_CANONICAL_MISSING';
        row.notes = 'Current product page has no canonical link.';
      } else {
        row.status = 'OK';
        row.notes =
          'Permanent redirect reaches the current product URL, which returns 200.';
      }
    }
    rows.push(row);
    completed++;
    if (completed % 25 === 0 || completed === jobs.length)
      console.log(`Checked ${completed}/${jobs.length}`);
  }
}
await Promise.all(
  Array.from({ length: Math.min(concurrency, jobs.length) }, () => worker())
);
rows.sort(
  (a, b) =>
    String(a.idNumber).localeCompare(String(b.idNumber), 'en', {
      numeric: true,
    }) || a.locale.localeCompare(b.locale)
);
function csvCell(value) {
  return '"' + String(value ?? '').replace(/"/g, '""') + '"';
}
const headers = [
  'idNumber',
  'mongoId',
  'locale',
  'oldSlug',
  'newSlug',
  'proposedOldUrl',
  'currentNewUrl',
  'oldHttp',
  'redirectChain',
  'oldFinalHttp',
  'oldFinalUrl',
  'newHttp',
  'newCanonical',
  'status',
  'notes',
];
const csv =
  '\ufeff' +
  [
    headers.join(','),
    ...rows.map(r => headers.map(k => csvCell(r[k])).join(',')),
  ].join('\r\n') +
  '\r\n';
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, csv, 'utf8');
const counts = {};
for (const r of rows) counts[r.status] = (counts[r.status] || 0) + 1;
const summary = {
  checkedAt: new Date().toISOString(),
  base: base.origin,
  locales,
  inputProducts: items.length,
  checkedRows: rows.length,
  sitemapUrls: allSiteUrls.length,
  counts,
  limitations: [
    'Old URLs are proposed by replacing the product slug in the current category/subcategory path; the historical category path might differ.',
    'Products absent from the current sitemap are not automatically errors. Check sold, draft and retired products.',
    'Do a separate production-site check after deployment; localhost checks do not prove what Google sees.',
  ],
};
await writeFile(reportJson, JSON.stringify(summary, null, 2) + '\n');
console.log(`\nResults saved: ${output}\nSummary saved: ${reportJson}`);
console.log('STATUS COUNTS:');
for (const [key, val] of Object.entries(counts).sort((a, b) => b[1] - a[1]))
  console.log(`${key}: ${val}`);
if (counts.ERROR_NETWORK || counts.BROKEN_NEW_URL) process.exitCode = 2;

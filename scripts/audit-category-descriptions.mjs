#!/usr/bin/env node
// Read-only SEO category content audit: never writes to the website or MongoDB.
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

const LOCALES = ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl'];
const argv = process.argv.slice(2);
const valueOf = flag => {
  const p = argv.indexOf(flag);
  return p < 0 ? undefined : argv[p + 1];
};
const has = flag => argv.includes(flag);
if (has('--help')) {
  console.log(
    `Usage:\n  node scripts/audit-category-descriptions.mjs --api https://your-backend --output seo-categories-audit.csv\n  node scripts/audit-category-descriptions.mjs --file seo-categories.json --output seo-categories-audit.csv\n  Add --all to include subcategories. By default checks only top-level categories.`
  );
  process.exit(0);
}
for (const fn of ['.env.local', '.env']) {
  if (existsSync(fn) && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(fn);
    } catch {
      /* environment is optional */
    }
  }
}
const output = valueOf('--output') || 'seo-categories-audit.csv';
const sourceFile = valueOf('--file');
const base = (
  valueOf('--api') ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://mmsweden-server.onrender.com'
).replace(/\/+$/, '');
const includeChildren = has('--all');
const plain = v =>
  String(typeof v === 'string' ? v : '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
const normalized = v =>
  plain(v).toLocaleLowerCase('en-US').replace(/\s+/g, ' ');
const field = (x, k, loc) => x?.[k]?.[loc] ?? '';
const text = (x, k, loc) =>
  k === 'intro' ? x?.content?.intro?.[loc] : x?.seo?.[k]?.[loc];
const csv = x => '"' + String(x ?? '').replace(/"/g, '""') + '"';
const appendCsv = (rows, keys) =>
  '\uFEFF' +
  [
    keys.join(','),
    ...rows.map(row => keys.map(k => csv(row[k])).join(',')),
  ].join('\n') +
  '\n';

async function getJson(url) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(25000),
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404 || res.status === 410) return null;
      if (!res.ok) throw Error(`HTTP ${res.status}`);
      return res.json();
    } catch (err) {
      last = err;
    }
  }
  throw Error(`${url} - ${last?.message ?? 'network error'}`);
}

function flatten(input) {
  const array = Array.isArray(input)
    ? input
    : (input?.categories ?? input?.data ?? input?.tree);
  if (!Array.isArray(array))
    throw Error('Expected an array of SEO categories, or {categories:[...]}.');
  const parents = array.filter(
    x =>
      x &&
      typeof x.slug === 'string' &&
      (!x.parentId || x.level === 1 || Array.isArray(x.subcategories))
  );
  // A flat export can include root documents with null parentId and child documents with parentId.
  const roots = parents.length
    ? parents
    : array.filter(x => x && typeof x.slug === 'string' && x.parentId == null);
  const output = [];
  for (const parent of roots) {
    output.push({ entry: parent, parent: null });
    if (!includeChildren) continue;
    const nested = Array.isArray(parent.subcategories)
      ? parent.subcategories
      : array.filter(
          x =>
            x.parentId &&
            String(x.parentId?.$oid ?? x.parentId) ===
              String(parent._id?.$oid ?? parent._id)
        );
    for (const child of nested)
      if (child?.slug) output.push({ entry: child, parent });
  }
  return output;
}

let nodes;
try {
  if (sourceFile) {
    nodes = flatten(JSON.parse(await readFile(sourceFile, 'utf8')));
  } else {
    console.log(
      `Loading category tree: ${base}/seo-categories/tree?activeOnly=true`
    );
    nodes = flatten(
      await getJson(`${base}/seo-categories/tree?activeOnly=true`)
    );
  }
  if (!nodes.length)
    throw Error('No root SEO categories found in the supplied data.');

  const records = [];
  for (let i = 0; i < nodes.length; i++) {
    const { entry, parent } = nodes[i];
    let doc = entry;
    let source = sourceFile ? 'FILE' : 'DETAIL_API';
    let warning = '';
    if (!sourceFile) {
      const suffix = parent
        ? `${encodeURIComponent(parent.slug)}/${encodeURIComponent(entry.slug)}`
        : encodeURIComponent(entry.slug);
      try {
        const response = await getJson(`${base}/seo-categories/${suffix}`);
        if (
          response &&
          typeof response === 'object' &&
          !Array.isArray(response)
        )
          doc = response;
        else {
          source = 'TREE_FALLBACK';
          warning =
            'Detail endpoint returned 404/410; tree may omit SEO fields';
        }
      } catch (err) {
        source = 'TREE_FALLBACK';
        warning = err.message.slice(0, 160);
      }
    }
    const slug = entry.slug;
    const urlPart = parent ? `${parent.slug}/${slug}` : slug;
    const name = plain(doc?.name?.en ?? entry?.name?.en ?? slug);
    for (const locale of LOCALES) {
      const seoTitle = plain(text(doc, 'title', locale));
      const meta = plain(text(doc, 'description', locale));
      const h1 = plain(text(doc, 'h1', locale));
      const intro = plain(text(doc, 'intro', locale));
      const flags = [];
      if (!seoTitle) flags.push('SEO_TITLE_MISSING');
      if (!meta) flags.push('META_DESCRIPTION_MISSING');
      if (!h1) flags.push('H1_MISSING');
      if (!intro) flags.push('INTRO_MISSING');
      if (intro && intro.length < (parent ? 110 : 230))
        flags.push('INTRO_SHORT_REVIEW');
      if (meta && meta.length < 70) flags.push('META_SHORT_REVIEW');
      if (locale !== 'en') {
        const enIntro = plain(text(doc, 'intro', 'en'));
        const enMeta = plain(text(doc, 'description', 'en'));
        if (intro.length >= 45 && normalized(intro) === normalized(enIntro))
          flags.push('INTRO_SAME_AS_EN_REVIEW');
        if (meta.length >= 45 && normalized(meta) === normalized(enMeta))
          flags.push('META_SAME_AS_EN_REVIEW');
      }
      records.push({
        category: name,
        category_slug: slug,
        parent_slug: parent?.slug ?? '',
        level: parent ? 'subcategory' : 'category',
        locale,
        seo_title: seoTitle,
        meta_description: meta,
        h1,
        intro_chars: intro.length,
        intro_words: intro ? intro.split(/\s+/).length : 0,
        intro_preview: intro.slice(0, 230),
        flags,
        source,
        warning,
        url: `https://www.mmsweden.se/${locale}/all-products/${urlPart}`,
      });
    }
    console.log(`[${i + 1}/${nodes.length}] ${urlPart} (${source})`);
  }
  // Detect identical full intro texts across different categories within a language.
  const seen = new Map();
  for (const row of records) {
    if (row.intro_chars < 100) continue;
    const key = row.locale + '|' + normalized(row.intro_preview); // review hint; preview comparison only
    const existing = seen.get(key);
    if (existing && existing.category_slug !== row.category_slug) {
      existing.flags.push('INTRO_DUPLICATE_REVIEW');
      row.flags.push('INTRO_DUPLICATE_REVIEW');
    } else seen.set(key, row);
  }
  const rows = records.map(row => ({
    ...row,
    flags: [...new Set(row.flags)].join(';'),
  }));
  const keys = [
    'category',
    'category_slug',
    'parent_slug',
    'level',
    'locale',
    'seo_title',
    'meta_description',
    'h1',
    'intro_chars',
    'intro_words',
    'intro_preview',
    'flags',
    'source',
    'warning',
    'url',
  ];
  await writeFile(output, appendCsv(rows, keys), 'utf8');
  const flagCounts = {};
  for (const r of records)
    for (const f of new Set(r.flags)) flagCounts[f] = (flagCounts[f] || 0) + 1;
  console.log(
    `\nDone. ${nodes.length} categories/subcategories, ${rows.length} language rows -> ${output}`
  );
  console.table(flagCounts);
  if (records.some(r => r.source === 'TREE_FALLBACK'))
    console.warn(
      'WARNING: some SEO detail endpoints were unavailable. Missing-field flags on TREE_FALLBACK records are provisional.'
    );
  console.log(
    'READ-ONLY: No database or website changes were made. Flags are review candidates, not automatic SEO errors.'
  );
} catch (err) {
  console.error('AUDIT FAILED:', err.message);
  process.exitCode = 1;
}

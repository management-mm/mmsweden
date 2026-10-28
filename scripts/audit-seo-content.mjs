#!/usr/bin/env node
import { writeFile } from 'node:fs/promises';

import {
  auditCatalog,
  auditCategoryTree,
  toCsv,
} from './seo-step04-audit-utils.mjs';

// Usage: node scripts/audit-seo-content.mjs https://your-api-server /path/to/report.csv
const apiUrl = (
  process.argv[2] ||
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ''
).replace(/\/+$/, '');
const output = process.argv[3] || 'seo-step04-audit.csv';

if (!/^https?:\/\//.test(apiUrl)) {
  console.error(
    'Provide your API_URL, e.g. node scripts/audit-seo-content.mjs http://localhost:4000'
  );
  process.exitCode = 1;
} else {
  try {
    const products = [];
    let total = Infinity;
    for (let page = 1; page <= 500 && products.length < total; page++) {
      const url = `${apiUrl}/products?perPage=100&page=${page}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (!res.ok) throw Error(`Product API returned ${res.status}: ${url}`);
      const data = await res.json();
      if (!Array.isArray(data.products) || !Number.isFinite(data.total)) {
        throw Error(`Unexpected API response for ${url}`);
      }
      total = data.total;
      if (data.products.length === 0 && products.length < total) {
        throw Error(
          `Stopped early at page ${page}; ${products.length}/${total} products received`
        );
      }
      products.push(...data.products);
      if (data.products.length < 100 && products.length < total) {
        throw Error(
          `API returned fewer than 100 products before expected total; got ${products.length}/${total}`
        );
      }
    }
    if (products.length < total)
      throw Error(`Incomplete inventory: ${products.length}/${total}`);

    let issues = auditCatalog(products);
    try {
      const categoryResponse = await fetch(
        `${apiUrl}/seo-categories/tree?activeOnly=true`,
        {
          signal: AbortSignal.timeout(30000),
        }
      );
      if (categoryResponse.ok) {
        const tree = await categoryResponse.json();
        if (Array.isArray(tree))
          issues = issues.concat(auditCategoryTree(tree));
      } else {
        console.warn(
          `Category tree audit skipped: HTTP ${categoryResponse.status}`
        );
      }
    } catch (error) {
      console.warn(`Category tree audit skipped: ${error.message}`);
    }
    await writeFile(output, '\uFEFF' + toCsv(issues), 'utf8');
    const summary = {};
    for (const issue of issues)
      summary[issue.code] = (summary[issue.code] || 0) + 1;
    console.log(
      `Audited ${products.length} products, ${issues.length} review flags → ${output}`
    );
    console.table(summary);
    console.log(
      'REVIEW flags are suggestions, not verified errors. Edit data in the CMS; this script changes nothing.'
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

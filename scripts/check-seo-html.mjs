/**
 * Usage: node scripts/check-seo-html.mjs https://www.mmsweden.se
 * Checks server-returned HTML only. It does NOT run browser JavaScript.
 */
const baseUrl = (process.argv[2] || 'https://www.mmsweden.se').replace(
  /\/$/,
  ''
);
const locales = ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk', 'pl'];
let failed = false;

for (const locale of locales) {
  const url = `${baseUrl}/${locale}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'MM-Sweden-SEO-HTML-Audit/1.0' },
      signal: AbortSignal.timeout(15_000),
    });
    const html = await response.text();

    // Exclude JS and CSS from this check: text in hydration payloads is not HTML content.
    const documentHtml = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
    const hasMain = /<main\b/i.test(documentHtml);
    const hasH1 = /<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(documentHtml);
    const matches = [
      ...documentHtml.matchAll(
        new RegExp(`href=["']/${locale}/all-products/[^"']+["']`, 'g')
      ),
    ];
    const uniqueCategoryLinks = new Set(matches.map(match => match[0])).size;
    const passed = response.ok && hasMain && hasH1 && uniqueCategoryLinks > 0;
    if (!passed) failed = true;

    console.log(
      `${passed ? 'PASS' : 'FAIL'} ${url}: HTTP ${response.status}, ` +
        `main=${hasMain}, H1=${hasH1}, unique category links=${uniqueCategoryLinks}`
    );
  } catch (error) {
    failed = true;
    console.error(`FAIL ${url}: ${error.message}`);
  }
}

if (failed) {
  process.exitCode = 1;
  console.error(
    '\nAt least one page lacks server-rendered content or category links. ' +
      'Check API_URL/NEXT_PUBLIC_API_URL and production HTML.'
  );
}

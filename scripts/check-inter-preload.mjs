#!/usr/bin/env node
// Checks initial HTML: do not preload all Inter variants; keep hero preload.
const base = process.argv[2] || 'http://localhost:3000';
const url = new URL('/sv', base);
try {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const html = await response.text();
  const links = [...html.matchAll(/<link\b[^>]*>/gi)].map(x => x[0]);
  const isPreload = link => /\brel=["']preload["']/.test(link);
  const inter = links.filter(
    link => isPreload(link) && /Inter_[^"']*\.woff2/.test(link)
  );
  const hero = links.filter(
    link => isPreload(link) && /desktop-home-bg\.webp/.test(link)
  );
  console.log(`Page: ${url}`);
  console.log(`Inter font preloads: ${inter.length} (expected 0)`);
  console.log(`Hero image preloads: ${hero.length} (expected >=1)`);
  if (inter.length || !hero.length) {
    console.error(
      'CHECK FAILED: confirm the patch and restart the production server.'
    );
    process.exitCode = 1;
  } else console.log('CHECK PASSED');
} catch (err) {
  console.error('ERROR:', err.message);
  process.exitCode = 1;
}

/**
 * Permanent redirects for known URLs from the old mmsweden.se website.
 *
 * Keep this mapping explicit: redirecting every unknown URL to the homepage
 * would create soft-404s and can discard the value of existing backlinks.
 * Additional historical URLs should be added after checking Search Console
 * and the site's backlinks for the appropriate live destination.
 *
 * The function is dependency-free so it can be tested without Next.js.
 */
const LEGACY_PATHS: Record<string, string> = {
  '/engelska.html': '/en',
  '/nyinkommit.html': '/sv/new-arrivals',
  '/begagnade-maskiner1.html': '/sv/all-products',
  '/bakery-machinery': '/sv/all-products/bakery-machinery',
  '/fish-processing-machinery': '/sv/all-products/fish-processing-machinery',
};

/**
 * Pages from the earlier version of this Next.js website that could be
 * reached without a locale. Historically these received a temporary 307 to
 * the English equivalent. Old Swedish-facing search results instead need a
 * permanent 301 to the Swedish version.
 *
 * Product/category slugs are intentionally preserved. A real missing slug
 * must still return 404 at the destination instead of a fake product page.
 */
const UNPREFIXED_SWEDISH_PAGES = new Set([
  '/all-products',
  '/new-arrivals',
  '/about-us',
  '/contact-us',
  '/sell-to-us',
  '/privacy-policy',
  '/my-price-quote',
]);

function getLegacyDestination(path: string): string | null {
  const normalizedPath = path.toLowerCase();
  const knownLegacyPath = LEGACY_PATHS[normalizedPath];
  if (knownLegacyPath) return knownLegacyPath;

  if (
    UNPREFIXED_SWEDISH_PAGES.has(normalizedPath) ||
    normalizedPath.startsWith('/all-products/')
  ) {
    return `/sv${path}`;
  }

  // Keep the site's global landing page in English. The historical Swedish
  // category pages above redirect straight to their Swedish destinations.
  if (path === '/') return '/en';

  return null;
}

export function getSeoRedirectTarget(url: URL, hostname: string): URL | null {
  const incomingHost = hostname.split(':')[0].toLowerCase();
  const isBareDomain = incomingHost === 'mmsweden.se';
  const isCanonicalDomain = incomingHost === 'www.mmsweden.se';
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const destination = getLegacyDestination(path);

  if (!isBareDomain && !destination) return null;

  const target = new URL(url);

  if (isBareDomain || isCanonicalDomain) {
    target.protocol = 'https:';
    target.hostname = 'www.mmsweden.se';
    // Remove a reverse proxy's internal port from production redirects.
    target.port = '';
  }

  if (destination) target.pathname = destination;

  // Preserve original query parameters (UTM tags, filters and pagination).
  return target;
}

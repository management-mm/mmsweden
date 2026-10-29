import { getSeoRedirectTarget } from '@lib/seoLegacyRedirects';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@i18n/config';

const intlMiddleware = createMiddleware({
  locales: SUPPORTED_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: false,
  alternateLinks: false,
});

export default function proxy(request: NextRequest) {
  // On managed hosting, the public host may be carried in x-forwarded-host.
  // Only the exact apex domain is canonicalized (never a staging hostname).
  const hostname =
    request.headers.get('x-forwarded-host')?.split(',')[0]?.trim() ||
    request.nextUrl.hostname;

  const target = getSeoRedirectTarget(new URL(request.url), hostname);

  // Apply 301s BEFORE next-intl's default temporary locale redirects.
  // Only navigations qualify: a 301 can turn a form POST into a GET.
  if (target && (request.method === 'GET' || request.method === 'HEAD')) {
    return NextResponse.redirect(target, 301);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    // Dot-containing historical paths are excluded by the general matcher.
    '/engelska.html',
    '/nyinkommit.html',
    '/begagnade-maskiner1.html',
    '/index.html',
    // `.*\..*` in the general matcher excludes ALL dot-containing URLs.
    // These specific matchers include old `.html` documents and their children.
    '/index.html/:path*',
    '/engelska.html/:path*',
    '/begagnade-maskiner1.html/:path*',
    '/:locale/index.html/:path*',
    '/:locale/engelska.html/:path*',
    '/:locale/begagnade-maskiner1.html/:path*',
  ],
};

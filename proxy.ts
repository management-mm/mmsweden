import createMiddleware from 'next-intl/middleware';

const proxy = createMiddleware({
  locales: ['en', 'sv', 'de', 'fr', 'es', 'ru', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export default proxy;

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

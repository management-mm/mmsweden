import type { MetadataRoute } from 'next';

import { SUPPORTED_LOCALES } from '@i18n/config';

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  const localizedAdminPaths = SUPPORTED_LOCALES.map(
    locale => `/${locale}/admin`
  );

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api', '/admin', ...localizedAdminPaths],
      },
    ],
    sitemap: `${siteUrl}/sitemap_index.xml`,
  };
}

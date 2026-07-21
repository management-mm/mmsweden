import { getSiteUrl } from '@lib/sitemap/config';
import type { MetadataRoute } from 'next';

import { SUPPORTED_LOCALES } from '@i18n/config';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        ...SUPPORTED_LOCALES.map(locale => `/${locale}/admin`),
      ],
    },
    sitemap: `${siteUrl}/sitemap_index.xml`,
  };
}

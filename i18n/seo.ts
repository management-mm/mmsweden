import type { Metadata } from 'next';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  OG_LOCALE_BY_APP_LOCALE,
  SUPPORTED_LOCALES,
} from '@i18n/config';

type CreatePageMetadataParams = {
  locale: AppLocale;
  path: string;
  title: string;
  description?: string;
  keywords?: string[];
  noIndex?: boolean;
};

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

function normalizePath(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath === '/' ? '' : normalizedPath;
}

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
  noIndex = false,
}: CreatePageMetadataParams): Metadata {
  const siteUrl = getSiteUrl();
  const pathname = normalizePath(path);

  const canonical = `${siteUrl}/${locale}${pathname}`;

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(l => [l, `${siteUrl}/${l}${pathname}`]),
    ['x-default', `${siteUrl}/${DEFAULT_LOCALE}${pathname}`],
  ]);

  return {
    metadataBase: new URL(siteUrl),

    title,
    description,
    keywords,

    alternates: {
      canonical,
      languages,
    },

    robots: {
      index: !noIndex,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: OG_LOCALE_BY_APP_LOCALE[locale],
      alternateLocale: SUPPORTED_LOCALES.filter(l => l !== locale).map(
        l => OG_LOCALE_BY_APP_LOCALE[l]
      ),
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

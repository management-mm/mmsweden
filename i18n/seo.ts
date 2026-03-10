import type { Metadata } from 'next';

import {
  type AppLocale,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
} from '@i18n/config';

type CreatePageMetadataParams = {
  locale: AppLocale;
  path: string;
  title: string;
  description?: string;
  keywords?: string[];
};

export function createPageMetadata({
  locale,
  path,
  title,
  description,
  keywords,
}: CreatePageMetadataParams): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(l => [
      l,
      `${baseUrl}/${l}${normalizedPath === '/' ? '' : normalizedPath}`,
    ]),
    [
      'x-default',
      `${baseUrl}/${DEFAULT_LOCALE}${normalizedPath === '/' ? '' : normalizedPath}`,
    ],
  ]);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}${normalizedPath === '/' ? '' : normalizedPath}`,
      languages,
    },
  };
}

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
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const pathname = normalizedPath === '/' ? '' : normalizedPath;

  const localizedPath = `/${locale}${pathname}`;

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(l => [l, `/${l}${pathname}`]),
    ['x-default', `/${DEFAULT_LOCALE}${pathname}`],
  ]);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: localizedPath,
      languages,
    },
  };
}

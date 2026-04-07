import type { Metadata } from 'next';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

type SearchParams = {
  title?: string;
  manufacturer?: string;
  condition?: string;
  page?: string;
  category?: string | string[];
  industry?: string | string[];
};

const normalizeArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

type Props = {
  locale: AppLocale;
  path: string;
  searchParams: SearchParams;
};

export function buildAllProductsMetadata({
  locale,
  path,
  searchParams,
}: Props): Metadata {
  const hasFilters =
    !!searchParams.title ||
    !!searchParams.manufacturer ||
    !!searchParams.condition ||
    normalizeArray(searchParams.category).length > 0 ||
    normalizeArray(searchParams.industry).length > 0;

  return createPageMetadata({
    locale,
    path,
    title: 'Used Food Processing Machines | Meat Machines',
    description: 'Browse our catalogue of used food processing machinery.',
    noIndex: hasFilters,
  });
}

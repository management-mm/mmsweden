import type { Metadata } from 'next';

import AllProductsView from '@components/allProducts/AllProductsView';

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

type Props = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<SearchParams>;
};

const normalizeArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  const hasFilters =
    !!resolvedSearchParams.title ||
    !!resolvedSearchParams.manufacturer ||
    !!resolvedSearchParams.condition ||
    normalizeArray(resolvedSearchParams.category).length > 0 ||
    normalizeArray(resolvedSearchParams.industry).length > 0;

  return createPageMetadata({
    locale,
    path: '/all-products',
    title: 'Used Food Processing Machines | Meat Machines',
    description: 'Browse our catalogue of used food processing machinery.',
    noIndex: hasFilters,
  });
}

export default async function AllProductsPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <AllProductsView
      mode="public"
      locale={locale}
      query={{
        title: resolvedSearchParams.title,
        manufacturer: resolvedSearchParams.manufacturer,
        condition: resolvedSearchParams.condition,
        page: resolvedSearchParams.page,
        category: normalizeArray(resolvedSearchParams.category),
        industry: normalizeArray(resolvedSearchParams.industry),
      }}
    />
  );
}

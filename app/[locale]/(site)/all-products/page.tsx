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

const getCanonicalPath = (page?: string) => {
  if (!page || page === '1') {
    return '/all-products';
  }

  return `/all-products?page=${page}`;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return createPageMetadata({
    locale,
    path: getCanonicalPath(resolvedSearchParams.page),
    title: 'All Machines | Meat Machines',
    description: 'Browse our catalogue of used food processing machinery.',
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

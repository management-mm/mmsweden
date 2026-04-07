import type { Metadata } from 'next';

import AllProductsPageContent from '@components/allProducts/AllProductsPageContent';
import { buildAllProductsMetadata } from '@components/allProducts/buildAllProductsMetadata';

import type { AppLocale } from '@i18n/config';

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

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return buildAllProductsMetadata({
    locale,
    path: '/all-products',
    searchParams: resolvedSearchParams,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <AllProductsPageContent
      locale={locale}
      searchParams={resolvedSearchParams}
    />
  );
}

import type { Metadata } from 'next';

import AllProductsView from '@components/allProducts/AllProductsView';
import {
  type SearchParams,
  buildCategoryMetadata,
  normalizeArray,
} from '@components/allProducts/allProductsSeo';

import type { AppLocale } from '@i18n/config';

type Props = {
  params: Promise<{ locale: AppLocale; categorySlug: string }>;
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug } = await params;

  return buildCategoryMetadata({
    locale,
    categorySlug,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <AllProductsView
      locale={locale}
      query={{
        title: resolvedSearchParams.title,
        manufacturer: resolvedSearchParams.manufacturer,
        condition: resolvedSearchParams.condition,
        page: resolvedSearchParams.page,
        category: normalizeArray(resolvedSearchParams.category),
        industry: normalizeArray(resolvedSearchParams.industry),
        categorySlug,
      }}
    />
  );
}

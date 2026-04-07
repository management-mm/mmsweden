import AllProductsView from '@components/allProducts/AllProductsView';

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
  params: Promise<{ locale: AppLocale; categorySlug: string }>;
  searchParams: Promise<SearchParams>;
};

const normalizeArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

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

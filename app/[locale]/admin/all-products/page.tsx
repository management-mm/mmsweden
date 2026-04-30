import AdminProductsView from '@components/allProducts/AdminProductsView';

import type { AppLocale } from '@i18n/config';

type SearchParams = {
  title?: string;
  manufacturer?: string;
  condition?: string;
  page?: string;
  category?: string | string[];
  industry?: string | string[];
  filter?: 'sold' | 'draft' | 'hasNotes';
};

type Props = {
  params: Promise<{ locale: AppLocale }>;
  searchParams: Promise<SearchParams>;
};

const normalizeArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export default async function AdminAllProductsPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <AdminProductsView
      locale={locale}
      query={{
        title: resolvedSearchParams.title,
        manufacturer: resolvedSearchParams.manufacturer,
        condition: resolvedSearchParams.condition,
        page: resolvedSearchParams.page || '1',
        category: normalizeArray(resolvedSearchParams.category),
        industry: normalizeArray(resolvedSearchParams.industry),
        filter: resolvedSearchParams.filter,
      }}
    />
  );
}

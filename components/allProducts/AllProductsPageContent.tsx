import AllProductsView from './AllProductsView';

import type { AppLocale } from '@i18n/config';

type SearchParams = {
  title?: string;
  manufacturer?: string;
  condition?: string;
  page?: string;
  category?: string | string[];
  industry?: string | string[];
};

type SeoIntro = {
  h1: string;
  intro?: string | null;
};

type Props = {
  locale: AppLocale;
  searchParams: SearchParams;
  categorySlug?: string;
  subcategorySlug?: string;
  seoIntro?: SeoIntro;
};

const normalizeArray = (value?: string | string[]) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

export default function AllProductsPageContent({
  locale,
  searchParams,
  categorySlug,
  subcategorySlug,
  seoIntro,
}: Props) {
  return (
    <AllProductsView
      mode="public"
      locale={locale}
      seoIntro={seoIntro}
      query={{
        title: searchParams.title,
        manufacturer: searchParams.manufacturer,
        condition: searchParams.condition,
        page: searchParams.page,
        category: normalizeArray(searchParams.category),
        industry: normalizeArray(searchParams.industry),
        categorySlug,
        subcategorySlug,
      }}
    />
  );
}

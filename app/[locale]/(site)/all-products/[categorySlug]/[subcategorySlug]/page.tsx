import type { Metadata } from 'next';

import AllProductsView from '@components/allProducts/AllProductsView';
import {
  type SearchParams,
  buildSubcategoryMetadata,
  normalizeArray,
} from '@components/allProducts/allProductsSeo';

import type { AppLocale } from '@i18n/config';
import {
  buildCollectionPageSchema,
  getSiteUrl,
  serializeJsonLd,
} from '@i18n/schema';

type Props = {
  params: Promise<{
    locale: AppLocale;
    categorySlug: string;
    subcategorySlug: string;
  }>;
  searchParams: Promise<SearchParams>;
};

function slugToLabel(slug: string) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug } = await params;

  return buildSubcategoryMetadata({
    locale,
    categorySlug,
    subcategorySlug,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, categorySlug, subcategorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const siteUrl = getSiteUrl();
  const categoryName = slugToLabel(categorySlug);
  const subcategoryName = slugToLabel(subcategorySlug);
  const canonicalUrl = `${siteUrl}/${locale}/all-products/${categorySlug}/${subcategorySlug}`;

  const collectionPageJsonLd = buildCollectionPageSchema({
    locale,
    url: canonicalUrl,
    name: `${subcategoryName} | MMSweden`,
    description: `Browse ${subcategoryName} machines and equipment in ${categoryName} available on MMSweden.`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(collectionPageJsonLd),
        }}
      />

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
          subcategorySlug,
        }}
      />
    </>
  );
}

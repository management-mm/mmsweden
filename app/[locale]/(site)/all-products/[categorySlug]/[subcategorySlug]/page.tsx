import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AllProductsView from '@components/allProducts/AllProductsView';
import {
  type SearchParams,
  buildSubcategoryMetadata,
  getSubcategorySeoData,
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

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const normalizedCategorySlug = normalizeSlug(categorySlug);
  const normalizedSubcategorySlug = normalizeSlug(subcategorySlug);

  return buildSubcategoryMetadata({
    locale,
    categorySlug: normalizedCategorySlug,
    subcategorySlug: normalizedSubcategorySlug,
    searchParams: resolvedSearchParams,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, categorySlug, subcategorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const normalizedCategorySlug = normalizeSlug(categorySlug);
  const normalizedSubcategorySlug = normalizeSlug(subcategorySlug);

  const subcategorySeoData = await getSubcategorySeoData({
    locale,
    categorySlug: normalizedCategorySlug,
    subcategorySlug: normalizedSubcategorySlug,
  });

  if (!subcategorySeoData.exists) {
    notFound();
  }

  const siteUrl = getSiteUrl();

  const canonicalUrl = `${siteUrl}/${locale}/all-products/${encodeURIComponent(
    normalizedCategorySlug
  )}/${encodeURIComponent(normalizedSubcategorySlug)}`;

  const collectionPageJsonLd = buildCollectionPageSchema({
    locale,
    url: canonicalUrl,
    name: subcategorySeoData.h1,
    description: subcategorySeoData.description,
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
        seoIntro={{
          h1: subcategorySeoData.h1,
          intro: subcategorySeoData.intro,
        }}
        locale={locale}
        query={{
          title: resolvedSearchParams.title,
          manufacturer: resolvedSearchParams.manufacturer,
          condition: resolvedSearchParams.condition,
          page: resolvedSearchParams.page,
          category: normalizeArray(resolvedSearchParams.category),
          industry: normalizeArray(resolvedSearchParams.industry),
          categorySlug: normalizedCategorySlug,
          subcategorySlug: normalizedSubcategorySlug,
        }}
      />
    </>
  );
}

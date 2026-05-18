import type { Metadata } from 'next';

import AllProductsView from '@components/allProducts/AllProductsView';
import SeoIntroSection from '@components/allProducts/SeoIntroSection';
import {
  type SearchParams,
  buildCategoryMetadata,
  getCategorySeoData,
  normalizeArray,
} from '@components/allProducts/allProductsSeo';

import type { AppLocale } from '@i18n/config';
import {
  buildCollectionPageSchema,
  getSiteUrl,
  serializeJsonLd,
} from '@i18n/schema';

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

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/all-products/${categorySlug}`;

  const categorySeoData = await getCategorySeoData({
    locale,
    categorySlug,
  });

  const collectionPageJsonLd = buildCollectionPageSchema({
    locale,
    url: canonicalUrl,
    name: categorySeoData.h1,
    description: categorySeoData.description,
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
          h1: categorySeoData.h1,
          intro: categorySeoData.intro,
        }}
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
    </>
  );
}

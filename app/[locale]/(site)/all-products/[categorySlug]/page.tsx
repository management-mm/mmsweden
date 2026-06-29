import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import AllProductsView from '@components/allProducts/AllProductsView';
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
  params: Promise<{
    locale: AppLocale;
    categorySlug: string;
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
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const normalizedCategorySlug = normalizeSlug(categorySlug);

  if (!normalizedCategorySlug) {
    return {
      title: 'Category Not Found | MM Sweden',
      description: 'The requested category could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildCategoryMetadata({
    locale,
    categorySlug: normalizedCategorySlug,
    searchParams: resolvedSearchParams,
  });
}

export default async function Page({ params, searchParams }: Props) {
  const { locale, categorySlug } = await params;
  const resolvedSearchParams = await searchParams;

  const normalizedCategorySlug = normalizeSlug(categorySlug);

  if (!normalizedCategorySlug) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/${locale}/all-products/${encodeURIComponent(
    normalizedCategorySlug
  )}`;

  const categorySeoData = await getCategorySeoData({
    locale,
    categorySlug: normalizedCategorySlug,
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
          categorySlug: normalizedCategorySlug,
        }}
      />
    </>
  );
}

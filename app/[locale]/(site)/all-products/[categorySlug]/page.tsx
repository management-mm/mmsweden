import type { Metadata } from 'next';

import AllProductsView from '@components/allProducts/AllProductsView';
import {
  type SearchParams,
  buildCategoryMetadata,
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

function slugToLabel(slug: string) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

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
  const categoryName = slugToLabel(categorySlug);
  const canonicalUrl = `${siteUrl}/${locale}/all-products/${categorySlug}`;

  const collectionPageJsonLd = buildCollectionPageSchema({
    locale,
    url: canonicalUrl,
    name: `${categoryName} | MMSweden`,
    description: `Browse ${categoryName} machines and equipment available on MMSweden.`,
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
        }}
      />
    </>
  );
}

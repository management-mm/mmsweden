import { Suspense, cache } from 'react';

import { getProductBySlug } from '@api/getProductBySlug';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import {
  buildNotFoundProductMetadata,
  buildProductMetadata,
} from '@utils/buildProductMetadata';
import {
  buildProductStructuredData,
  serializeJsonLd,
} from '@utils/buildProductStructuredData';
import { resolveProductSeoData } from '@utils/resolveProductSeoData';

import type { AppLocale } from '@i18n/config';

type Props = {
  params: Promise<{
    locale: AppLocale;
    categorySlug: string;
    subcategorySlug: string;
    slug: string;
  }>;
};

const getProduct = cache(getProductBySlug);

function getSiteUrl(): string {
  return process.env.SITE_URL?.replace(/\/+$/, '') ?? 'https://www.mmsweden.se';
}

function buildProductPath(
  categorySlug: string,
  subcategorySlug: string,
  slug: string
): string {
  return `/all-products/${categorySlug}/${subcategorySlug}/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug, slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return buildNotFoundProductMetadata();
  }

  const seoData = resolveProductSeoData(
    product,
    locale,
    categorySlug,
    subcategorySlug,
    slug
  );

  if (!seoData.hasCanonicalPath) {
    return buildNotFoundProductMetadata();
  }

  return buildProductMetadata({
    product,
    seoData,
    locale,
    siteUrl: getSiteUrl(),
  });
}

export default async function ProductDetailsPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug, slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const seoData = resolveProductSeoData(
    product,
    locale,
    categorySlug,
    subcategorySlug,
    slug
  );

  if (!seoData.hasCanonicalPath) {
    notFound();
  }

  if (seoData.shouldRedirect) {
    permanentRedirect(
      `/${locale}${buildProductPath(
        seoData.categorySlug,
        seoData.subcategorySlug,
        seoData.productSlug
      )}`
    );
  }

  const { productJsonLd, breadcrumbJsonLd } = buildProductStructuredData({
    product,
    seoData,
    locale,
    siteUrl: getSiteUrl(),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(productJsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbJsonLd),
        }}
      />

      <Product
        product={product}
        locale={locale}
        slug={seoData.productSlug}
        categorySlug={seoData.categorySlug}
        subcategorySlug={seoData.subcategorySlug}
      />

      <Suspense fallback={<div>Loading recommended products...</div>}>
        <RecommendedProducts locale={locale} slug={seoData.productSlug} />
      </Suspense>
    </>
  );
}

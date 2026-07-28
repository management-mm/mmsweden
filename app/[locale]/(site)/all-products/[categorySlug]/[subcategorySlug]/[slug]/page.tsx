import { Suspense, cache } from 'react';

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
import {
  type ProductWithSeo,
  resolveProductSeoData,
} from '@utils/resolveProductSeoData';

import type { AppLocale } from '@i18n/config';

type Props = {
  params: Promise<{
    locale: AppLocale;
    categorySlug: string;
    subcategorySlug: string;
    slug: string;
  }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isMongoObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function getApiUrl(): string {
  return (
    process.env.API_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
    'https://mmsweden-server.onrender.com'
  );
}

function getSiteUrl(): string {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

const getProduct = cache(
  async (slug: string): Promise<ProductWithSeo | null> => {
    const normalizedSlug = slug.trim();

    if (!normalizedSlug || isMongoObjectId(normalizedSlug)) {
      return null;
    }

    const response = await fetch(
      `${getApiUrl()}/products/by-slug/${encodeURIComponent(normalizedSlug)}`,
      {
        next: { revalidate: 300 },
      }
    );

    if (response.status === 404 || response.status === 410) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch product "${normalizedSlug}": ${response.status} ${response.statusText}`
      );
    }

    const data: unknown = await response.json();

    if (!isRecord(data)) {
      throw new Error(
        `Invalid product response for "${normalizedSlug}": expected an object`
      );
    }

    return data as unknown as ProductWithSeo;
  }
);

function buildProductPath(
  categorySlug: string,
  subcategorySlug: string,
  slug: string
): string {
  return `/all-products/${categorySlug}/${subcategorySlug}/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug, slug } = await params;
  const siteUrl = getSiteUrl();
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
    siteUrl,
  });
}

export default async function ProductDetailsPage({ params }: Props) {
  const { locale, categorySlug, subcategorySlug, slug } = await params;
  const siteUrl = getSiteUrl();
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
    siteUrl,
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

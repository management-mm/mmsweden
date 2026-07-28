import { Suspense, cache } from 'react';

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import {
  buildNotFoundProductMetadata,
  buildProductMetadata,
  buildProductUrl,
  getLocalizedText,
  getProductSeoCopy,
} from '@utils/buildProductMetadata';
import {
  type ProductWithSeo,
  resolveProductSeoData,
} from '@utils/resolveProductSeoData';
import slugToLabel from '@utils/slugToLabel';

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

function getNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
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

function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
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

function buildBreadcrumbJsonLd(items: Array<{ name: string; item: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((entry, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: entry.name,
      item: entry.item,
    })),
  };
}

function buildProductJsonLd(params: {
  product: ProductWithSeo;
  locale: AppLocale;
  canonicalUrl: string;
  localizedName: string;
  localizedDescription: string;
}) {
  const { product, locale, canonicalUrl, localizedName, localizedDescription } =
    params;

  const images = (product.photos ?? []).filter(
    (photo): photo is string =>
      typeof photo === 'string' && photo.trim().length > 0
  );

  const manufacturer = getNonEmptyString(product.manufacturer);
  const productId = getNonEmptyString(product.idNumber);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    description: localizedDescription,
    sku: productId,
    productID: productId,
    image: images.length > 0 ? images : undefined,
    brand: manufacturer
      ? {
          '@type': 'Brand',
          name: manufacturer,
        }
      : undefined,
    itemCondition:
      product.condition === 'new'
        ? 'https://schema.org/NewCondition'
        : product.condition === 'used'
          ? 'https://schema.org/UsedCondition'
          : undefined,
    url: canonicalUrl,
    inLanguage: locale,
  } satisfies Record<string, unknown>;
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

  const canonicalUrl = buildProductUrl(
    siteUrl,
    locale,
    seoData.categorySlug,
    seoData.subcategorySlug,
    seoData.productSlug
  );

  const copy = getProductSeoCopy(locale);
  const localizedName = getLocalizedText(
    product.name,
    locale,
    slugToLabel(seoData.productSlug)
  );
  const localizedDescription = getLocalizedText(
    product.description,
    locale,
    copy.fallbackDescription
  );

  const productJsonLd = buildProductJsonLd({
    product,
    locale,
    canonicalUrl,
    localizedName,
    localizedDescription,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    {
      name: copy.breadcrumbs.home,
      item: `${siteUrl}/${locale}`,
    },
    {
      name: copy.breadcrumbs.allProducts,
      item: `${siteUrl}/${locale}/all-products`,
    },
    {
      name: seoData.categoryLabel,
      item: `${siteUrl}/${locale}/all-products/${seoData.categorySlug}`,
    },
    {
      name: seoData.subcategoryLabel,
      item: `${siteUrl}/${locale}/all-products/${seoData.categorySlug}/${seoData.subcategorySlug}`,
    },
    {
      name: localizedName,
      item: canonicalUrl,
    },
  ]);

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

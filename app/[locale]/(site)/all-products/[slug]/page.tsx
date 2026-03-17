import { Suspense } from 'react';

import type { Metadata } from 'next';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type Props = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};

type ProductResponse = {
  _id: string;
  idNumber: string;
  slug?: string;
  name: Record<AppLocale, string>;
  description: Record<AppLocale, string>;
  photos?: string[];
  manufacturer?: string;
  condition?: 'used' | 'new';
};

async function getProductForMetadata(
  slug: string
): Promise<ProductResponse | null> {
  const baseUrl = process.env.API_URL!;

  const res = await fetch(`${baseUrl}/products/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  return res.json();
}

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

function buildProductUrl(siteUrl: string, locale: AppLocale, slug: string) {
  return `${siteUrl}/${locale}/all-products/${slug}`;
}

function slugToTitle(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteUrl = getSiteUrl();

  const product = await getProductForMetadata(slug);

  const canonicalUrl = buildProductUrl(siteUrl, locale, slug);

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(l => [l, buildProductUrl(siteUrl, l, slug)]),
    ['x-default', buildProductUrl(siteUrl, 'en', slug)],
  ]);

  const fallbackName = slugToTitle(slug);

  if (!product) {
    return {
      title: `${fallbackName} | Meat Machines`,
      description: 'Used food processing and packaging equipment.',
      alternates: {
        canonical: canonicalUrl,
        languages,
      },
      robots: {
        index: false,
        follow: false,
      },
      openGraph: {
        title: `${fallbackName} | Meat Machines`,
        description: 'Used food processing and packaging equipment.',
        url: canonicalUrl,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${fallbackName} | Meat Machines`,
        description: 'Used food processing and packaging equipment.',
      },
    };
  }

  const localizedName =
    product.name?.[locale] || product.name?.en || fallbackName;

  const localizedDescription =
    product.description?.[locale] ||
    product.description?.en ||
    'Used food processing and packaging equipment.';

  const shortDescription =
    localizedDescription.length > 160
      ? `${localizedDescription.slice(0, 157)}...`
      : localizedDescription;

  const ogImage = product.photos?.[0];

  return {
    title: `${localizedName} | Meat Machines`,
    description: shortDescription,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${localizedName} | Meat Machines`,
      description: shortDescription,
      url: canonicalUrl,
      type: 'website',
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: localizedName,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${localizedName} | Meat Machines`,
      description: shortDescription,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function ProductDetails({ params }: Props) {
  const { locale, slug } = await params;
  const siteUrl = getSiteUrl();

  const product = await getProductForMetadata(slug);

  const canonicalUrl = buildProductUrl(siteUrl, locale, slug);

  const fallbackName = slugToTitle(slug);

  const localizedName =
    product?.name?.[locale] || product?.name?.en || fallbackName;

  const localizedDescription =
    product?.description?.[locale] ||
    product?.description?.en ||
    'Used food processing and packaging equipment.';

  const jsonLd =
    product &&
    ({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: localizedName,
      description: localizedDescription,
      sku: product.idNumber,
      image: product.photos ?? [],
      brand: product.manufacturer
        ? {
            '@type': 'Brand',
            name: product.manufacturer,
          }
        : undefined,
      itemCondition:
        product.condition === 'new'
          ? 'https://schema.org/NewCondition'
          : product.condition === 'used'
            ? 'https://schema.org/UsedCondition'
            : undefined,
      url: canonicalUrl,
    } satisfies Record<string, unknown>);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      )}

      <Product />

      <Suspense fallback={<div>Loading recommended products...</div>}>
        <RecommendedProducts />
      </Suspense>
    </>
  );
}

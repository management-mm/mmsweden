import { Suspense } from 'react';

import { IProduct } from '@interfaces/IProduct';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type Props = {
  params: Promise<{ locale: AppLocale; slug: string }>;
};
function isMultiLang(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null;
}

async function getProduct(slug: string): Promise<IProduct | null> {
  const baseUrl = process.env.API_URL!;

  const res = await fetch(`${baseUrl}/products/by-slug/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;

  return res.json();
}

function getApiUrl() {
  return (
    process.env.API_URL?.replace(/\/$/, '') ??
    'https://mmsweden-server.onrender.com'
  );
}

function buildProductUrl(siteUrl: string, locale: AppLocale, slug: string) {
  return `${siteUrl}/${locale}/all-products/${slug}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const siteUrl = getApiUrl();
  let localizedName: string;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Meat Machines',
      description: 'The requested product could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = buildProductUrl(siteUrl, locale, slug);

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(l => [l, buildProductUrl(siteUrl, l, slug)]),
    ['x-default', buildProductUrl(siteUrl, 'en', slug)],
  ]);

  if (isMultiLang(product.name)) {
    localizedName = product.name[locale] || product.name.en || slug;
  } else {
    localizedName = product.name || slug;
  }

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

export default async function ProductDetailsPage({ params }: Props) {
  const { locale, slug } = await params;
  let localizedName: string;
  const siteUrl = getApiUrl();

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const canonicalUrl = buildProductUrl(siteUrl, locale, slug);

  if (isMultiLang(product.name)) {
    localizedName = product.name[locale] || product.name.en || slug;
  } else {
    localizedName = product.name || slug;
  }

  const localizedDescription =
    product.description?.[locale] ||
    product.description?.en ||
    'Used food processing and packaging equipment.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    description: localizedDescription,
    sku: product.idNumber,
    productID: product.idNumber,
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
    inLanguage: locale,
  } satisfies Record<string, unknown>;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'All Products',
        item: `${siteUrl}/${locale}/all-products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: localizedName,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <Product product={product} locale={locale} slug={slug} />

      <Suspense fallback={<div>Loading recommended products...</div>}>
        <RecommendedProducts />
      </Suspense>
    </>
  );
}

import { Suspense, cache } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import Product from '@components/productDetails/Product';
import RecommendedProducts from '@components/productDetails/RecommendedProducts';

import slugToLabel from '@utils/slugToLabel';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type Props = {
  params: Promise<{
    locale: AppLocale;
    categorySlug: string;
    subcategorySlug: string;
    slug: string;
  }>;
};

type SeoRef = {
  slug?: string;
  name?: string | Record<string, string>;
};

type ProductWithSeo = IProduct & {
  seoCategorySlug?: string;
  seoSubcategorySlug?: string;
  seoCategory?: SeoRef | string | null;
  seoSubcategory?: SeoRef | string | null;
  seoCategoryId?: SeoRef | string | null;
  seoSubcategoryId?: SeoRef | string | null;
};

function isMultiLang(value: unknown): value is Record<string, string> {
  return typeof value === 'object' && value !== null;
}

function getApiUrl() {
  return (
    process.env.API_URL?.replace(/\/$/, '') ??
    'https://mmsweden-server.onrender.com'
  );
}

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

const getProduct = cache(
  async (slug: string): Promise<ProductWithSeo | null> => {
    const baseUrl = getApiUrl();

    const res = await fetch(`${baseUrl}/products/by-slug/${slug}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    return res.json();
  }
);

function buildProductPath(
  categorySlug: string,
  subcategorySlug: string,
  slug: string
) {
  return `/all-products/${categorySlug}/${subcategorySlug}/${slug}`;
}

function buildProductUrl(
  siteUrl: string,
  locale: AppLocale,
  categorySlug: string,
  subcategorySlug: string,
  slug: string
) {
  return `${siteUrl}/${locale}${buildProductPath(
    categorySlug,
    subcategorySlug,
    slug
  )}`;
}

function extractSlug(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (
    typeof value === 'object' &&
    value !== null &&
    'slug' in value &&
    typeof value.slug === 'string' &&
    value.slug.trim()
  ) {
    return value.slug.trim();
  }

  return undefined;
}

function extractName(
  value: unknown
): string | Record<string, string> | undefined {
  if (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    (typeof value.name === 'string' || isMultiLang(value.name))
  ) {
    return value.name;
  }

  return undefined;
}

function getLocalizedText(
  value: unknown,
  locale: AppLocale,
  fallback: string
): string {
  if (typeof value === 'string' && value.trim()) {
    return value;
  }

  if (isMultiLang(value)) {
    return value[locale] || value.en || Object.values(value)[0] || fallback;
  }

  return fallback;
}

function resolveProductSeoData(
  product: ProductWithSeo,
  locale: AppLocale,
  routeCategorySlug: string,
  routeSubcategorySlug: string
) {
  const actualCategorySlug =
    extractSlug(product.seoCategorySlug) ??
    extractSlug(product.seoCategory) ??
    extractSlug(product.seoCategoryId);

  const actualSubcategorySlug =
    extractSlug(product.seoSubcategorySlug) ??
    extractSlug(product.seoSubcategory) ??
    extractSlug(product.seoSubcategoryId);

  const categorySlug = actualCategorySlug ?? routeCategorySlug;
  const subcategorySlug = actualSubcategorySlug ?? routeSubcategorySlug;

  const categoryNameSource =
    extractName(product.seoCategory) ?? extractName(product.seoCategoryId);

  const subcategoryNameSource =
    extractName(product.seoSubcategory) ??
    extractName(product.seoSubcategoryId);

  const categoryLabel = getLocalizedText(
    categoryNameSource,
    locale,
    slugToLabel(categorySlug)
  );

  const subcategoryLabel = getLocalizedText(
    subcategoryNameSource,
    locale,
    slugToLabel(subcategorySlug)
  );

  const shouldRedirect =
    Boolean(actualCategorySlug && actualSubcategorySlug) &&
    (routeCategorySlug !== actualCategorySlug ||
      routeSubcategorySlug !== actualSubcategorySlug);

  return {
    categorySlug,
    subcategorySlug,
    categoryLabel,
    subcategoryLabel,
    shouldRedirect,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, categorySlug, subcategorySlug, slug } = await params;
  const siteUrl = getSiteUrl();

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

  const seoData = resolveProductSeoData(
    product,
    locale,
    categorySlug,
    subcategorySlug
  );

  const canonicalUrl = buildProductUrl(
    siteUrl,
    locale,
    seoData.categorySlug,
    seoData.subcategorySlug,
    slug
  );

  const languages = Object.fromEntries([
    ...SUPPORTED_LOCALES.map(l => [
      l,
      buildProductUrl(
        siteUrl,
        l,
        seoData.categorySlug,
        seoData.subcategorySlug,
        slug
      ),
    ]),
    [
      'x-default',
      buildProductUrl(
        siteUrl,
        'en',
        seoData.categorySlug,
        seoData.subcategorySlug,
        slug
      ),
    ],
  ]);

  const localizedName = getLocalizedText(product.name, locale, slug);

  const localizedDescription = getLocalizedText(
    product.description,
    locale,
    'Used food processing and packaging equipment.'
  );

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
    subcategorySlug
  );

  if (seoData.shouldRedirect) {
    redirect(
      `/${locale}${buildProductPath(
        seoData.categorySlug,
        seoData.subcategorySlug,
        slug
      )}`
    );
  }

  const canonicalUrl = buildProductUrl(
    siteUrl,
    locale,
    seoData.categorySlug,
    seoData.subcategorySlug,
    slug
  );

  const localizedName = getLocalizedText(product.name, locale, slug);

  const localizedDescription = getLocalizedText(
    product.description,
    locale,
    'Used food processing and packaging equipment.'
  );

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
        name: seoData.categoryLabel,
        item: `${siteUrl}/${locale}/all-products/${seoData.categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: seoData.subcategoryLabel,
        item: `${siteUrl}/${locale}/all-products/${seoData.categorySlug}/${seoData.subcategorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 5,
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

      <Product
        product={product}
        locale={locale}
        slug={slug}
        categorySlug={seoData.categorySlug}
        subcategorySlug={seoData.subcategorySlug}
      />

      <Suspense fallback={<div>Loading recommended products...</div>}>
        <RecommendedProducts
          locale={locale}
          slug={slug}
          categorySlug={seoData.categorySlug}
          subcategorySlug={seoData.subcategorySlug}
        />
      </Suspense>
    </>
  );
}

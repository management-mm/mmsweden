import {
  buildProductUrl,
  getLocalizedText,
  getProductSeoCopy,
} from './buildProductMetadata';
import type { ProductSeoData, ProductWithSeo } from './resolveProductSeoData';
import slugToLabel from './slugToLabel';

import type { AppLocale } from '@i18n/config';

function getNonEmptyString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalizedValue = value.trim();

  return normalizedValue || undefined;
}

function normalizeSiteUrl(siteUrl: string): string {
  return siteUrl.replace(/\/+$/, '');
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; item: string }>
) {
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

export function buildProductJsonLd(params: {
  product: ProductWithSeo;
  locale: AppLocale;
  canonicalUrl: string;
  localizedName: string;
  localizedDescription: string;
}) {
  const { product, locale, canonicalUrl, localizedName, localizedDescription } =
    params;

  const images = (product.photos ?? [])
    .map(photo => getNonEmptyString(photo))
    .filter((photo): photo is string => Boolean(photo));

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

type BuildProductStructuredDataParams = {
  product: ProductWithSeo;
  seoData: Pick<
    ProductSeoData,
    | 'categorySlug'
    | 'subcategorySlug'
    | 'productSlug'
    | 'categoryLabel'
    | 'subcategoryLabel'
  >;
  locale: AppLocale;
  siteUrl: string;
};

export function buildProductStructuredData({
  product,
  seoData,
  locale,
  siteUrl,
}: BuildProductStructuredDataParams) {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
  const canonicalUrl = buildProductUrl(
    normalizedSiteUrl,
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
      item: `${normalizedSiteUrl}/${locale}`,
    },
    {
      name: copy.breadcrumbs.allProducts,
      item: `${normalizedSiteUrl}/${locale}/all-products`,
    },
    {
      name: seoData.categoryLabel,
      item: `${normalizedSiteUrl}/${locale}/all-products/${seoData.categorySlug}`,
    },
    {
      name: seoData.subcategoryLabel,
      item: `${normalizedSiteUrl}/${locale}/all-products/${seoData.categorySlug}/${seoData.subcategorySlug}`,
    },
    {
      name: localizedName,
      item: canonicalUrl,
    },
  ]);

  return {
    canonicalUrl,
    localizedName,
    localizedDescription,
    productJsonLd,
    breadcrumbJsonLd,
  };
}

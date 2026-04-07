import type { Metadata } from 'next';

import { type AppLocale, SUPPORTED_LOCALES } from '@i18n/config';

type SeoText = Record<string, string>;

export type SearchParams = {
  title?: string;
  manufacturer?: string;
  condition?: string;
  page?: string;
  category?: string | string[];
  industry?: string | string[];
};

type SeoSubcategory = {
  slug: string;
  updatedAt?: string;
  seo?: {
    title?: SeoText;
    description?: SeoText;
  };
};

type SeoCategory = {
  slug: string;
  updatedAt?: string;
  seo?: {
    title?: SeoText;
    description?: SeoText;
  };
  subcategories?: SeoSubcategory[];
};

function getApiUrl() {
  return (
    process.env.API_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
    ''
  );
}

function getSiteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, '') ?? 'https://www.mmsweden.se';
}

function getLocalizedSeoText(
  value: SeoText | undefined,
  locale: AppLocale,
  fallback: string
) {
  if (!value) return fallback;
  return value[locale] || value.en || Object.values(value)[0] || fallback;
}

export function normalizeArray(value?: string | string[]) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function getSeoCategories(): Promise<SeoCategory[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) return [];

  const res = await fetch(`${apiUrl}/seo-categories/tree?activeOnly=true`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  return res.json();
}

export async function buildCategoryMetadata({
  locale,
  categorySlug,
}: {
  locale: AppLocale;
  categorySlug: string;
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const categories = await getSeoCategories();
  const category = categories.find(item => item.slug === categorySlug);

  const fallbackTitle = 'All Products | Meat Machines';
  const fallbackDescription = 'Used food processing and packaging equipment.';

  const title = getLocalizedSeoText(
    category?.seo?.title,
    locale,
    fallbackTitle
  );

  const description = getLocalizedSeoText(
    category?.seo?.description,
    locale,
    fallbackDescription
  );

  const canonical = `${siteUrl}/${locale}/all-products/${categorySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...SUPPORTED_LOCALES.map(l => [
          l,
          `${siteUrl}/${l}/all-products/${categorySlug}`,
        ]),
        ['x-default', `${siteUrl}/en/all-products/${categorySlug}`],
      ]),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function buildSubcategoryMetadata({
  locale,
  categorySlug,
  subcategorySlug,
}: {
  locale: AppLocale;
  categorySlug: string;
  subcategorySlug: string;
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const categories = await getSeoCategories();
  const category = categories.find(item => item.slug === categorySlug);
  const subcategory = category?.subcategories?.find(
    item => item.slug === subcategorySlug
  );

  const fallbackTitle = 'All Products | Meat Machines';
  const fallbackDescription = 'Used food processing and packaging equipment.';

  const title = getLocalizedSeoText(
    subcategory?.seo?.title,
    locale,
    getLocalizedSeoText(category?.seo?.title, locale, fallbackTitle)
  );

  const description = getLocalizedSeoText(
    subcategory?.seo?.description,
    locale,
    getLocalizedSeoText(category?.seo?.description, locale, fallbackDescription)
  );

  const canonical = `${siteUrl}/${locale}/all-products/${categorySlug}/${subcategorySlug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries([
        ...SUPPORTED_LOCALES.map(l => [
          l,
          `${siteUrl}/${l}/all-products/${categorySlug}/${subcategorySlug}`,
        ]),
        [
          'x-default',
          `${siteUrl}/en/all-products/${categorySlug}/${subcategorySlug}`,
        ],
      ]),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

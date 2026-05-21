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

type SeoDocument = {
  slug: string;
  name?: SeoText;
  updatedAt?: string;
  seo?: {
    title?: SeoText;
    description?: SeoText;
    h1?: SeoText;
  };
  content?: {
    intro?: SeoText;
  };
};

export type CategorySeoData = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  exists: boolean;
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

function slugToLabel(slug: string) {
  return slug
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeArray(value?: string | string[]) {
  if (!value) return [];

  return Array.isArray(value) ? value : [value];
}

async function getSeoCategoryBySlug(
  categorySlug: string
): Promise<SeoDocument | null> {
  const apiUrl = getApiUrl();

  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/seo-categories/${categorySlug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

async function getSeoSubcategoryBySlug({
  categorySlug,
  subcategorySlug,
}: {
  categorySlug: string;
  subcategorySlug: string;
}): Promise<SeoDocument | null> {
  const apiUrl = getApiUrl();

  if (!apiUrl) return null;

  try {
    const res = await fetch(
      `${apiUrl}/seo-categories/${categorySlug}/${subcategorySlug}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

function buildSeoData({
  document,
  locale,
  fallbackSlug,
}: {
  document: SeoDocument | null;
  locale: AppLocale;
  fallbackSlug: string;
}): CategorySeoData {
  const fallbackH1 = getLocalizedSeoText(
    document?.name,
    locale,
    slugToLabel(fallbackSlug)
  );

  const h1 = getLocalizedSeoText(document?.seo?.h1, locale, fallbackH1);

  const title = getLocalizedSeoText(
    document?.seo?.title,
    locale,
    `${h1} | MM Sweden`
  );

  const description = getLocalizedSeoText(
    document?.seo?.description,
    locale,
    'Used food processing and packaging equipment.'
  );

  const intro = getLocalizedSeoText(document?.content?.intro, locale, '');

  return {
    title,
    description,
    h1,
    intro,
    exists: Boolean(document),
  };
}

function buildNotFoundMetadata(type: 'Category' | 'Subcategory'): Metadata {
  return {
    title: `${type} Not Found | MM Sweden`,
    description: `The requested ${type.toLowerCase()} could not be found.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export async function getCategorySeoData({
  locale,
  categorySlug,
}: {
  locale: AppLocale;
  categorySlug: string;
}): Promise<CategorySeoData> {
  const category = await getSeoCategoryBySlug(categorySlug);

  return buildSeoData({
    document: category,
    locale,
    fallbackSlug: categorySlug,
  });
}

export async function getSubcategorySeoData({
  locale,
  categorySlug,
  subcategorySlug,
}: {
  locale: AppLocale;
  categorySlug: string;
  subcategorySlug: string;
}): Promise<CategorySeoData> {
  const subcategory = await getSeoSubcategoryBySlug({
    categorySlug,
    subcategorySlug,
  });

  return buildSeoData({
    document: subcategory,
    locale,
    fallbackSlug: subcategorySlug,
  });
}

export async function buildCategoryMetadata({
  locale,
  categorySlug,
}: {
  locale: AppLocale;
  categorySlug: string;
}): Promise<Metadata> {
  const siteUrl = getSiteUrl();
  const seo = await getCategorySeoData({ locale, categorySlug });

  if (!seo.exists) {
    return buildNotFoundMetadata('Category');
  }

  const canonical = `${siteUrl}/${locale}/all-products/${categorySlug}`;

  return {
    title: seo.title,
    description: seo.description,
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
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
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

  const seo = await getSubcategorySeoData({
    locale,
    categorySlug,
    subcategorySlug,
  });

  if (!seo.exists) {
    return buildNotFoundMetadata('Subcategory');
  }

  const canonical = `${siteUrl}/${locale}/all-products/${categorySlug}/${subcategorySlug}`;

  return {
    title: seo.title,
    description: seo.description,
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
      title: seo.title,
      description: seo.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

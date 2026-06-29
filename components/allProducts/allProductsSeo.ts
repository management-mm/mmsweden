import type { Metadata } from 'next';

import type { AppLocale } from '@i18n/config';
import { createPageMetadata } from '@i18n/seo';

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
    'https://mmsweden-server.onrender.com'
  );
}

function isMongoObjectId(value: string) {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function normalizeSlug(slug: string) {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

function encodeSlug(slug: string) {
  return encodeURIComponent(normalizeSlug(slug));
}

function getLocalizedSeoText(
  value: SeoText | undefined,
  locale: AppLocale,
  fallback: string
) {
  if (!value) {
    return fallback;
  }

  return value[locale] || value.en || Object.values(value)[0] || fallback;
}

function slugToLabel(slug: string) {
  return normalizeSlug(slug)
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeArray(value?: string | string[]) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function hasNonIndexableSearchParams(searchParams?: SearchParams) {
  if (!searchParams) {
    return false;
  }

  return (
    !!searchParams.title ||
    !!searchParams.manufacturer ||
    !!searchParams.condition ||
    !!searchParams.page ||
    normalizeArray(searchParams.category).length > 0 ||
    normalizeArray(searchParams.industry).length > 0
  );
}

async function fetchSeoDocument(url: string): Promise<SeoDocument | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
}

async function getSeoCategoryBySlug(
  categorySlug: string
): Promise<SeoDocument | null> {
  const apiUrl = getApiUrl();
  const normalizedCategorySlug = normalizeSlug(categorySlug);

  if (!normalizedCategorySlug || isMongoObjectId(normalizedCategorySlug)) {
    return null;
  }

  return fetchSeoDocument(
    `${apiUrl}/seo-categories/${encodeSlug(normalizedCategorySlug)}`
  );
}

async function getSeoSubcategoryBySlug({
  categorySlug,
  subcategorySlug,
}: {
  categorySlug: string;
  subcategorySlug: string;
}): Promise<SeoDocument | null> {
  const apiUrl = getApiUrl();

  const normalizedCategorySlug = normalizeSlug(categorySlug);
  const normalizedSubcategorySlug = normalizeSlug(subcategorySlug);

  if (
    !normalizedCategorySlug ||
    !normalizedSubcategorySlug ||
    isMongoObjectId(normalizedCategorySlug) ||
    isMongoObjectId(normalizedSubcategorySlug)
  ) {
    return null;
  }

  return fetchSeoDocument(
    `${apiUrl}/seo-categories/${encodeSlug(
      normalizedCategorySlug
    )}/${encodeSlug(normalizedSubcategorySlug)}`
  );
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
  const normalizedFallbackSlug = normalizeSlug(fallbackSlug);

  const fallbackH1 = getLocalizedSeoText(
    document?.name,
    locale,
    slugToLabel(normalizedFallbackSlug)
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
    'Used food processing and packaging equipment from MM Sweden.'
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
  const normalizedCategorySlug = normalizeSlug(categorySlug);
  const category = await getSeoCategoryBySlug(normalizedCategorySlug);

  return buildSeoData({
    document: category,
    locale,
    fallbackSlug: normalizedCategorySlug,
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
  const normalizedCategorySlug = normalizeSlug(categorySlug);
  const normalizedSubcategorySlug = normalizeSlug(subcategorySlug);

  const subcategory = await getSeoSubcategoryBySlug({
    categorySlug: normalizedCategorySlug,
    subcategorySlug: normalizedSubcategorySlug,
  });

  return buildSeoData({
    document: subcategory,
    locale,
    fallbackSlug: normalizedSubcategorySlug,
  });
}

export async function buildCategoryMetadata({
  locale,
  categorySlug,
  searchParams,
}: {
  locale: AppLocale;
  categorySlug: string;
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const normalizedCategorySlug = normalizeSlug(categorySlug);

  if (!normalizedCategorySlug || isMongoObjectId(normalizedCategorySlug)) {
    return buildNotFoundMetadata('Category');
  }

  const seo = await getCategorySeoData({
    locale,
    categorySlug: normalizedCategorySlug,
  });

  if (!seo.exists) {
    return buildNotFoundMetadata('Category');
  }

  return createPageMetadata({
    locale,
    path: `/all-products/${encodeSlug(normalizedCategorySlug)}`,
    title: seo.title,
    description: seo.description,
    noIndex: hasNonIndexableSearchParams(searchParams),
  });
}

export async function buildSubcategoryMetadata({
  locale,
  categorySlug,
  subcategorySlug,
  searchParams,
}: {
  locale: AppLocale;
  categorySlug: string;
  subcategorySlug: string;
  searchParams?: SearchParams;
}): Promise<Metadata> {
  const normalizedCategorySlug = normalizeSlug(categorySlug);
  const normalizedSubcategorySlug = normalizeSlug(subcategorySlug);

  if (
    !normalizedCategorySlug ||
    !normalizedSubcategorySlug ||
    isMongoObjectId(normalizedCategorySlug) ||
    isMongoObjectId(normalizedSubcategorySlug)
  ) {
    return buildNotFoundMetadata('Subcategory');
  }

  const seo = await getSubcategorySeoData({
    locale,
    categorySlug: normalizedCategorySlug,
    subcategorySlug: normalizedSubcategorySlug,
  });

  if (!seo.exists) {
    return buildNotFoundMetadata('Subcategory');
  }

  return createPageMetadata({
    locale,
    path: `/all-products/${encodeSlug(normalizedCategorySlug)}/${encodeSlug(
      normalizedSubcategorySlug
    )}`,
    title: seo.title,
    description: seo.description,
    noIndex: hasNonIndexableSearchParams(searchParams),
  });
}

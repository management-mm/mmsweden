import { cache } from 'react';

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

function getApiUrl(): string {
  return (
    process.env.API_URL?.replace(/\/$/, '') ??
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
    'https://mmsweden-server.onrender.com'
  );
}

function isMongoObjectId(value: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(value);
}

function normalizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).trim();
  } catch {
    return slug.trim();
  }
}

function encodeSlug(slug: string): string {
  return encodeURIComponent(normalizeSlug(slug));
}

function isSeoText(value: unknown): value is SeoText {
  if (!isRecord(value)) {
    return false;
  }

  return Object.values(value).every(item => typeof item === 'string');
}

function parseSeoDocument(value: unknown, url: string): SeoDocument {
  if (!isRecord(value)) {
    throw new Error(`Invalid SEO response from "${url}": expected an object`);
  }

  const slug = getNonEmptyString(value.slug);

  if (!slug) {
    throw new Error(`Invalid SEO response from "${url}": missing a valid slug`);
  }

  const document: SeoDocument = {
    slug,
  };

  if (isSeoText(value.name)) {
    document.name = value.name;
  }

  const updatedAt = getNonEmptyString(value.updatedAt);

  if (updatedAt) {
    document.updatedAt = updatedAt;
  }

  if (isRecord(value.seo)) {
    const seo: NonNullable<SeoDocument['seo']> = {};

    if (isSeoText(value.seo.title)) {
      seo.title = value.seo.title;
    }

    if (isSeoText(value.seo.description)) {
      seo.description = value.seo.description;
    }

    if (isSeoText(value.seo.h1)) {
      seo.h1 = value.seo.h1;
    }

    if (Object.keys(seo).length > 0) {
      document.seo = seo;
    }
  }

  if (isRecord(value.content)) {
    const content: NonNullable<SeoDocument['content']> = {};

    if (isSeoText(value.content.intro)) {
      content.intro = value.content.intro;
    }

    if (Object.keys(content).length > 0) {
      document.content = content;
    }
  }

  return document;
}

function getLocalizedSeoText(
  value: SeoText | undefined,
  locale: AppLocale,
  fallback: string
): string {
  if (!value) {
    return fallback;
  }

  const candidates = [value[locale], value.en, ...Object.values(value)];

  for (const candidate of candidates) {
    const normalizedCandidate = getNonEmptyString(candidate);

    if (normalizedCandidate) {
      return normalizedCandidate;
    }
  }

  return fallback;
}

function slugToLabel(slug: string): string {
  return normalizeSlug(slug)
    .split('-')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function normalizeArray(value?: string | string[]): string[] {
  if (!value) {
    return [];
  }

  const values = Array.isArray(value) ? value : [value];

  return values
    .map(item => item.trim())
    .filter((item): item is string => item.length > 0);
}

function hasNonIndexableSearchParams(searchParams?: SearchParams): boolean {
  if (!searchParams) {
    return false;
  }

  const pageNumber = Number(searchParams.page);
  const hasPagination = Number.isFinite(pageNumber) && pageNumber > 1;

  return (
    Boolean(getNonEmptyString(searchParams.title)) ||
    Boolean(getNonEmptyString(searchParams.manufacturer)) ||
    Boolean(getNonEmptyString(searchParams.condition)) ||
    hasPagination ||
    normalizeArray(searchParams.category).length > 0 ||
    normalizeArray(searchParams.industry).length > 0
  );
}

async function fetchSeoDocument(url: string): Promise<SeoDocument | null> {
  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (response.status === 404 || response.status === 410) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch SEO document from "${url}": ${response.status} ${response.statusText}`
    );
  }

  const data: unknown = await response.json();

  return parseSeoDocument(data, url);
}

const getSeoCategoryBySlug = cache(
  async (categorySlug: string): Promise<SeoDocument | null> => {
    const normalizedCategorySlug = normalizeSlug(categorySlug);

    if (!normalizedCategorySlug || isMongoObjectId(normalizedCategorySlug)) {
      return null;
    }

    return fetchSeoDocument(
      `${getApiUrl()}/seo-categories/${encodeSlug(normalizedCategorySlug)}`
    );
  }
);

const getSeoSubcategoryBySlug = cache(
  async (
    categorySlug: string,
    subcategorySlug: string
  ): Promise<SeoDocument | null> => {
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
      `${getApiUrl()}/seo-categories/${encodeSlug(
        normalizedCategorySlug
      )}/${encodeSlug(normalizedSubcategorySlug)}`
    );
  }
);

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
    exists: document !== null,
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

  const subcategory = await getSeoSubcategoryBySlug(
    normalizedCategorySlug,
    normalizedSubcategorySlug
  );

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

import { describe, expect, it } from 'vitest';

import {
  buildNotFoundProductMetadata,
  buildProductMetadata,
} from '../../utils/buildProductMetadata';
import type {
  ProductSeoData,
  ProductWithSeo,
} from '../../utils/resolveProductSeoData';

const multilingual = (value: string) => ({
  en: value,
  sv: value,
  de: value,
  fr: value,
  es: value,
  ru: value,
  uk: value,
  pl: value,
});

const createProduct = (
  overrides: Partial<ProductWithSeo> = {}
): ProductWithSeo => ({
  _id: '507f1f77bcf86cd799439011',
  name: multilingual('Hobart H600 Mixer'),
  slug: 'hobart-h600-mixer',
  idNumber: 'MM-1001',
  description: multilingual('Industrial mixer'),
  dimensions: '',
  photos: ['https://cdn.example.com/hobart-h600.webp'],
  video: '',
  category: multilingual('Food processing'),
  manufacturer: 'Hobart',
  industries: [multilingual('Food industry')],
  condition: 'used',
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  deletionDate: null,
  seoCategorySlug: 'food-processing-machines',
  seoSubcategorySlug: 'industrial-mixers',
  productCategory: multilingual('Mixers'),
  ...overrides,
});

const seoData: ProductSeoData = {
  categorySlug: 'food-processing-machines',
  subcategorySlug: 'industrial-mixers',
  productSlug: 'hobart-h600-mixer',
  categoryLabel: 'Food Processing Machines',
  subcategoryLabel: 'Industrial Mixers',
  hasCanonicalPath: true,
  shouldRedirect: false,
};

describe('buildProductMetadata', () => {
  it('builds canonical, hreflang and x-default URLs', () => {
    const metadata = buildProductMetadata({
      product: createProduct(),
      seoData,
      locale: 'sv',
      siteUrl: 'https://www.mmsweden.se/',
    });

    expect(metadata.alternates?.canonical).toBe(
      'https://www.mmsweden.se/sv/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer'
    );

    expect(metadata.alternates?.languages).toMatchObject({
      en: 'https://www.mmsweden.se/en/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      sv: 'https://www.mmsweden.se/sv/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      de: 'https://www.mmsweden.se/de/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      fr: 'https://www.mmsweden.se/fr/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      es: 'https://www.mmsweden.se/es/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      ru: 'https://www.mmsweden.se/ru/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      uk: 'https://www.mmsweden.se/uk/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      pl: 'https://www.mmsweden.se/pl/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      'x-default':
        'https://www.mmsweden.se/en/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
    });
  });

  it('builds localized title, description and social image metadata', () => {
    const metadata = buildProductMetadata({
      product: createProduct(),
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });

    expect(metadata.title).toBe('Used Hobart H600 Mixer For Sale | MM Sweden');
    expect(metadata.description).toBe('Industrial mixer');
    expect(metadata.robots).toMatchObject({
      index: true,
      follow: true,
    });
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://cdn.example.com/hobart-h600.webp',
        width: 1200,
        height: 630,
        alt: 'Hobart H600 Mixer',
      },
    ]);
    expect(metadata.twitter?.images).toEqual([
      'https://cdn.example.com/hobart-h600.webp',
    ]);
  });

  it('keeps sold equipment indexed but does not advertise it for sale', () => {
    const metadata = buildProductMetadata({
      product: createProduct({ deletionDate: new Date('2026-10-01') }),
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });

    expect(metadata.title).toBe('Sold: Hobart H600 Mixer | MM Sweden');
    expect(metadata.description).toContain('has been sold');
    expect(metadata.openGraph?.title).toBe(metadata.title);
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
  });

  it('uses the actual description instead of generic sales copy', () => {
    const product = createProduct({
      description: {
        ...multilingual('Industrial mixer'),
        en: 'Industrial mixer with a stainless-steel bowl and variable speeds.',
      },
    });
    const metadata = buildProductMetadata({
      product,
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });
    expect(metadata.description).toBe(
      'Industrial mixer with a stainless-steel bowl and variable speeds.'
    );
  });

  it('adds verified brand, model, year and capacity without guessing missing data', () => {
    const product = createProduct({
      name: multilingual('Angle grinder'),
      manufacturer: 'Seydelmann',
      model: 'AE 130',
      yearOfManufacture: 2007,
      capacity: '4,500 kg/h',
    });
    const metadata = buildProductMetadata({
      product,
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });
    expect(metadata.title).toBe(
      'Used Seydelmann AE 130 Angle grinder, 2007, 4,500 kg/h For Sale | MM Sweden'
    );
  });

  it('does not repeat existing model or brand in title', () => {
    const product = createProduct({
      model: 'H600',
      yearOfManufacture: 'unknown',
    });
    const metadata = buildProductMetadata({
      product,
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });
    expect(metadata.title).toBe('Used Hobart H600 Mixer For Sale | MM Sweden');
  });

  it('avoids gender-specific adjectives for German and Polish equipment names', () => {
    const product = createProduct({
      name: multilingual('Stainless steel table'),
    });
    const german = buildProductMetadata({
      product,
      seoData,
      locale: 'de',
      siteUrl: 'https://www.mmsweden.se',
    });
    const polish = buildProductMetadata({
      product,
      seoData,
      locale: 'pl',
      siteUrl: 'https://www.mmsweden.se',
    });
    expect(german.title).toContain('gebraucht kaufen');
    expect(polish.title).toContain('sprzęt używany');
  });

  it('uses a localized fallback when an individual description translation is missing', () => {
    const product = createProduct({
      description: { ...multilingual('Industrial mixer'), sv: '' },
    });
    const metadata = buildProductMetadata({
      product,
      seoData,
      locale: 'sv',
      siteUrl: 'https://www.mmsweden.se',
    });
    expect(metadata.description).toContain('Se');
    expect(metadata.description).not.toContain('Industrial mixer.');
  });

  it('returns noindex metadata for a missing product', () => {
    const metadata = buildNotFoundProductMetadata();

    expect(metadata).toMatchObject({
      title: 'Product Not Found | MM Sweden',
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});

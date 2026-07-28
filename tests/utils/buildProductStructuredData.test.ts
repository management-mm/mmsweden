import { describe, expect, it } from 'vitest';

import {
  buildProductStructuredData,
  serializeJsonLd,
} from '../../utils/buildProductStructuredData';
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
  photos: [
    'https://www.mmsweden.se/images/hobart-1.webp',
    '  ',
    ' https://www.mmsweden.se/images/hobart-2.webp ',
  ],
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

const seoData: Pick<
  ProductSeoData,
  | 'categorySlug'
  | 'subcategorySlug'
  | 'productSlug'
  | 'categoryLabel'
  | 'subcategoryLabel'
> = {
  categorySlug: 'food-processing-machines',
  subcategorySlug: 'industrial-mixers',
  productSlug: 'hobart-h600-mixer',
  categoryLabel: 'Food Processing Machines',
  subcategoryLabel: 'Industrial Mixers',
};

describe('buildProductStructuredData', () => {
  it('builds Product JSON-LD for a used product', () => {
    const result = buildProductStructuredData({
      product: createProduct(),
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se/',
    });

    expect(result.productJsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Hobart H600 Mixer',
      description: 'Industrial mixer',
      sku: 'MM-1001',
      productID: 'MM-1001',
      image: [
        'https://www.mmsweden.se/images/hobart-1.webp',
        'https://www.mmsweden.se/images/hobart-2.webp',
      ],
      brand: {
        '@type': 'Brand',
        name: 'Hobart',
      },
      itemCondition: 'https://schema.org/UsedCondition',
      url: 'https://www.mmsweden.se/en/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
      inLanguage: 'en',
    });
  });

  it('uses NewCondition for a new product', () => {
    const result = buildProductStructuredData({
      product: createProduct({ condition: 'new' }),
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });

    expect(result.productJsonLd.itemCondition).toBe(
      'https://schema.org/NewCondition'
    );
  });

  it('omits empty optional Product fields after serialization', () => {
    const result = buildProductStructuredData({
      product: createProduct({
        idNumber: '   ',
        manufacturer: '',
        photos: ['', '   '],
      }),
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se',
    });

    const serializedProduct = JSON.parse(
      serializeJsonLd(result.productJsonLd)
    ) as Record<string, unknown>;

    expect(serializedProduct).not.toHaveProperty('sku');
    expect(serializedProduct).not.toHaveProperty('productID');
    expect(serializedProduct).not.toHaveProperty('brand');
    expect(serializedProduct).not.toHaveProperty('image');
  });

  it('builds ordered BreadcrumbList JSON-LD', () => {
    const result = buildProductStructuredData({
      product: createProduct(),
      seoData,
      locale: 'en',
      siteUrl: 'https://www.mmsweden.se/',
    });

    expect(result.breadcrumbJsonLd).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://www.mmsweden.se/en',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'All Products',
          item: 'https://www.mmsweden.se/en/all-products',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Food Processing Machines',
          item: 'https://www.mmsweden.se/en/all-products/food-processing-machines',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Industrial Mixers',
          item: 'https://www.mmsweden.se/en/all-products/food-processing-machines/industrial-mixers',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Hobart H600 Mixer',
          item: 'https://www.mmsweden.se/en/all-products/food-processing-machines/industrial-mixers/hobart-h600-mixer',
        },
      ],
    });
  });

  it('escapes unsafe characters when serializing JSON-LD', () => {
    const serialized = serializeJsonLd({
      value: '<script>\u2028separator\u2029',
    });

    expect(serialized).not.toContain('<script>');
    expect(serialized).toContain('\\u003cscript>');
    expect(serialized).toContain('\\u2028');
    expect(serialized).toContain('\\u2029');
  });
});

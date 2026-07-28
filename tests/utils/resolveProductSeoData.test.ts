import { describe, expect, it } from 'vitest';

import {
  type ProductWithSeo,
  resolveProductSeoData,
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
  photos: [],
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

describe('resolveProductSeoData', () => {
  it('uses canonical product slugs and requests redirect for an outdated route', () => {
    const result = resolveProductSeoData(
      createProduct(),
      'en',
      'old-category',
      'old-subcategory',
      'old-product-slug'
    );

    expect(result).toMatchObject({
      categorySlug: 'food-processing-machines',
      subcategorySlug: 'industrial-mixers',
      productSlug: 'hobart-h600-mixer',
      hasCanonicalPath: true,
      shouldRedirect: true,
    });
  });

  it('does not request redirect when the route is already canonical', () => {
    const result = resolveProductSeoData(
      createProduct(),
      'en',
      'food-processing-machines',
      'industrial-mixers',
      'hobart-h600-mixer'
    );

    expect(result).toMatchObject({
      categorySlug: 'food-processing-machines',
      subcategorySlug: 'industrial-mixers',
      productSlug: 'hobart-h600-mixer',
      hasCanonicalPath: true,
      shouldRedirect: false,
    });
  });

  it('uses slugs from SEO objects when slug fields contain MongoDB ids', () => {
    const product = createProduct({
      seoCategorySlug: '507f1f77bcf86cd799439011',
      seoSubcategorySlug: '507f191e810c19729de860ea',
      seoCategory: {
        slug: 'food-processing-machines',
      },
      seoSubcategory: {
        slug: 'industrial-mixers',
      },
    });

    const result = resolveProductSeoData(
      product,
      'en',
      'food-processing-machines',
      'industrial-mixers',
      'hobart-h600-mixer'
    );

    expect(result).toMatchObject({
      categorySlug: 'food-processing-machines',
      subcategorySlug: 'industrial-mixers',
      productSlug: 'hobart-h600-mixer',
      hasCanonicalPath: true,
      shouldRedirect: false,
    });
  });

  it('marks the canonical path as missing when the category slug is unavailable', () => {
    const product = createProduct({
      seoCategorySlug: '',
      seoCategory: null,
    });

    const result = resolveProductSeoData(
      product,
      'en',
      'legacy-category',
      'industrial-mixers',
      'hobart-h600-mixer'
    );

    expect(result).toMatchObject({
      categorySlug: 'legacy-category',
      subcategorySlug: 'industrial-mixers',
      productSlug: 'hobart-h600-mixer',
      hasCanonicalPath: false,
      shouldRedirect: false,
    });
  });

  it('normalizes whitespace in canonical slugs', () => {
    const product = createProduct({
      seoCategorySlug: '  food-processing-machines  ',
      seoSubcategorySlug: ' industrial-mixers ',
      slug: ' hobart-h600-mixer ',
    });

    const result = resolveProductSeoData(
      product,
      'en',
      'food-processing-machines',
      'industrial-mixers',
      'hobart-h600-mixer'
    );

    expect(result).toMatchObject({
      categorySlug: 'food-processing-machines',
      subcategorySlug: 'industrial-mixers',
      productSlug: 'hobart-h600-mixer',
      hasCanonicalPath: true,
      shouldRedirect: false,
    });
  });

  it('returns localized category and subcategory labels', () => {
    const product = createProduct({
      seoCategory: {
        slug: 'food-processing-machines',
        name: {
          en: 'Food Processing Machines',
          sv: 'Livsmedelsmaskiner',
        },
      },
      seoSubcategory: {
        slug: 'industrial-mixers',
        name: {
          en: 'Industrial Mixers',
          sv: 'Industriblandare',
        },
      },
    });

    const result = resolveProductSeoData(
      product,
      'sv',
      'food-processing-machines',
      'industrial-mixers',
      'hobart-h600-mixer'
    );

    expect(result.categoryLabel).toBe('Livsmedelsmaskiner');
    expect(result.subcategoryLabel).toBe('Industriblandare');
  });

  it('falls back to English labels when the requested locale is unavailable', () => {
    const product = createProduct({
      seoCategory: {
        slug: 'food-processing-machines',
        name: {
          en: 'Food Processing Machines',
        },
      },
      seoSubcategory: {
        slug: 'industrial-mixers',
        name: {
          en: 'Industrial Mixers',
        },
      },
    });

    const result = resolveProductSeoData(
      product,
      'de',
      'food-processing-machines',
      'industrial-mixers',
      'hobart-h600-mixer'
    );

    expect(result.categoryLabel).toBe('Food Processing Machines');
    expect(result.subcategoryLabel).toBe('Industrial Mixers');
  });
});

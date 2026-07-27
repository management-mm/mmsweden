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

describe('resolveProductSeoData', () => {
  it('uses canonical product slugs and requests redirect for an outdated route', () => {
    const product: ProductWithSeo = {
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
    };

    const result = resolveProductSeoData(
      product,
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
});

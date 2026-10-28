export type Locale = 'en' | 'sv' | 'de' | 'fr' | 'es' | 'ru' | 'uk' | 'pl';

export type MultiLanguageString = Record<Locale, string>;

export interface IProduct {
  _id: string;
  name: MultiLanguageString | string;
  slug: string;
  idNumber: string;
  description: MultiLanguageString;
  dimensions: string;
  photos: string[];
  video: string;
  category: MultiLanguageString;
  manufacturer: string;
  // Optional structured specifications. Only output when provided by the API.
  model?: string | null;
  yearOfManufacture?: number | string | null;
  capacity?: string | null;
  industries: MultiLanguageString[];
  condition: 'used' | 'new';
  createdAt: Date;
  deletionDate: Date | null;
  seoCategorySlug: string;
  seoSubcategorySlug: string;
  productCategory: MultiLanguageString;
  seoSubcategoryId?: string;
  seoCategoryId?: string;
  productCategoryId?: string;
  notes?: string;
  isDraft?: boolean;
}

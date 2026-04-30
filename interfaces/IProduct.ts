import { AppLocale } from '@i18n/config';

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

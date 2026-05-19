import type { IProduct, MultiLanguageString } from '@interfaces/IProduct';

const emptyMultiLanguageString: MultiLanguageString = {
  en: '',
  sv: '',
  de: '',
  fr: '',
  es: '',
  ru: '',
  uk: '',
  pl: '',
};

export const skeletonProduct: IProduct = {
  _id: 'skeleton',
  slug: 'skeleton',
  name: emptyMultiLanguageString,
  idNumber: '',
  description: emptyMultiLanguageString,
  dimensions: '',
  photos: [],
  video: '',
  category: emptyMultiLanguageString,
  manufacturer: '',
  industries: [],
  condition: 'used',
  deletionDate: null,
  createdAt: new Date(),
  seoCategorySlug: '',
  seoSubcategorySlug: '',
  productCategory: emptyMultiLanguageString,
};

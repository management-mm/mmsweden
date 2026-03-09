import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';

import findTranslation from './findTranslation';

import { AppLocale } from '@i18n/config';

const getFilterValueTranslation = (
  filter: {
    value: string;
    filterName: 'category' | 'industry' | 'manufacturer' | 'condition';
  },
  categories: ICategory[],
  industries: IIndustry[],
  language: AppLocale
) => {
  const { filterName, value } = filter;

  const itemCollections = {
    category: categories,
    industry: industries,
  };

  const items = itemCollections[filterName as 'category' | 'industry'];

  return items ? findTranslation(items, value, language) : value;
};

export default getFilterValueTranslation;

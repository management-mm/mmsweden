import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';

import getProductName from './getProductName';

import { filters } from '@enums/filters';

import { AppLocale, DEFAULT_LOCALE } from '@i18n/config';

const getFilterItemName = (
  filterName: string,
  item: ICategory | IManufacturer | IIndustry,
  language: AppLocale
): string => {
  if (filterName === filters.Manufacturer) {
    return String(item.name ?? '');
  }

  return (
    getProductName(item.name, language) ??
    getProductName(item.name, DEFAULT_LOCALE) ??
    ''
  );
};

export default getFilterItemName;

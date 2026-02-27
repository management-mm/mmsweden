import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';

import getProductName from './getProductName';

import { filters } from '@enums/filters';
import type { LanguageKeys } from '@enums/languageKeys';

const getFilterItemName = (
  filterName: string,
  item: ICategory | IManufacturer | IIndustry,
  language: LanguageKeys
): string => {
  return filterName === filters.Manufacturer
    ? String(item.name)
    : String(getProductName(item.name, language));
};

export default getFilterItemName;

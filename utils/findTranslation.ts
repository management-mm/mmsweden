import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';

import { AppLocale } from '@i18n/config';

const findTranslation = (
  items: IIndustry[] | ICategory[],
  value: string,
  language: AppLocale
) => {
  const valueObject = items.find(item => item.name.en === value);
  return valueObject ? valueObject.name[language] : value;
};

export default findTranslation;

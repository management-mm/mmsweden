import type { MultiLanguageString } from '@interfaces/IProduct';

import { AppLocale } from '@i18n/config';

const getProductName = (
  name: MultiLanguageString | string,
  locale: AppLocale
) => (typeof name === 'object' ? name?.[locale] : name);

export default getProductName;

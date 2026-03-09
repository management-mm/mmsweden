import type { MultiLanguageString } from '@interfaces/IProduct';

import { AppLocale } from '@i18n/config';

const getProductName = (
  name: MultiLanguageString | string,
  language: AppLocale
) => (typeof name === 'object' ? name?.[language] : name);

export default getProductName;

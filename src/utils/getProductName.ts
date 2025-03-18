import type { MultiLanguageString } from '@interfaces/IProduct';

import type { LanguageKeys } from '@enums/languageKeys';

const getProductName = (
  name: MultiLanguageString | string,
  language: LanguageKeys
) => (typeof name === 'object' ? name?.[language] : name);

export default getProductName;

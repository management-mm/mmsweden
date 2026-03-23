import { IconId } from '@enums/iconsSpriteId';

import { AppLocale } from '@i18n/config';

export interface ILanguageOption {
  language: AppLocale;
  iconId: IconId;
}
const languageOptions: ILanguageOption[] = [
  {
    language: 'en',
    iconId: IconId.English,
  },
  {
    language: 'sv',
    iconId: IconId.Sweden,
  },
  {
    language: 'de',
    iconId: IconId.Germany,
  },
  {
    language: 'es',
    iconId: IconId.Spain,
  },
  {
    language: 'fr',
    iconId: IconId.France,
  },
  {
    language: 'ru',
    iconId: IconId.Russia,
  },
  {
    language: 'uk',
    iconId: IconId.Ukraine,
  },
  {
    language: 'pl',
    iconId: IconId.Poland,
  },
];

export default languageOptions;

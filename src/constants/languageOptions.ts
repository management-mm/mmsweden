import { IconId } from '@enums/iconsSpriteId';
import { LanguageKeys } from '@enums/languageKeys';

export interface ILanguageOption {
  language: LanguageKeys;
  iconId: IconId;
}
const languageOptions: ILanguageOption[] = [
  {
    language: LanguageKeys.EN,
    iconId: IconId.English,
  },
  {
    language: LanguageKeys.SV,
    iconId: IconId.Sweden,
  },
  {
    language: LanguageKeys.DE,
    iconId: IconId.Germany,
  },
  {
    language: LanguageKeys.ES,
    iconId: IconId.Spain,
  },
  {
    language: LanguageKeys.FR,
    iconId: IconId.France,
  },
  {
    language: LanguageKeys.RU,
    iconId: IconId.Russia,
  },
  {
    language: LanguageKeys.UK,
    iconId: IconId.Ukraine,
  },
];

export default languageOptions;

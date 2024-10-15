import type { LanguageKeys } from "@enums/languageKeys";
import type { MultiLanguageString } from "@interfaces/IProduct";

const getProductName = (name: MultiLanguageString | string, language: LanguageKeys) =>
  typeof name === 'object' ? name?.[language] : name;

export default getProductName;

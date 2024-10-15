import type { LanguageKeys } from "@enums/languageKeys";
import type { ICategory } from "@interfaces/ICategory";
import type { IIndustry } from "@interfaces/IIndustry";

const findTranslation = (
  items: IIndustry[] | ICategory[],
  value: string,
  language: LanguageKeys
) => {
  const valueObject = items.find(item => item.name.en === value);
  return valueObject ? valueObject.name[language] : value;
};

export default findTranslation;

import * as Yup from 'yup';

export const MultiLanguageSchema = Yup.object({
  en: Yup.string().trim().required(),
  de: Yup.string().trim().required(),
  sv: Yup.string().trim().required(),
  fr: Yup.string().trim().required(),
  ru: Yup.string().trim().required(),
  uk: Yup.string().trim().required(),
  es: Yup.string().trim().required(),
});

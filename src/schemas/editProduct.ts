import * as Yup from 'yup';

export const MultiLanguageSchema = Yup.object({
  en: Yup.string().required(),
  de: Yup.string().required(),
  fr: Yup.string().required(),
  sv: Yup.string().required(),
  es: Yup.string().required(),
  ru: Yup.string().required(),
  uk: Yup.string().required(),
});

export const schema = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.lazy(value =>
    typeof value === 'string' ? Yup.string() : MultiLanguageSchema
  ),
  idNumber: Yup.string().required(),
  description: Yup.lazy(value =>
    typeof value === 'string'
      ? Yup.string().required()
      : MultiLanguageSchema.required()
  ),
  dimensions: Yup.string().nullable().notRequired(),
  category: Yup.string().required(),
  manufacturer: Yup.string().notRequired(),
  industries: Yup.array().of(Yup.string()).notRequired(),
  condition: Yup.string()
    .oneOf(['used', 'new'], "Condition must be either 'used' or 'new'")
    .required(),
  video: Yup.string().nullable().notRequired(),
  photoQueue: Yup.array().of(Yup.mixed<File | string>()).notRequired(),
  photos: Yup.array().of(Yup.mixed<File>()).notRequired(),
  deletionDate: Yup.string().nullable().notRequired(),
  // shouldTranslateName: Yup.boolean()
});

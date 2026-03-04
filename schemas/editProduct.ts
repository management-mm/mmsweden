import * as Yup from 'yup';

export const MultiLanguageSchema = Yup.object({
  en: Yup.string().trim().required('English is required'),
  de: Yup.string().trim().notRequired(),
  fr: Yup.string().trim().notRequired(),
  sv: Yup.string().trim().notRequired(),
  es: Yup.string().trim().notRequired(),
  ru: Yup.string().trim().notRequired(),
  uk: Yup.string().trim().notRequired(),
})
  .nullable()
  .default(null);

export const schema = Yup.object().shape({
  id: Yup.string().notRequired(),

  name: Yup.lazy(value =>
    typeof value === 'string'
      ? Yup.string().trim().required('Name is required')
      : MultiLanguageSchema.required('Name is required')
  ),

  idNumber: Yup.string().trim().required('ID number is required'),

  description: Yup.lazy(value =>
    typeof value === 'string'
      ? Yup.string().trim().required('Description is required')
      : MultiLanguageSchema.required('Description is required')
  ),

  dimensions: Yup.string().nullable().notRequired(),

  category: Yup.string().trim().required('Category is required'),

  manufacturer: Yup.string().trim().notRequired(),

  industries: Yup.array().of(Yup.string().trim()).notRequired(),

  condition: Yup.string()
    .oneOf(['used', 'new'], "Condition must be either 'used' or 'new'")
    .required('Condition is required'),

  video: Yup.string().nullable().notRequired(),

  photoQueue: Yup.array().of(Yup.mixed<File | string>()).notRequired(),

  photos: Yup.array().of(Yup.mixed<File>()).notRequired(),

  deletionDate: Yup.string().nullable().notRequired(),

  shouldTranslateName: Yup.boolean().notRequired(),
});
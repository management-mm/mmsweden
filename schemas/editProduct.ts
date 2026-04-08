import * as Yup from 'yup';

const safeString = () =>
  Yup.mixed()
    .transform((v: unknown) => (typeof v === 'string' ? v.trim() : v))
    .nullable()
    .notRequired();

const multiLangOrString = Yup.mixed()
  .transform((v: unknown) => {
    if (typeof v === 'string') return v.trim();
    if (v && typeof v === 'object') return v;
    return v;
  })
  .nullable()
  .notRequired();

export const schema = Yup.object().shape({
  id: safeString(),

  name: multiLangOrString,
  description: multiLangOrString,
  category: multiLangOrString,

  idNumber: safeString(),
  autoGenerateId: Yup.boolean().notRequired(),
  dimensions: safeString(),
  manufacturer: safeString(),
  video: safeString(),

  industries: Yup.array().nullable().notRequired(),

  condition: Yup.mixed().nullable().notRequired(),

  photoQueue: Yup.array().nullable().notRequired(),
  photos: Yup.array().nullable().notRequired(),

  deletionDate: safeString(),
  shouldTranslateName: Yup.boolean().nullable().notRequired(),

  seoCategoryId: Yup.string(),
  seoSubcategoryId: Yup.string(),
  productCategoryId: Yup.string(),
});

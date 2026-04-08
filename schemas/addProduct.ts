import * as Yup from 'yup';

const safeString = () =>
  Yup.mixed()
    .transform((v: unknown) => (typeof v === 'string' ? v.trim() : v))
    .nullable()
    .notRequired();

export const schema = Yup.object().shape({
  name: Yup.string(),
  idNumber: Yup.string(),
  autoGenerateId: Yup.boolean().notRequired(),
  description: Yup.string(),
  dimensions: Yup.string(),
  category: Yup.string(),
  manufacturer: safeString(),
  industries: Yup.array(),
  condition: Yup.mixed().oneOf(
    ['used', 'new'],
    "Condition must be either 'used' or 'new'"
  ),
  video: safeString(),
  photos: Yup.array(),
  seoCategoryId: Yup.string(),
  seoSubcategoryId: Yup.string(),
  productCategoryId: Yup.string(),
});

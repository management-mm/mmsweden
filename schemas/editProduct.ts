import * as Yup from 'yup';

const safeString = () =>
  Yup.mixed()
    .transform(v => (typeof v === 'string' ? v.trim() : v))
    .nullable()
    .notRequired();

const multiLangOrString = Yup.mixed()
  .transform(v => {
    // если строка — trim
    if (typeof v === 'string') return v.trim();
    // если объект — оставляем как есть
    if (v && typeof v === 'object') return v;
    return v;
  })
  .nullable()
  .notRequired();

export const schema = Yup.object().shape({
  id: safeString(),

  name: multiLangOrString,
  description: multiLangOrString,
  category: multiLangOrString, // ✅ теперь может быть и строка и объект

  idNumber: safeString(),
  dimensions: safeString(),
  manufacturer: safeString(),
  video: safeString(),

  industries: Yup.array().nullable().notRequired(),

  condition: Yup.mixed().nullable().notRequired(),

  photoQueue: Yup.array().nullable().notRequired(),
  photos: Yup.array().nullable().notRequired(),

  deletionDate: safeString(),
  shouldTranslateName: Yup.boolean().nullable().notRequired(),
});

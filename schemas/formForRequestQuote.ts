import * as Yup from 'yup';

import { Error } from '@enums/i18nConstants';

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(30, Error.TooLong)
    .matches(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, Error.InvalidFormat)
    .required(Error.Required),
  phone: Yup.string()
    .trim()
    .matches(/^\+?[0-9\s\-()]{7,20}$/, Error.InvalidPhone)
    .required(Error.Required),
  countryPhone: Yup.string().trim().notRequired(),
  callingCode: Yup.string().notRequired(),
  email: Yup.string().trim().required(Error.Required).email(Error.InvalidEmail),
  country: Yup.string().trim().required(Error.Required),
  company: Yup.string().trim().notRequired(),
  message: Yup.string().trim().notRequired(),
  products: Yup.array().of(
    Yup.object().shape({
      idNumber: Yup.string().required(Error.Required),
      name: Yup.string().required(Error.Required),
      photo: Yup.string().required(Error.Required),
    })
  ),
});

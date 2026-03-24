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
  callingCode: Yup.string().trim().notRequired(),
  countryPhone: Yup.string().trim().notRequired(),
  email: Yup.string().trim().required().email(Error.InvalidEmail),
  description: Yup.string().trim().required(Error.Required),
  productName: Yup.string().trim().required(Error.Required),
  price: Yup.string().trim().required(Error.Required),
  photos: Yup.array().notRequired(),
});

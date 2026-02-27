import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().trim().max(30, 'Too Long!').required(),
  phone: Yup.string().trim().required(),
  callingCode: Yup.string().trim().notRequired(),
  countryPhone: Yup.string().trim().notRequired(),
  email: Yup.string().trim().required().email('Invalid email'),
  description: Yup.string().trim().required(),
  productName: Yup.string().trim().required(),
  price: Yup.string().trim().required(),
  photos: Yup.array().notRequired(),
});

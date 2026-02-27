import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(1, 'Too Short!')
    .max(30, 'Too Long!')
    .required(),
  phone: Yup.string().trim().required(),
  countryPhone: Yup.string().trim().notRequired(),
  callingCode: Yup.string().notRequired(),
  email: Yup.string().trim().required().email(),
  country: Yup.string().trim().required(),
  company: Yup.string().trim().notRequired(),
  message: Yup.string().trim().notRequired(),
  products: Yup.array().of(
    Yup.object().shape({
      idNumber: Yup.string().required('Product ID is required'),
      name: Yup.string().required('Product name is required'),
      photo: Yup.string().required("Product's photo is required"),
    })
  ),
});

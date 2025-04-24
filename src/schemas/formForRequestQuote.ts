import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(30, 'Too Long!').required(),
  phone: Yup.string().required(),
  countryPhone: Yup.string().required(),
  callingCode: Yup.string().required(),
  email: Yup.string().required().email(),
  country: Yup.string().required(),
  company: Yup.string().required(),
  message: Yup.string().required(),
  products: Yup.array().of(
    Yup.object().shape({
      idNumber: Yup.string().required('Product ID is required'),
      name: Yup.string().required('Product name is required'),
      photo: Yup.string().required("Product's photo is required"),
    })
  ),
});

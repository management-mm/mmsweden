import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(30, 'Too Long!').required(),
  phone: Yup.number().required(),
  email: Yup.string().required().email(),
  description: Yup.string().required(),
  productName: Yup.string().required(),
  price: Yup.string().required(),
});

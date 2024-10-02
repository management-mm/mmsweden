import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().min(1, 'Too Short!').max(30, 'Too Long!').required(),
  phone: Yup.string().required(),
  email: Yup.string().required().email(),
  subject: Yup.string().required(),
  message: Yup.string().required(),
});

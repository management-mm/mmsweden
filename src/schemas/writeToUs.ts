import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string().trim().max(30, 'Too Long!').required(),
  phone: Yup.string().trim().required(),
  email: Yup.string().trim().required().email(),
  subject: Yup.string().trim().notRequired(),
  message: Yup.string().trim().required(),
});

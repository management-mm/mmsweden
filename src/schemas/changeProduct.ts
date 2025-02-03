import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string(),
  idNumber: Yup.string(),
  description: Yup.object(),
  dimensions: Yup.string(),
  category: Yup.object(),
  manufacturer: Yup.string(),
  industries: Yup.string(),
  condition: Yup.string(),
  video: Yup.string(),
  photos: Yup.array(),
});

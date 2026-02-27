import * as Yup from 'yup';

export const schema = Yup.object().shape({
  name: Yup.string(),
  idNumber: Yup.string(),
  description: Yup.string(),
  dimensions: Yup.string(),
  category: Yup.string(),
  manufacturer: Yup.string(),
  industries: Yup.array(),
  condition: Yup.mixed().oneOf(
    ['used', 'new'],
    "Condition must be either 'used' or 'new'"
  ),
  video: Yup.string(),
  photos: Yup.array(),
});

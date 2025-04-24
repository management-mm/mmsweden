import * as Yup from 'yup';

import { MultiLanguageSchema } from './editProduct';

export const schema = Yup.object().shape({
  id: Yup.string().required(),
  name: Yup.lazy(value =>
    typeof value === 'string'
      ? Yup.string().required()
      : MultiLanguageSchema.required()
  ),
});

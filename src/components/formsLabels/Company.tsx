import { ErrorMessage } from 'formik';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Company = () => {
  return (
    <label className="flex flex-col gap-[2px]">
      <LabelTitle title={Label.Company} />
      <InputField name="company" placeholder={Placeholder.Company} />
      <ErrorMessage name="company">
        {msg => <div className="mt-1 text-sm text-red-500">{msg}</div>}
      </ErrorMessage>
    </label>
  );
};

export default Company;

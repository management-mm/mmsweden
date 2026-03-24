import { ErrorMessage } from 'formik';
import { useTranslations } from 'next-intl';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Company = () => {
  const t = useTranslations();
  return (
    <label className="flex flex-col gap-[2px]">
      <LabelTitle title={Label.Company} />
      <InputField name="company" placeholder={Placeholder.Company} />
      <ErrorMessage name="company">
        {msg => (
          <div className="mt-1 text-sm text-red-500">
            {t(msg, { field: t(Label.Company) })}
          </div>
        )}
      </ErrorMessage>
    </label>
  );
};

export default Company;

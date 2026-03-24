import { ErrorMessage } from 'formik';
import { useTranslations } from 'next-intl';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label } from '@enums/i18nConstants';

const Price = () => {
  const t = useTranslations();
  return (
    <label className="flex flex-col gap-[2px]">
      <div className="flex items-center gap-[2px]">
        <LabelTitle title={Label.Price} />
        <span className="text-red-700">*</span>
      </div>
      <InputField placeholder={Label.Price} required={true} name="price" />
      <ErrorMessage name="price">
        {msg => (
          <div className="mt-1 text-sm text-red-500">
            {t(msg, { field: t(Label.Price) })}
          </div>
        )}
      </ErrorMessage>
    </label>
  );
};

export default Price;

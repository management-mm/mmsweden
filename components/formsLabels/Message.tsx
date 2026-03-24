import { ErrorMessage } from 'formik';
import { useTranslations } from 'next-intl';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Message = () => {
  const t = useTranslations();
  return (
    <label className="flex flex-col gap-[2px]">
      <div className="flex items-center gap-[2px]">
        <LabelTitle title={Label.Message} />
        <span className="text-red-700">*</span>
      </div>
      <InputField
        name="message"
        as="textarea"
        placeholder={Placeholder.Message}
        className="h-[180px] rounded-[22px]"
      />
      <ErrorMessage name="message">
        {msg => (
          <div className="mt-1 text-sm text-red-500">
            {t(msg, { field: t(Label.Message) })}
          </div>
        )}
      </ErrorMessage>
    </label>
  );
};

export default Message;

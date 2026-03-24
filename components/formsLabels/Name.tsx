import type { FC } from 'react';

import { ErrorMessage } from 'formik';
import { useTranslations } from 'next-intl';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { cn } from '@utils/cn';

import { Label, Placeholder } from '@enums/i18nConstants';

interface INameProps {
  className?: string;
}

const Name: FC<INameProps> = ({ className }) => {
  const t = useTranslations();
  return (
    <label className={cn('flex flex-col gap-[2px]', className)}>
      <div className="flex items-center gap-[2px]">
        <LabelTitle title={Label.Name} />
        <span className="text-red-700">*</span>
      </div>
      <InputField placeholder={Placeholder.Name} name="name" required={true} />
      <ErrorMessage name="name">
        {msg => (
          <div className="mt-1 text-sm text-red-500">
            {t(msg, { field: t(Label.Name) })}
          </div>
        )}
      </ErrorMessage>
    </label>
  );
};

export default Name;

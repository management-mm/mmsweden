import type { FC } from 'react';

import { ErrorMessage } from 'formik';
import { useTranslations } from 'next-intl';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { cn } from '@utils/cn';

import { Label, Placeholder } from '@enums/i18nConstants';

interface ISubjectProps {
  className?: string;
}

const Subject: FC<ISubjectProps> = ({ className }) => {
  const t = useTranslations();
  return (
    <label className={cn('flex flex-col gap-[2px]', className)}>
      <LabelTitle title={Label.Subject} />
      <InputField name="subject" placeholder={Placeholder.Subject} />
      <ErrorMessage name="message">
        {msg => (
          <div className="mt-1 text-sm text-red-500">
            {t(msg, { field: t(Label.Subject) })}
          </div>
        )}
      </ErrorMessage>
    </label>
  );
};

export default Subject;

import type { FC } from 'react';

import { ErrorMessage } from 'formik';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { cn } from '@utils/cn';

import { Label, Placeholder } from '@enums/i18nConstants';

interface IEmailProps {
  className?: string;
}

const Email: FC<IEmailProps> = ({ className }) => {
  return (
    <label className={cn('flex flex-col gap-[2px]', className)}>
      <div className="flex items-center gap-[2px]">
        <LabelTitle title={Label.Email} />
        <span className="text-red-700">*</span>
      </div>
      <InputField
        placeholder={Placeholder.Email}
        type="email"
        name="email"
        // pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        title="Please enter a valid email address."
        required={true}
      />
      <ErrorMessage name="email">
        {msg => <div className="mt-1 text-sm text-red-500">{msg}</div>}
      </ErrorMessage>
    </label>
  );
};

export default Email;

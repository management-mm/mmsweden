import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Field } from 'formik';

import { cn } from '@utils/cn';

interface IInputField {
  type?: string;
  placeholder: string;
  name: string;
  required?: boolean;
  className?: string;
  pattern?: string;
  title?: string;
  as?: string;
}

const InputField: FC<IInputField> = ({
  type = 'text',
  placeholder,
  name,
  required = true,
  className = '',
  pattern = '*.',
  title = '',
  as = 'input',
}) => {
  const { t } = useTranslation();

  return (
    <Field
      type={type}
      pattern={pattern}
      placeholder={t(placeholder)}
      name={name}
      title={title}
      as={as}
      required={required}
      className={cn(
        'rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
        className
      )}
    />
  );
};

export default InputField;

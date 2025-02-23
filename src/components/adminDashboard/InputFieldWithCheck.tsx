import { type ChangeEvent, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';
import { Field, useFormikContext } from 'formik';

import SvgIcon from '@components/common/SvgIcon';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

interface IInputField {
  type?: string;
  placeholder: string;
  name: string;
  required?: boolean;
  className?: string;
  pattern?: string;
  title?: string;
  as?: string;
  initialValue?: string;
  handleCheck: (value: boolean | string) => void;
}

const InputFieldWithCheck: FC<IInputField> = ({
  type = 'text',
  placeholder,
  name,
  required = true,
  className = '',
  pattern = '.*',
  title = '',
  as = 'input',
  initialValue = '',
  handleCheck,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(initialValue);
  const [isClick, setIsClick] = useState(false);
  const { setFieldValue } = useFormikContext();

  return (
    <div className="relative">
      <Field
        type={type}
        value={inputValue}
        pattern={pattern}
        placeholder={t(placeholder)}
        name={name}
        title={title}
        as={as}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setInputValue(e.target.value);
          setFieldValue(`${name}`, e.target.value, false);
        }}
        required={required}
        className={cn(
          'w-full rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
          className
        )}
      />
      <button
        className={clsx(
          'absolute right-[22px] top-1/2 flex h-[20px] w-[20px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full',
          isClick ? 'bg-secondaryAccent' : 'bg-desc'
        )}
        type="button"
        onClick={() => {
          if (name === 'name') {
            handleCheck(!isClick)
          } else {
            handleCheck(isClick ? '' : inputValue);
          }
          
          setIsClick(!isClick);
        }}
      >
        <SvgIcon
          iconId={IconId.Check}
          size={{ width: 10, height: 10 }}
          className="fill-secondary"
        />
      </button>
    </div>
  );
};

export default InputFieldWithCheck;

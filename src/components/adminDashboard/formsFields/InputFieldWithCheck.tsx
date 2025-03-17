import { type ChangeEvent, type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { MultiLanguageString } from '@interfaces/IProduct';
import clsx from 'clsx';
import { Field, type FormikValues, useFormikContext } from 'formik';

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
  isNewValueEntered?: boolean;
  handleCheck?: (value: boolean | string) => void;
  handleRemoveField?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  setPreviousValueObject?: (value: MultiLanguageString) => void;
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
  isNewValueEntered,
  handleCheck,
  handleRemoveField,
  setPreviousValueObject,
}) => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState(initialValue);
  const [isClick, setIsClick] = useState((name === 'video' && initialValue) ? true : false);
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  return (
    <div className="flex w-full items-center gap-2">
      <div className="relative w-full">
        <Field
          type={type}
          value={inputValue}
          pattern={pattern}
          placeholder={t(placeholder)}
          name={name}
          title={title}
          as={as}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (typeof values.name === 'object') {
              setPreviousValueObject?.(values.name);
            }
            setInputValue(e.target.value);
            setFieldValue(`${name}`, e.target.value, false);
          }}
          required={required}
          className={cn(
            'w-full rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
            className
          )}
        />
        {handleCheck && inputValue && (
          <button
            className={clsx(
              'absolute right-[22px] top-1/2 flex h-[20px] w-[20px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-full',
              isClick ? 'bg-secondaryAccent' : 'bg-desc'
            )}
            type="button"
            onClick={() => {
              if (name === 'name') {
                handleCheck?.(!isClick);
              } else {
                handleCheck?.(isClick ? '' : inputValue);
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
        )}
      </div>
      {isNewValueEntered && (
        <button type="button" onClick={handleRemoveField}>
          <SvgIcon
            iconId={IconId.Trash}
            size={{ width: 18, height: 18 }}
            className="fill-red-900"
          />
        </button>
      )}
    </div>
  );
};

export default InputFieldWithCheck;

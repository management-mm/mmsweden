import { type FC, useState } from 'react';
import InputMask from 'react-input-mask';

import { Field } from 'formik';

import SelectPhoneCode from './SelectPhoneCode';

import LabelTitle from '@components/common/LabelTitle';

import { cn } from '@utils/cn';

import { Label } from '@enums/i18nConstants';

interface IPhoneProps {
  className: string;
}

const Phone: FC<IPhoneProps> = ({ className }) => {
  const [callingCode, setCallingCode] = useState<string>('');
  const [placeholder, setPlaceholder] = useState<string>('');

  return (
    <label className={cn('flex flex-col gap-[2px]', className)}>
      <LabelTitle title={Label.Phone} />
      <div className="relative w-full">
        <SelectPhoneCode
          setCallingCode={setCallingCode}
          setPlaceholder={setPlaceholder}
        />
        <Field type="hidden" name="callingCode" value={callingCode} />
        <Field name="phone">
          {({ field }) => (
            <InputMask
              {...field}
              mask={placeholder}
              placeholder={placeholder}
              maskChar={'0'}
              className="w-full shrink-0 rounded-[32px] border border-neutral py-[14px] pl-[85px] font-openSans text-[14px] text-desc outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
            />
          )}
        </Field>
      </div>
    </label>
  );
};

export default Phone;

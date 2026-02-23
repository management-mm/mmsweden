import type { ChangeEvent, FC } from 'react';
import InputMask from 'react-input-mask';

import clsx from 'clsx';
import { Field, type FieldProps } from 'formik';

type DetectResult = {
  callingCode: string;
};

interface PhoneMaskedFieldProps {
  name?: string;
  phoneFormat: string;
  placeholder: string;
  callingCodeSize: number;
  className?: string;
  onDetectedAndNormalize?: (normalizedValue: string) => void;

  detectByCallingCode: (rawValue: string) => DetectResult | null;

  onDetectCountry: (result: DetectResult) => void;
}

const PhoneMaskedField: FC<PhoneMaskedFieldProps> = ({
  name = 'phone',
  phoneFormat,
  placeholder,
  callingCodeSize,
  className,
  detectByCallingCode,
  onDetectCountry,
  onDetectedAndNormalize,
}) => {
  return (
    <Field name={name} required={true} type="phone">
      {({ field }: FieldProps) => {
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
          field.onChange(e);

          const v = e.target.value ?? '';
          if (!v.startsWith('+')) return;

          const detected = detectByCallingCode(v);
          if (!detected) return;

          onDetectCountry(detected);

          const digits = v.slice(1).replace(/\D/g, '');
          const codeDigits = detected.callingCode.slice(1);
          const restDigits = digits.slice(codeDigits.length);

          onDetectedAndNormalize?.(restDigits);
        };

        return (
          <InputMask
            {...field}
            onChange={handleChange}
            mask={phoneFormat}
            placeholder={placeholder}
            maskChar={'0'}
            formatChars={{ '#': '[0-9]' }}
            className={clsx(
              'w-full shrink-0 rounded-[32px] border border-neutral py-[14px] font-openSans text-[14px] text-desc outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
              callingCodeSize === 0 && 'pl-[65px]',
              callingCodeSize === 1 && 'pl-[77px]',
              callingCodeSize === 2 && 'pl-[85px]',
              callingCodeSize === 3 && 'pl-[93px]',
              callingCodeSize === 4 && 'pl-[101px]',
              className
            )}
          />
        );
      }}
    </Field>
  );
};

export default PhoneMaskedField;

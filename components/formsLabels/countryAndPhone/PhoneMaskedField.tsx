'use client';

import type { ChangeEvent, FC } from 'react';
import { InputMask, format } from '@react-input/mask';
import clsx from 'clsx';
import { Field, type FieldProps } from 'formik';

type DetectResult = { callingCode: string };

interface PhoneMaskedFieldProps {
  name?: string;
  phoneFormat: string;
  callingCodeSize: number;
  className?: string;
  detectByCallingCode: (rawValue: string) => DetectResult | null;
  onDetectCountry: (result: DetectResult) => void;
  onDetectedAndNormalize?: (normalizedValue: string) => void;
}

const onlyDigits = (v: string) => (v ?? '').replace(/\D/g, '');

const PhoneMaskedField: FC<PhoneMaskedFieldProps> = ({
  name = 'phone',
  phoneFormat,
  callingCodeSize,
  className,
  detectByCallingCode,
  onDetectCountry,
  onDetectedAndNormalize,
}) => {
  return (
    <Field name={name}>
      {({ field, form }: FieldProps) => {
        const hasMask = Boolean((phoneFormat ?? '').trim());

        const baseClass = clsx(
          'w-full shrink-0 rounded-[32px] border border-neutral py-[14px] font-openSans text-[14px] text-desc outline-none transition-border duration-primary focus:border focus:border-secondaryAccent',
          callingCodeSize === 0 && 'pl-[65px]',
          callingCodeSize === 1 && 'pl-[77px]',
          callingCodeSize === 2 && 'pl-[85px]',
          callingCodeSize === 3 && 'pl-[93px]',
          callingCodeSize === 4 && 'pl-[101px]',
          className
        );

        if (!hasMask) {
          return (
            <input
              {...field}
              type="tel"
              inputMode="tel"
              placeholder='+000 (00) 000 0000'
              value={(field.value as string) ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value ?? '';
                form.setFieldValue(name, value);

                if (!value.startsWith('+')) return;
                const detected = detectByCallingCode(value);
                if (!detected) return;

                onDetectCountry(detected);

                const digits = onlyDigits(value);
                const codeDigits = onlyDigits(detected.callingCode);
                const restDigits = digits.slice(codeDigits.length);

                onDetectedAndNormalize?.(restDigits);
              }}
              className={baseClass}
            />
          );
        }

        const mask = phoneFormat.replaceAll('#', '_');

        const unmasked = String(field.value ?? '');
        const digits = onlyDigits(unmasked);

        const maskedValue = format(digits, {
          mask,
          replacement: { _: /\d/ },
        });

        return (
          <InputMask
            type="text"
            inputMode="tel"
            className={baseClass}
            mask={mask}
            replacement={{ _: /\d/ }}
            value={maskedValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value ?? '';

              const nextDigits = onlyDigits(value);
              form.setFieldValue(name, nextDigits);

              if (!value.startsWith('+')) return;

              const detected = detectByCallingCode(value);
              if (!detected) return;

              onDetectCountry(detected);

              const allDigits = onlyDigits(value);
              const codeDigits = onlyDigits(detected.callingCode);
              const restDigits = allDigits.slice(codeDigits.length);

              onDetectedAndNormalize?.(restDigits);
            }}
          />
        );
      }}
    </Field>
  );
};

export default PhoneMaskedField;
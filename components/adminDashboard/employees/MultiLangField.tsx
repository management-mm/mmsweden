'use client';

import { type FC, useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import clsx from 'clsx';
import { Field, type FormikValues, useFormikContext } from 'formik';

import DescSelector from '../DescSelector';

import LabelTitle from '@components/common/LabelTitle';

import { Label } from '@enums/i18nConstants';

import { AppLocale, DEFAULT_LOCALE } from '@i18n/config';

interface IMultiLangFieldProps {
  fieldName: 'name' | 'description';
  value: string | MultiLanguageString;
}

const MultiLangField: FC<IMultiLangFieldProps> = ({ fieldName, value }) => {
  const [language, setLanguage] = useState<AppLocale>(DEFAULT_LOCALE);

  const { values, setFieldValue } = useFormikContext<FormikValues>();

  useEffect(() => {
    if (value && typeof value === 'object') {
      setFieldValue(fieldName, value, false);
    }
  }, [fieldName, value, setFieldValue]);

  const fieldValue = values[fieldName];

  const textareaValue =
    typeof fieldValue === 'object'
      ? (fieldValue?.[language] ?? '')
      : (fieldValue ?? '');

  const handleChangeField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;

    if (typeof values[fieldName] === 'object' && values[fieldName] !== null) {
      setFieldValue(fieldName, {
        ...values[fieldName],
        [language]: newValue,
      });
      return;
    }

    setFieldValue(fieldName, newValue);
  };

  return (
    <div className="relative">
      <label className="flex flex-col gap-[2px]">
        <LabelTitle
          title={fieldName === 'name' ? Label.Name : Label.Description}
        />

        <div className="relative">
          <Field
            as="textarea"
            name={fieldName}
            placeholder={
              fieldName === 'name' ? 'Enter employee name' : 'Enter description'
            }
            value={textareaValue}
            onChange={handleChangeField}
            className={clsx(
              'border-neutral transition-border duration-primary focus:border-secondary-accent h-fit w-full rounded-[22px] border px-[22px] py-[14px] pr-[56px] text-[14px] outline-none focus:border md:h-full'
            )}
          />

          {typeof fieldValue === 'object' && (
            <DescSelector setLanguage={setLanguage} />
          )}
        </div>
      </label>
    </div>
  );
};

export default MultiLangField;

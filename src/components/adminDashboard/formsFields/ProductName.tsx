import { type FC, useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import clsx from 'clsx';
import { Field, type FormikValues, useFormikContext } from 'formik';

import InputFieldWithCheck from './InputFieldWithCheck';

import AddNewField from '../AddNewField';
import Desc from '../common/Desc';

import LabelTitle from '@components/common/LabelTitle';

import { LanguageKeys } from '@enums/languageKeys';

interface IProductNameProps {
  initialValue?: string | MultiLanguageString;
}

const ProductName: FC<IProductNameProps> = ({ initialValue }) => {
  const [isClick, setIsClick] = useState(false);
  const [isNewNameEntered, setIsNewNameEntered] = useState(false);
  const [previousNameObject, setPreviousNameObject] = useState(
    initialValue && typeof initialValue === 'object' ? initialValue : {}
  );

  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>();

  const handleChangeName = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    lang: LanguageKeys
  ) => {
    const newValue = e.target.value;
    if (typeof values.name === 'object') {
      setFieldValue(
        'name',
        {
          ...values.name,
          [lang]: newValue,
        },
        false
      );
      return;
    }
    handleChange(e);
  };

  useEffect(() => {
    if (typeof initialValue === 'object' && typeof values.name === 'string') {
      setIsNewNameEntered(true);
      if (values.name === '') {
        setFieldValue('name', previousNameObject, false);
        setIsNewNameEntered(false);
      }
    }
  }, [values.name]);

  const handleCheck = (shouldTranslate: boolean | string) => {
    setFieldValue('shouldTranslateName', shouldTranslate, false);
  };

  const handleRemoveField = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsClick(false);
    setIsNewNameEntered(false);
    setFieldValue('name', previousNameObject, false);
  };

  return (
    <div>
      {!initialValue || typeof initialValue === 'string' ? (
        <>
          <label className={'flex flex-col gap-[2px]'}>
            <LabelTitle title="Name" />
            <InputFieldWithCheck
              initialValue={initialValue}
              name="name"
              placeholder="Enter product name"
              handleCheck={handleCheck}
            />
          </label>
          <Desc
            text={
              'If the checkbox is enabled, the name will be translated, and if it is disabled, for example for equipment models, translation is not required.'
            }
          />
        </>
      ) : (
        <label className="flex flex-col gap-[12px]">
          <LabelTitle title="Name" />
          {Object.values(LanguageKeys).map(lang => (
            <div key={lang} className="relative">
              <label
                className={clsx(
                  'absolute left-[20px] top-1/2 -translate-y-1/2',
                  isNewNameEntered ? 'text-gray-400' : ''
                )}
              >
                <span
                  className={clsx(
                    'font-openSans text-[14px] text-desc',
                    isNewNameEntered ? 'text-gray-400' : ''
                  )}
                >
                  {lang.toUpperCase()}
                </span>
                &nbsp;&nbsp;|
              </label>
              <Field
                disabled={isNewNameEntered}
                initialValue={
                  (values.name as MultiLanguageString)?.[lang] || ''
                }
                className={clsx(
                  'w-full rounded-[22px] border border-neutral py-[14px] pl-[65px] pr-[56px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent md:h-full',
                  isNewNameEntered ? 'text-gray-400' : ''
                )}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleChangeName(e, lang)
                }
                placeholder={`Enter product name in ${lang.toUpperCase()}`}
                name={`name.${lang}`}
                required={lang === 'en'}
              />
            </div>
          ))}
          {isClick ? (
            <>
              <InputFieldWithCheck
                name="name"
                required={false}
                placeholder="Enter product name"
                handleCheck={handleCheck}
                isNewValueEntered={isNewNameEntered}
                handleRemoveField={handleRemoveField}
                setPreviousValueObject={setPreviousNameObject}
              />
              <Desc text="If the checkbox is enabled, the name will be translated, and if it is disabled, for example for equipment models, translation is not required." />
            </>
          ) : (
            <AddNewField
              itemName={'name'}
              setIsClick={setIsClick}
              setFieldCount={() => {}}
            />
          )}
        </label>
      )}
    </div>
  );
};

export default ProductName;

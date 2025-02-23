import { useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import clsx from 'clsx';
import { Field, useFormikContext, type FormikValues } from 'formik';

import AddNewCatManInd from './AddNewCatManInd';
import Desc from './Desc';
import InputFieldWithCheck from './InputFieldWithCheck';

import LabelTitle from '@components/common/LabelTitle';

import { LanguageKeys } from '@enums/languageKeys';

const ProductName = () => {
  const [isClick, setIsClick] = useState(false);

  const { values, setFieldValue, handleChange } =
      useFormikContext<FormikValues>();
  
    const handleChangeName = (
      e: React.ChangeEvent<HTMLTextAreaElement>,
      lang: LanguageKeys
    ) => {
      const newValue = e.target.value;
      if (typeof values.name === 'object') {
        setFieldValue('name', {
          ...values.name,
          [lang]: newValue,
        });
        return;
      }
      handleChange(e);
    };


  const handleCheck = (shouldTranslate: boolean | string) => {
    console.log('shouldTranslate', shouldTranslate)
    setFieldValue('shouldTranslateName', shouldTranslate, false);
  };

  

  return (
    <div>
      {!values.name || typeof values.name === 'string' ? (
        <>
          <label className={'flex flex-col gap-[2px]'}>
            <LabelTitle title="Name" />
            <InputFieldWithCheck
              initialValue={values.name}
              name="name"
              placeholder="Enter product name"
              // setCheckedValue={setInputValue}
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
              <label className="absolute left-[20px] top-1/2 -translate-y-1/2">
                <span className="font-openSans text-[14px] text-desc">
                  {lang.toUpperCase()}
                </span>
                &nbsp;&nbsp;|
              </label>
              <Field
                initialValue={(values.name as MultiLanguageString)?.[lang] || ''}
                className={clsx(
                  'w-full rounded-[22px] border border-neutral py-[14px] pr-[56px] pl-[65px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent md:h-full'
                  // newInputValue ? 'text-gray-400' : ''
                )}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChangeName(e, lang)}
                placeholder={`Enter product name in ${lang.toUpperCase()}`}
                name={`name.${lang}`}
                required={lang === 'en'}
                // onChange={(event) => handleChange(event, lang)}
              />
            </div>
          ))}
          {isClick ? (
            <InputFieldWithCheck
              name="name"
              placeholder="Enter product name"
              handleCheck={handleCheck}
              // setCheckedValue={setNewInputValue}
            />
          ) : (
            <AddNewCatManInd
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

'use client';

import { type FC, useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import clsx from 'clsx';
import { Field, type FormikValues, useFormikContext } from 'formik';

import InputFieldWithCheck from './InputFieldWithCheck';

import AddNewField from '../AddNewField';
import DescSelector from '../DescSelector';
import AiGenerateButton from '../common/AiGenerateButton';

import LabelTitle from '@components/common/LabelTitle';

import { selectDescWithAi } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { Label } from '@enums/i18nConstants';

import { AppLocale, DEFAULT_LOCALE } from '@i18n/config';

interface IDescriptionProductProps {
  description?: MultiLanguageString;
}

const DescriptionProduct: FC<IDescriptionProductProps> = ({ description }) => {
  const descWithAi = useAppSelector(selectDescWithAi);

  const [isClick, setIsClick] = useState(false);
  const [isNewDescriptionEntered, setIsNewDescriptionEntered] = useState(false);
  const [previousDescriptionObject, setPreviousDescriptionObject] = useState(
    description ?? {}
  );

  const [language, setLanguage] = useState<AppLocale>(DEFAULT_LOCALE);
  const { values, setFieldValue, handleChange } =
    useFormikContext<FormikValues>();

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    if (typeof values.description === 'object') {
      setFieldValue('description', {
        ...values.description,
        [language]: newValue,
      });
      return;
    }
    handleChange(e);
  };

  useEffect(() => {
    if (description && typeof description === 'object') {
      setFieldValue('description', description, false);
      setPreviousDescriptionObject(description);
    }
  }, [description, setFieldValue]);

  useEffect(() => {
    if (descWithAi) {
      setFieldValue('description', descWithAi, false);
    }
  }, [descWithAi, setFieldValue]);

  useEffect(() => {
    if (
      typeof description === 'object' &&
      typeof values.description === 'string'
    ) {
      setIsNewDescriptionEntered(true);
      if (values.description === '') {
        setFieldValue('description', previousDescriptionObject, false);
        setIsNewDescriptionEntered(false);
      }
    }
  }, [values.description]);

  const handleRemoveField = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsClick(false);
    setIsNewDescriptionEntered(false);
    setFieldValue('description', previousDescriptionObject, false);
  };

  return (
    <>
      <div className="relative">
        <label className="flex flex-col gap-[2px]">
          <LabelTitle title={Label.Description} />
          <div className="relative">
            <Field
              as="textarea"
              disabled={isNewDescriptionEntered}
              name="description"
              placeholder="Enter product description"
              value={
                typeof description === 'object'
                  ? description[language] || ''
                  : values.description || ''
              }
              onChange={handleChangeDescription}
              className={clsx(
                'border-neutral transition-border duration-primary focus:border-secondary-accent h-fit w-full rounded-[22px] border px-[22px] py-[14px] pr-[56px] text-[14px] outline-none focus:border md:h-full',
                isNewDescriptionEntered ? 'text-gray-400' : ''
              )}
            />
            {!description && values.description && (
              <AiGenerateButton description={values.description} />
            )}
            {description && <DescSelector setLanguage={setLanguage} />}
          </div>
          {isClick ? (
            <div>
              <InputFieldWithCheck
                name="description"
                required={false}
                placeholder="Enter product description"
                isNewValueEntered={isNewDescriptionEntered}
                handleRemoveField={handleRemoveField}
                setPreviousValueObject={setPreviousDescriptionObject}
              />
            </div>
          ) : (
            typeof description === 'object' && (
              <AddNewField
                itemName={'description'}
                setIsClick={setIsClick}
                setFieldCount={() => {}}
              />
            )
          )}
        </label>
      </div>
    </>
  );
};

export default DescriptionProduct;

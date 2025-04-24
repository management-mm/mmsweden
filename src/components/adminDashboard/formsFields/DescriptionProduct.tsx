import { type FC, useEffect, useState } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import clsx from 'clsx';
import { Field, type FormikValues, useFormikContext } from 'formik';

import InputFieldWithCheck from './InputFieldWithCheck';

import AddNewField from '../AddNewField';
import DescSelector from '../DescSelector';

import LabelTitle from '@components/common/LabelTitle';

import { LanguageKeys } from '@enums/languageKeys';

interface IDescriptionProductProps {
  description?: MultiLanguageString;
}

const DescriptionProduct: FC<IDescriptionProductProps> = ({ description }) => {
  const [isClick, setIsClick] = useState(false);
  const [isNewDescriptionEntered, setIsNewDescriptionEntered] = useState(false);
  const [previousDescriptionObject, setPreviousDescriptionObject] = useState(
    description ?? {}
  );
  const [language, setLanguage] = useState<LanguageKeys>(LanguageKeys.EN);
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
      <div>
        <label className="flex flex-col gap-[2px]">
          <LabelTitle title="Description" />
          <div className="relative">
            <Field
              initialValue={description ? description[language] : description}
              as="textarea"
              disabled={isNewDescriptionEntered}
              name="description"
              placeholder="Enter product description"
              value={values.description ? values.description[language] : ''}
              onChange={handleChangeDescription}
              className={clsx(
                'h-fit w-full rounded-[22px] border border-neutral px-[22px] py-[14px] pr-[56px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent md:h-full',
                isNewDescriptionEntered ? 'text-gray-400' : ''
              )}
            />
            {description && <DescSelector setLanguage={setLanguage} />}
          </div>
          {isClick ? (
            <>
              <InputFieldWithCheck
                name="description"
                required={false}
                placeholder="Enter product description"
                isNewValueEntered={isNewDescriptionEntered}
                handleRemoveField={handleRemoveField}
                setPreviousValueObject={setPreviousDescriptionObject}
              />
            </>
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

import { useState, type FC } from 'react';


import { useFormikContext } from 'formik';

import AddNewCatManInd from './AddNewCatManInd';
import Desc from './Desc';
import InputFieldWithCheck from './InputFieldWithCheck';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { LanguageKeys } from '@enums/languageKeys';
import type { MultiLanguageString } from '@interfaces/IProduct';

interface IProductNameProps {
  name: MultiLanguageString | string | undefined
}

const ProductName:FC<IProductNameProps> = ({ name = '' }) => {
  const [isClick, setIsClick] = useState(false);
  // const [inputValue, setInputValue] = useState(name);
  // const [newInputValue, setNewInputValue] = useState('');
  const { setFieldValue } = useFormikContext();
  // useEffect(() => {
  //   setInputValue(name);
  // }, [name]);

  const handleCheck = () => {
    setFieldValue('shouldTranslateName', true, false);
  };

  return (
    <div>
      {name && typeof name === 'string' ? (
        <>
          <label className={'flex flex-col gap-[2px]'}>
            <LabelTitle title="Name" />
            <InputFieldWithCheck
              initialValue={name}
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
              <InputField
                initialValue={(name as MultiLanguageString)?.[lang] || ''}
                // className={clsx(
                //   'w-full pl-[65px]',
                //   newInputValue ? 'text-gray-400' : ''
                // )}
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
                <AddNewCatManInd itemName={'name'} setIsClick={setIsClick} setFieldCount={() => {}} />
          )}
        </label>
      )}
    </div>
  );
};

export default ProductName;

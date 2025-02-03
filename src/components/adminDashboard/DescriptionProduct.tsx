import { useState, type FC } from 'react';

import { Field, useFormikContext, type FormikValues } from 'formik';

import DescSelector from './DescSelector';

import LabelTitle from '@components/common/LabelTitle';
import type { MultiLanguageString } from '@interfaces/IProduct';
import { LanguageKeys } from '@enums/languageKeys';

interface IDescriptionProductProps {
  description?: MultiLanguageString 
}

const DescriptionProduct:FC<IDescriptionProductProps> = ({ description}) => {
  const [language, setLanguage] = useState<LanguageKeys>(LanguageKeys.EN);
  const { values, handleChange } = useFormikContext<FormikValues>();

  return (
    <>
      <div>
        <label className="flex flex-col gap-[2px]">
          <LabelTitle title="Description" />
          <div className="relative">
            <Field
              initialValue={description ? description[language] : description}
              as="textarea"
              name="description"
              placeholder="Enter product description"
              value={values.description}
              onChange={handleChange}
              className="h-fit w-full rounded-[22px] border border-neutral px-[22px] py-[14px] pr-[56px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent md:h-full"
            />
            {description && <DescSelector setLanguage={setLanguage} />}
          </div>
        </label>
      </div>
    </>
  );
};

export default DescriptionProduct;

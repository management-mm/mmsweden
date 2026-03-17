'use client';

import type { ChangeEvent, FC } from 'react';
import { useCallback, useMemo, useState } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import { Field, type FormikValues, useFormikContext } from 'formik';
import * as _ from 'lodash';

import Checkbox from './common/Checkbox';
import DescriptionProduct from './formsFields/DescriptionProduct';
import ProductName from './formsFields/ProductName';

import LabelTitle from '@components/common/LabelTitle';

import { Label } from '@enums/i18nConstants';

interface IGeneralInformationProps {
  product?: IProduct;
}

const GeneralInformation: FC<IGeneralInformationProps> = ({ product }) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();
  const [isChecked, setIsChecked] = useState(false);

  const debouncedSetFieldValue = useMemo(
    () =>
      _.debounce(
        (field: string, value: string) => setFieldValue(field, value, false),
        1000
      ),
    []
  );

  const handleChange = useCallback(
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      e.persist();
      const value = e.target.value;

      setFieldValue(field, value, false);

      debouncedSetFieldValue(field, value);
    },
    [setFieldValue, debouncedSetFieldValue]
  );

  return (
    <div className="flex flex-col gap-[20px]">
      <ProductName initialValue={product?.name} />

      <label className="flex flex-col gap-[2px]">
        <LabelTitle title={Label.IDNumber} />
        <Field
          placeholder="Enter ID number"
          name="idNumber"
          required
          disabled={!isChecked}
          value={values.idNumber}
          onChange={handleChange('idNumber')}
          className="border-neutral transition-border duration-primary focus:border-secondary-accent disabled:text-desc rounded-[32px] border px-[22px] py-[14px] text-[14px] outline-none focus:border"
        />
      </label>

      <div className="flex items-center gap-2 pl-[22px]">
        <Checkbox
          isClick={isChecked}
          onClicked={() => {
            const newValue = !isChecked;
            setIsChecked(newValue);
            setFieldValue('autoGenerateId', !newValue, false);
          }}
          className={'rounded-[6px]'}
        />
        <span className="text-[14px]">Enter ID Number manually</span>
      </div>

      <DescriptionProduct description={product?.description} />

      <label className="flex flex-col gap-[2px]">
        <LabelTitle title={Label.Dimensions} />
        <Field
          placeholder="Enter product size"
          name="dimensions"
          required
          value={values.dimensions}
          onChange={handleChange('dimensions')}
          className="border-neutral transition-border duration-primary focus:border-secondary-accent rounded-[32px] border px-[22px] py-[14px] text-[14px] outline-none focus:border"
        />
      </label>
    </div>
  );
};

export default GeneralInformation;

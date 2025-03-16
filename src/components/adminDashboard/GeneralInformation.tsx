import type { ChangeEvent, FC } from 'react';
import { useCallback, useMemo } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import { Field, type FormikValues, useFormikContext } from 'formik';
import * as _ from 'lodash';

import DescriptionProduct from './formsFields/DescriptionProduct';
import ProductName from './formsFields/ProductName';

import LabelTitle from '@components/common/LabelTitle';

interface IGeneralInformationProps {
  product?: IProduct;
}

const GeneralInformation: FC<IGeneralInformationProps> = ({ product }) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

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
        <LabelTitle title="ID Number" />
        <Field
          placeholder="Enter ID number"
          name="idNumber"
          required
          value={values.idNumber}
          onChange={handleChange('idNumber')}
          className="rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        />
      </label>

      <DescriptionProduct description={product?.description} />

      <label className="flex flex-col gap-[2px]">
        <LabelTitle title="Dimensions" />
        <Field
          placeholder="Enter product size"
          name="dimensions"
          required
          value={values.dimensions}
          onChange={handleChange('dimensions')}
          className="rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent"
        />
      </label>
    </div>
  );
};

export default GeneralInformation;

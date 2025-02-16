import type { FC } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import { Field, type FormikValues, useFormikContext } from 'formik';

import DescriptionProduct from './DescriptionProduct';
import ProductName from './ProductName';

import LabelTitle from '@components/common/LabelTitle';

interface IGeneralInformationProps {
  product?: IProduct;
}

const GeneralInformation: FC<IGeneralInformationProps> = ({ product }) => {
  const { values, handleChange } = useFormikContext<FormikValues>();

  return (
    <div className="flex flex-col gap-[20px]">
      <ProductName name={product?.name} />

      <label className={'flex flex-col gap-[2px]'}>
        <LabelTitle title="ID Number" />
        <Field
          initialValue={product?.idNumber}
          placeholder="Enter ID number"
          name="idNumber"
          required={true}
          value={values.idNumber}
          onChange={handleChange}
          className={
            'rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent'
          }
        />
      </label>

      <DescriptionProduct description={product?.description} />
      <label className={'flex flex-col gap-[2px]'}>
        <LabelTitle title="Dimensions" />
        <Field
          initialValue={product?.dimensions}
          placeholder="Enter product size"
          name="dimensions"
          required={true}
          value={values.dimensions}
          onChange={handleChange}
          className={
            'rounded-[32px] border border-neutral px-[22px] py-[14px] text-[14px] outline-none transition-border duration-primary focus:border focus:border-secondaryAccent'
          }
        />
      </label>
    </div>
  );
};

export default GeneralInformation;

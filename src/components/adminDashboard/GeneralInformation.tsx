import type { FC, ChangeEvent } from 'react';
import { Field, type FormikValues, useFormikContext } from 'formik';
import { useCallback } from 'react';
import * as _ from 'lodash';

import type { IProduct } from '@interfaces/IProduct';
import DescriptionProduct from './DescriptionProduct';
import ProductName from './ProductName';
import LabelTitle from '@components/common/LabelTitle';

interface IGeneralInformationProps {
  product?: IProduct;
}

const GeneralInformation: FC<IGeneralInformationProps> = ({ product }) => {
  const { values, setFieldValue } = useFormikContext<FormikValues>();

  // Дебаунсим обновление Formik
  const debouncedSetFieldValue = useCallback(
    _.debounce((field: string, value: string) => {
      setFieldValue(field, value);
    }, 300),
    [] // Важно: пустой массив зависимостей, чтобы debounce не пересоздавался
  );

  const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
    e.persist(); // предотвращает баги в React с SyntheticEvent
    const value = e.target.value;
    
    // Обновляем локально мгновенно
    setFieldValue(field, value, false);
    
    // Запускаем debounce-обновление Formik
    debouncedSetFieldValue(field, value);
  };

  return (
    <div className="flex flex-col gap-[20px]">
      <ProductName name={product?.name} />

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

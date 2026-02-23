import { ErrorMessage } from 'formik';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const ProductName = () => {
  return (
    <label className="flex flex-col gap-[2px]">
      <div className="flex items-center gap-[2px]">
        <LabelTitle title={Label.ProductName} />
        <span className="text-red-700">*</span>
      </div>

      <InputField
        placeholder={Placeholder.ProductName}
        required={true}
        name="productName"
      />
      <ErrorMessage name="message">
        {msg => <div className="mt-1 text-sm text-red-500">{msg}</div>}
      </ErrorMessage>
    </label>
  );
};

export default ProductName;

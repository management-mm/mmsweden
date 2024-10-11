import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const ProductName = () => {
  return (
    <label className="flex flex-col gap-[2px]">
      <LabelTitle title={Label.ProductName} />
      <InputField placeholder={Placeholder.ProductName} name="productName" />
    </label>
  );
};

export default ProductName;

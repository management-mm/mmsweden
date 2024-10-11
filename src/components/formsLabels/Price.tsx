import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label } from '@enums/i18nConstants';

const Price = () => {
  return (
    <label className="flex flex-col gap-[2px]">
      <LabelTitle title={Label.Price} />
      <InputField placeholder={Label.Price} name="price" />
    </label>
  );
};

export default Price;

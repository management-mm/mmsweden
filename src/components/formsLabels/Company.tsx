import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Company = () => {
  return (
    <label className="flex flex-col gap-[2px]">
      <LabelTitle title={Label.Company} />
      <InputField name="company" placeholder={Placeholder.Company} />
    </label>
  );
};

export default Company;

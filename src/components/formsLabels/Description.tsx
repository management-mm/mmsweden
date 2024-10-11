import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Description = () => {
  return (
    <label className="flex flex-col gap-[2px] md:w-[calc((100%-30px)/2)]">
      <LabelTitle title={Label.Description} />
      <InputField
        as="textarea"
        name="description"
        placeholder={Placeholder.Description}
        className="h-[180px] rounded-[22px] md:h-full"
      />
    </label>
  );
};

export default Description;

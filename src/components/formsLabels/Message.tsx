import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Message = () => {
  return (
    <label className="flex flex-col gap-[2px]">
      <LabelTitle title={Label.Message} />
      <InputField
        name="message"
        as="textarea"
        placeholder={Placeholder.Message}
        className="h-[180px] rounded-[22px]"
      />
    </label>
  );
};

export default Message;

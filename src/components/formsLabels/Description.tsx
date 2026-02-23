import { ErrorMessage } from 'formik';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { Label, Placeholder } from '@enums/i18nConstants';

const Description = () => {
  return (
    <label className="flex flex-col gap-[2px] md:w-[calc((100%-30px)/2)]">
      <div className="flex items-center gap-[2px]">
        <LabelTitle title={Label.Description} />
        <span className="text-red-700">*</span>
      </div>
      <InputField
        as="textarea"
        name="description"
        placeholder={Placeholder.Description}
        required={true}
        className="h-[180px] rounded-[22px] md:h-full"
      />
      <ErrorMessage name="description">
        {msg => <div className="mt-1 text-sm text-red-500">{msg}</div>}
      </ErrorMessage>
    </label>
  );
};

export default Description;

import type { FC } from 'react';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { cn } from '@utils/cn';

import { Label, Placeholder } from '@enums/i18nConstants';

interface ISubjectProps {
  className: string;
}

const Subject: FC<ISubjectProps> = ({ className }) => {
  return (
    <label className={cn('flex flex-col gap-[2px]', className)}>
      <LabelTitle title={Label.Subject} />
      <InputField
        name="subject"
        required={false}
        placeholder={Placeholder.Subject}
      />
    </label>
  );
};

export default Subject;

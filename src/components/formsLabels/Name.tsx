import type { FC } from 'react';

import InputField from '@components/common/InputField';
import LabelTitle from '@components/common/LabelTitle';

import { cn } from '@utils/cn';

import { Label, Placeholder } from '@enums/i18nConstants';

interface INameProps {
  className?: string;
}

const Name: FC<INameProps> = ({ className }) => {
  return (
    <label className={cn('flex flex-col gap-[2px]', className)}>
      <LabelTitle title={Label.Name} />
      <InputField placeholder={Placeholder.Name} name="name" required={true} />
    </label>
  );
};

export default Name;

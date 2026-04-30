import type { FC } from 'react';

import { useTranslations } from 'next-intl';

interface ILabelTitleProps {
  title: string;
  type?: 'string' | 'enum';
}

const LabelTitle: FC<ILabelTitleProps> = ({ title, type = 'enum' }) => {
  const t = useTranslations();

  return (
    <span className="font-openSans text-primary pl-[20px] text-[14px]">
      {type === 'string' ? title : t(title)}
    </span>
  );
};

export default LabelTitle;

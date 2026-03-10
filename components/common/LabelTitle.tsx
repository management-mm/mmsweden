import type { FC } from 'react';

import { useTranslations } from 'next-intl';

interface ILabelTitleProps {
  title: string;
}

const LabelTitle: FC<ILabelTitleProps> = ({ title }) => {
  const t = useTranslations();

  return (
    <span className="font-openSans text-primary pl-[20px] text-[14px]">
      {t(title)}
    </span>
  );
};

export default LabelTitle;

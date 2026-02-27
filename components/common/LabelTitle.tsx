'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ILabelTitleProps {
  title: string;
}

const LabelTitle: FC<ILabelTitleProps> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <span className="font-openSans text-primary pl-[20px] text-[14px]">
      {t(title)}
    </span>
  );
};

export default LabelTitle;

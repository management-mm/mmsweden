import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ILabelTitleProps {
  title: string;
}

const LabelTitle: FC<ILabelTitleProps> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <span className="pl-[20px] font-openSans text-[14px] text-primary after:ml-0.5 after:text-red-500 after:content-['*']">
      {t(title)}
    </span>
  );
};

export default LabelTitle;

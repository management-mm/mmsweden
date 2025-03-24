import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ILabelTitleProps {
  title: string;
}

const LabelTitle: FC<ILabelTitleProps> = ({ title }) => {
  const { t } = useTranslation();

  return (
    <span className="pl-[20px] font-openSans text-[14px] text-primary">
      {t(title)}
    </span>
  );
};

export default LabelTitle;

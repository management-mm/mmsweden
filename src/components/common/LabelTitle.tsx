import { useTranslation } from 'react-i18next';

const LabelTitle = ({ title }) => {
  const { t } = useTranslation();

  return (
    <span className="pl-[20px] font-openSans text-[14px] text-primary">
      {t(title)}
    </span>
  );
};

export default LabelTitle;

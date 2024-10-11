import { useTranslation } from 'react-i18next';

import { selectTotal } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { Filter } from '@enums/i18nConstants';

const FoundProducts = () => {
  const totalProducts = useAppSelector(selectTotal);
  const { t } = useTranslation();
  return (
    <p className="font-openSans text-[12px] text-[#4e4e4e]">
      {t(Filter.Found, { number: totalProducts })}
    </p>
  );
};

export default FoundProducts;

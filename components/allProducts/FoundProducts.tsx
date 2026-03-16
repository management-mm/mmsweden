'use client';

import { useTranslations } from 'next-intl';

import { useProductsTotal } from './ProductsTotalContext';

import { Filter } from '@enums/i18nConstants';

const FoundProducts = () => {
  const totalProducts = useProductsTotal();
  const t = useTranslations();

  return (
    <p className="font-openSans text-[12px] text-[#4e4e4e]">
      {t(Filter.Found, { number: totalProducts })}
    </p>
  );
};

export default FoundProducts;

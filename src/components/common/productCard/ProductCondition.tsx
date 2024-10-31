import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { Filter } from '@enums/i18nConstants';
import type { FC } from 'react';

interface IProductConditionProps {
  condition: 'used' | 'new'
}

const ProductCondition:FC<IProductConditionProps> = ({ condition }) => {
  const { t } = useTranslation();
  return (
    <span
      className={clsx(
        'absolute left-[8px] top-[8px] inline-block rounded-[32px] px-[6px] py-[3px] text-[12px] font-medium uppercase leading-tight',
        condition === 'used'
          ? 'bg-secondaryAccent text-secondary'
          : 'bg-[#30FCC0]'
      )}
    >
      {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
    </span>
  );
};

export default ProductCondition;

'use client';

import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

import clsx from 'clsx';

import { Filter } from '@enums/i18nConstants';

interface IProductConditionProps {
  condition: 'used' | 'new';
}

const ProductCondition: FC<IProductConditionProps> = ({ condition }) => {
  const { t } = useTranslation();
  return (
    <span
      className={clsx(
        'absolute top-[8px] left-[8px] z-[11] inline-block rounded-[32px] px-[6px] py-[3px] text-[12px] leading-tight font-medium uppercase',
        condition === 'used'
          ? 'bg-secondary-accent text-secondary'
          : 'bg-[#30FCC0]'
      )}
    >
      {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
    </span>
  );
};

export default ProductCondition;

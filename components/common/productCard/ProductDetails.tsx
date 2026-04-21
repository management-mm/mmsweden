import type { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { MultiLanguageString } from '@interfaces/IProduct';

import getProductName from '@utils/getProductName';

import { AppLocale } from '@i18n/config';

interface IProductDetailsProps {
  isLoading: boolean;
  name: string | MultiLanguageString;
  locale: AppLocale;
  idNumber: string;
  description: MultiLanguageString;
  dimensions: string;
}

const ProductDetails: FC<IProductDetailsProps> = ({
  isLoading,
  name,
  locale,
  idNumber,
  description,
  dimensions,
}) => {
  return (
    <>
      <h3
        className="text-primary mb-[4px] line-clamp-2 text-[16px] font-semibold uppercase"
        translate="no"
      >
        {isLoading ? (
          <Skeleton width="78%" height={20} />
        ) : (
          getProductName(name, locale)
        )}
      </h3>

      <p
        className="text-secondary-accent mb-[4px] text-[14px] font-semibold"
        translate="no"
      >
        {isLoading ? (
          <Skeleton width="42%" height={16} />
        ) : (
          <>
            ID NR <span>{idNumber}</span>
          </>
        )}
      </p>

      <p
        className="font-openSans text-desc mb-[12px] line-clamp-2 text-[12px]"
        translate="no"
      >
        {isLoading ? <Skeleton width="55%" height={14} /> : dimensions}
      </p>

      <p
        className="font-openSans text-title mb-auto line-clamp-4 w-full text-[12px]"
        translate="no"
      >
        {isLoading ? (
          <Skeleton count={4} height={12} />
        ) : (
          description?.[locale] || description?.en || ''
        )}
      </p>
    </>
  );
};

export default ProductDetails;

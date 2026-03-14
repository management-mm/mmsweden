import type { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { MultiLanguageString } from '@interfaces/IProduct';

import getProductName from '@utils/getProductName';

import { AppLocale } from '@i18n/config';

interface IProductDetailsProps {
  isLoading: boolean;
  name: string | MultiLanguageString;
  language: AppLocale;
  idNumber: string;
  description: MultiLanguageString;
  dimensions: string;
}

const ProductDetails: FC<IProductDetailsProps> = ({
  isLoading,
  name,
  language,
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
        {isLoading ? <Skeleton width={150} /> : getProductName(name, language)}
      </h3>

      <p
        className="text-secondary-accent mb-[4px] text-[14px] font-semibold"
        translate="no"
      >
        {isLoading ? <Skeleton width={80} /> : 'ID NR '}
        <span>{isLoading ? <Skeleton width={80} /> : idNumber}</span>
      </p>

      <p
        className="font-openSans text-desc mb-[12px] line-clamp-2 text-[12px]"
        translate="no"
      >
        {isLoading ? <Skeleton width={120} /> : dimensions}
      </p>

      <p
        className="font-openSans text-title mb-auto line-clamp-4 w-full text-[12px]"
        translate="no"
      >
        {isLoading ? (
          <Skeleton count={3} />
        ) : (
          description?.[language] || description?.en || ''
        )}
      </p>
    </>
  );
};

export default ProductDetails;

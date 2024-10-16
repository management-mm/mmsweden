import Skeleton from 'react-loading-skeleton';

import getProductName from '@utils/getProductName';
import type { MultiLanguageString } from '@interfaces/IProduct';
import type { LanguageKeys } from '@enums/languageKeys';
import type { FC } from 'react';

interface IProductDetailsProps {
  isLoading: boolean;
  name: string | MultiLanguageString;
  language: LanguageKeys;
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
        className="mb-[4px] text-[16px] font-semibold uppercase text-primary" 
        key={`name-${language}`} 
        translate="no"
      >
        {isLoading ? (
          <Skeleton width={150} />
        ) : (
          getProductName(name, language)
        )}
      </h3>

      <p 
        className="mb-[4px] text-[14px] font-semibold text-secondaryAccent" 
        key={`id-number-${idNumber}`} 
        translate="no"
      >
        {isLoading ? <Skeleton width={80} /> : 'ID NR '}
        <span>{isLoading ? <Skeleton width={80} /> : idNumber}</span>
      </p>

      <p 
        className="mb-[12px] line-clamp-2 font-openSans text-[12px] text-desc" 
        key={`dimensions-${dimensions}`} 
        translate="no"
      >
        {isLoading ? <Skeleton width={120} /> : dimensions}
      </p>

      <p 
        className="mb-auto line-clamp-4 w-full font-openSans text-[12px] text-title" 
        key={`description-${language}`} 
        translate="no"
      >
        {isLoading ? <Skeleton count={3} /> : description?.[language] || ''}
      </p>
    </>
  );
};

export default ProductDetails;

import type { LanguageKeys } from '@enums/languageKeys';
import type { MultiLanguageString } from '@interfaces/IProduct';
import getProductName from '@utils/getProductName';
import type { FC } from 'react';
import Skeleton from 'react-loading-skeleton';

interface IProductImageProps {
  isLoading: boolean;
  photos: string[]
  name: MultiLanguageString | string;
  language: LanguageKeys;
}

const ProductImage:FC<IProductImageProps> = ({ isLoading, photos, name, language }) => {
  return (
    <>
      {!isLoading ? (
        photos.length !== 0 ? (
          <img
            className="h-[218px] w-full rounded-t-[4px] object-contain"
            src={photos ? photos[0] : ''}
            alt={name ? getProductName(name, language) : ''}
          />
        ) : (
          <div className="h-[200px] w-full rounded-t-[4px] bg-slate-500" />
        )
      ) : (
        <Skeleton
          height={200}
          duration={1.2}
          containerClassName="block leading-[1]"
        />
      )}
    </>
  );
};

export default ProductImage;

import { type FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';

import ActionsButtons from './ActionButtons';
import AdminEditProductButton from './AdminEditProductButton';
import ProductCondition from './ProductCondition';
import ProductDetails from './ProductDetails';
import ProductImageHover from './ProductImageHover';

import { AppLocale } from '@i18n/config';

export interface IProductCardProps {
  product: IProduct;
  className?: string;
  language: AppLocale;
  isAdmin?: boolean;
  isLoading?: boolean;
  categorySlug?: string;
  subcategorySlug?: string;
}

const ProductCard: FC<IProductCardProps> = ({
  product,
  product: {
    name,
    idNumber,
    condition,
    photos,
    dimensions,
    description,
    deletionDate,
  },
  className,
  language,
  isAdmin = false,
  isLoading = false,
  categorySlug,
  subcategorySlug,
}) => {
  const slug = product.slug;

  return (
    <article
      className={clsx(
        'border-secondary flex h-[504px] flex-col rounded-[4px] border pb-[20px]',
        className,
        deletionDate && !isLoading && 'opacity-70'
      )}
      aria-busy={isLoading}
    >
      <div className="relative mb-[8px]">
        <ProductImageHover photos={photos} name={name} language={language} />

        {isLoading ? (
          <div className="absolute top-[8px] left-[8px] z-[11]">
            <Skeleton width={72} height={24} borderRadius={999} />
          </div>
        ) : (
          <ProductCondition condition={condition} />
        )}

        {!isLoading && deletionDate && (
          <span className="text-secondary absolute top-[8px] right-[8px] z-[11] inline-block rounded-[32px] bg-red-900 px-[6px] py-[3px] text-[12px] leading-tight font-medium uppercase">
            Sold
          </span>
        )}
      </div>

      <div
        className={clsx(
          'flex flex-grow flex-col',
          isAdmin ? 'px-[6px]' : 'px-[14px]'
        )}
      >
        <ProductDetails
          isLoading={isLoading}
          name={name}
          language={language}
          idNumber={idNumber}
          description={description}
          dimensions={dimensions}
        />

        {isLoading ? (
          <div className="mt-[16px] flex gap-[12px]">
            <Skeleton height={40} containerClassName="flex-1" />
            <Skeleton height={40} containerClassName="flex-1" />
          </div>
        ) : isAdmin ? (
          <AdminEditProductButton language={language} slug={slug} />
        ) : (
          <ActionsButtons
            language={language}
            isLoading={isLoading}
            product={product}
            categorySlug={categorySlug}
            subcategorySlug={subcategorySlug}
          />
        )}
      </div>
    </article>
  );
};

export default ProductCard;

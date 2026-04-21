import { type FC } from 'react';
import Skeleton from 'react-loading-skeleton';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';

import ActionsButtons from './ActionButtons';
import AdminEditProductButton from './AdminEditProductButton';
import ProductCondition from './ProductCondition';
import ProductDetails from './ProductDetails';
import ProductImageBase from './ProductImageBase';
import ProductImageHover from './ProductImageHover';

import { AppLocale } from '@i18n/config';

export interface IProductCardProps {
  product: IProduct;
  className?: string;
  locale: AppLocale;
  isAdmin?: boolean;
  isLoading?: boolean;
  categorySlug?: string;
  subcategorySlug?: string;
  priority?: boolean;
  interactiveImage?: boolean;
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
  locale,
  isAdmin = false,
  isLoading = false,
  categorySlug,
  subcategorySlug,
  priority = false,
  interactiveImage = true,
}) => {
  const slug = product.slug;

  return (
    <article
      className={clsx(
        'group border-secondary flex h-[504px] flex-col overflow-hidden rounded-[8px] border bg-white pb-[20px] shadow-sm transition-all duration-300',
        !isLoading &&
          'focus-within:-translate-y-1 focus-within:shadow-lg hover:-translate-y-1 hover:shadow-lg',
        className,
        deletionDate && !isLoading && 'opacity-70'
      )}
      aria-busy={isLoading}
    >
      <div className="relative mb-[10px]">
        {interactiveImage ? (
          <ProductImageHover
            photos={photos}
            name={name}
            locale={locale}
            priority={priority}
          />
        ) : (
          <ProductImageBase
            photos={photos}
            name={name}
            locale={locale}
            priority={priority}
          />
        )}

        {isLoading ? (
          <div className="absolute top-[8px] left-[8px] z-[11]">
            <Skeleton width={72} height={24} borderRadius={999} />
          </div>
        ) : (
          <ProductCondition condition={condition} />
        )}

        {!isLoading && deletionDate && (
          <span className="text-secondary absolute top-[8px] right-[8px] z-[11] inline-flex items-center rounded-full bg-red-900 px-[8px] py-[4px] text-[12px] leading-none font-medium uppercase shadow-sm">
            Sold
          </span>
        )}
      </div>

      <div
        className={clsx(
          'flex min-h-0 flex-grow flex-col',
          isAdmin ? 'px-[8px]' : 'px-[14px]'
        )}
      >
        <ProductDetails
          isLoading={isLoading}
          name={name}
          locale={locale}
          idNumber={idNumber}
          description={description}
          dimensions={dimensions}
        />

        {isLoading ? (
          <div className="mt-[16px] flex gap-[12px]">
            <Skeleton
              height={40}
              borderRadius={999}
              containerClassName="flex-1"
            />
            <Skeleton
              height={40}
              borderRadius={999}
              containerClassName="flex-1"
            />
          </div>
        ) : isAdmin ? (
          <div className="mt-auto">
            <AdminEditProductButton locale={locale} slug={slug} />
          </div>
        ) : (
          <div className="mt-auto">
            <ActionsButtons
              locale={locale}
              isLoading={isLoading}
              product={product}
              categorySlug={categorySlug}
              subcategorySlug={subcategorySlug}
            />
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;

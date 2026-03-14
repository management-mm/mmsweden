import { type FC } from 'react';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';

import ActionsButtons from './ActionButtons';
import AdminEditProductButton from './AdminEditProductButton';
import ProductCondition from './ProductCondition';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

import { generateProductSlug } from '@utils/generateProductSlug';

import { AppLocale } from '@i18n/config';

export interface IProductCardProps {
  product: IProduct;
  className?: string;
  language: AppLocale;
  isAdmin?: boolean;
  isLoading?: boolean;
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
}) => {
  const slug = generateProductSlug(product);

  return (
    <article
      className={clsx(
        'border-secondary flex h-[504px] flex-col rounded-[4px] border pb-[20px]',
        className,
        deletionDate && 'opacity-70'
      )}
    >
      <div className="relative mb-[8px]">
        <ProductImage
          isLoading={isLoading}
          photos={photos}
          name={name}
          language={language}
        />

        <ProductCondition condition={condition} />

        {deletionDate && (
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

        {isAdmin ? (
          <AdminEditProductButton language={language} slug={slug} />
        ) : (
          <ActionsButtons
            language={language}
            isLoading={isLoading}
            product={product}
          />
        )}
      </div>
    </article>
  );
};

export default ProductCard;

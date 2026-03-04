'use client';

import { type FC, useContext } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { LanguageContext } from 'app/providers';
import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ActionsButtons from './ActionButtons';
import ProductCondition from './ProductCondition';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

import SvgIcon from '../SvgIcon';

import { LanguageContextAdmin } from '@components/AdminProvider';

import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { IconId } from '@enums/iconsSpriteId';
import { generateProductSlug } from '@utils/generateProductSlug';

export interface IProductCardProps {
  product: IProduct;
  className?: string;
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
}) => {
  const pathname = usePathname();
  const isAdmin = pathname.includes('/admin');

  const { language } = useContext(
    isAdmin ? LanguageContextAdmin : LanguageContext
  );

  const isLoading = useAppSelector(selectIsLoading);
  const dispatch = useAppDispatch();

  const handleClear = () => {
    dispatch(clearProduct());
  };
  const slug = generateProductSlug(product)
  

  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
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
            <Link
              href={`/admin/all-products/edit-product/${slug}`}
              onClick={handleClear}
              className="border-primary text-primary flex w-full items-center justify-center gap-[8px] rounded-[32px] border py-[10px] text-[12px] font-semibold"
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.EditProduct}
                size={{ width: 16, height: 16 }}
              />
              Edit Product
            </Link>
          ) : (
            <ActionsButtons isLoading={isLoading} product={product} />
          )}
        </div>
      </article>
    </SkeletonTheme>
  );
};

export default ProductCard;

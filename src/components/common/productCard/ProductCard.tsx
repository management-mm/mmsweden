import { type FC, useContext } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';

import ActionsButtons from './ActionButtons';
import ProductCondition from './ProductCondition';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

import SvgIcon from '../SvgIcon';

import { LanguageContext } from '@components/SharedLayout';

import { clearProduct } from '@store/products/productsSlice';
import { selectIsLoading } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { IconId } from '@enums/iconsSpriteId';

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
  const { language } = useContext(LanguageContext);
  const isAdmin = window.location.pathname.includes('admin');

  const isLoading = useAppSelector(selectIsLoading);

  const dispatch = useDispatch();

  const handleClear = () => {
    dispatch(clearProduct());
  };

  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
      <article
        className={clsx(
          'flex h-[504px] flex-col rounded-[4px] border border-secondary pb-[20px]',
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
            <span
              className={
                'absolute right-[8px] top-[8px] z-[11] inline-block rounded-[32px] bg-red-900 px-[6px] py-[3px] text-[12px] font-medium uppercase leading-tight text-secondary'
              }
            >
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
            <NavLink
              to={`edit-product/${product._id}`}
              onClick={handleClear}
              className="flex w-full items-center justify-center gap-[8px] rounded-[32px] border border-primary py-[10px] text-[12px] font-semibold text-primary"
            >
              <SvgIcon
                className="fill-primary"
                iconId={IconId.EditProduct}
                size={{ width: 16, height: 16 }}
              />
              Edit Product
            </NavLink>
          ) : (
            <ActionsButtons isLoading={isLoading} product={product} />
          )}
        </div>
      </article>
    </SkeletonTheme>
  );
};

export default ProductCard;

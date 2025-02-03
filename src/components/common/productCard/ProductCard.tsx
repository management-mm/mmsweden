import { type FC, useContext } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { NavLink } from 'react-router-dom';

import clsx from 'clsx';
import type { IProduct } from 'interfaces/IProduct';

import ActionsButtons from './ActionButtons';
import ProductCondition from './ProductCondition';
import ProductDetails from './ProductDetails';
import ProductImage from './ProductImage';

import SvgIcon from '../SvgIcon';

import { LanguageContext } from '@components/SharedLayout';

import { selectIsLoading } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useAuth } from '@hooks/useAuth';

import { cn } from '@utils/cn';

import { IconId } from '@enums/iconsSpriteId';

export interface IProductCardProps {
  product: IProduct;
  className?: string;
}

const ProductCard: FC<IProductCardProps> = ({
  product,
  product: { name, idNumber, condition, photos, dimensions, description },
  className,
}) => {
  const { language } = useContext(LanguageContext);
  const { isLoggedIn } = useAuth();

  const isLoading = useAppSelector(selectIsLoading);

  return (
    <SkeletonTheme baseColor="#E1E1E1" highlightColor="#F2F2F2">
      <article
        className={cn(
          'flex h-[504px] w-full flex-col rounded-[4px] border border-secondary pb-[20px]',
          className
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
        </div>
        <div
          className={clsx(
            'flex flex-grow flex-col',
            isLoggedIn ? 'px-[6px]' : 'px-[14px]'
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
          {isLoggedIn ? (
            <NavLink
              to={`edit-product/${product._id}`}
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

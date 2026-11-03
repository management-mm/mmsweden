'use client';

import { memo } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';
import Image from 'next/image';

import ProductImagePlaceholder from '@components/common/ProductImagePlaceholder';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getProductName from '@utils/getProductName';

interface IProductMenuItemProps {
  product: IProduct;
}

const ProductMenuItem = ({ product }: IProductMenuItemProps) => {
  const locale = useCurrentLocale();

  const { name, photos, idNumber, description } = product;

  const productName = name ? getProductName(name, locale) : 'Product';

  const imageSrc = photos?.find(
    photo => typeof photo === 'string' && photo.trim()
  );

  const productDescription =
    description?.[locale] || 'No description available';

  return (
    <div
      className={clsx(
        'group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200',
        'hover:-translate-y-[1px] hover:shadow-md',
        'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      <div className="border-secondary bg-secondary relative flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl border">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={productName}
            width={88}
            height={88}
            sizes="88px"
            quality={75}
            loading="eager"
            decoding="async"
            className="h-full w-full object-contain p-2"
          />
        ) : (
          <ProductImagePlaceholder variant="thumbnail" />
        )}
      </div>

      <div className="min-w-0 flex-1 md:pr-10">
        <h3 className="line-clamp-2 text-sm font-semibold tracking-[0.02em] text-gray-900 uppercase md:text-base">
          {productName}
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-gray-800">ID NR:</span>{' '}
          {idNumber || '—'}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
          {productDescription}
        </p>
      </div>
    </div>
  );
};

export default memo(ProductMenuItem);

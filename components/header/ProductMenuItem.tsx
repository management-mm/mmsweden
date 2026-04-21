'use client';

import { type FC } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getProductName from '@utils/getProductName';

interface IProductMenuItemProps {
  product: IProduct;
}

const ProductMenuItem: FC<IProductMenuItemProps> = ({ product }) => {
  const locale = useCurrentLocale();
  const { name, photos, idNumber, description } = product;

  return (
    <button
      type="button"
      className={clsx(
        'group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200',
        'hover:-translate-y-[1px] hover:shadow-md',

        'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <img
          src={photos?.[0] || '/placeholder-image.png'}
          alt={name ? getProductName(name, locale) : 'Product image'}
          className="h-full w-full object-contain p-2"
        />
      </div>

      <div className="min-w-0 flex-1 md:pr-10">
        <h3 className="line-clamp-2 text-sm font-semibold tracking-[0.02em] text-gray-900 uppercase md:text-base">
          {name && getProductName(name, locale)}
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-gray-800">ID NR:</span>{' '}
          {idNumber || '—'}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
          {description?.[locale] || 'No description available'}
        </p>
      </div>
    </button>
  );
};

export default ProductMenuItem;

'use client';

import { type FC, useContext, useMemo } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';

import {
  SelectedItemsContext,
  SlotItemMapContext,
} from './EmailNewsLetterMain';

import SvgIcon from '@components/common/SvgIcon';

import { toggleSelectedProducts } from '@store/selectedProductsSlice';
import { makeSelectIsProductSelected } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getProductName from '@utils/getProductName';
import initSlotItemMap from '@utils/initSlotItemMap';

import { IconId } from '@enums/iconsSpriteId';

interface IProductMenuItemProps {
  product: IProduct;
}

const ProductMenuItem: FC<IProductMenuItemProps> = ({ product }) => {
  const language = useCurrentLocale();
  const { setItems } = useContext(SelectedItemsContext);
  const { setSlotItemMap } = useContext(SlotItemMapContext);
  const { name, description, idNumber, photos } = product || {};
  const dispatch = useAppDispatch();

  const selectIsSelected = useMemo(makeSelectIsProductSelected, []);
  const isSelected = useAppSelector(state =>
    selectIsSelected(state, product._id)
  );

  const handleClick = () => {
    dispatch(toggleSelectedProducts(product));

    setItems(prevItems => {
      let updatedItems;

      if (isSelected) {
        updatedItems = prevItems.filter(i => i.id !== product._id);
      } else {
        updatedItems = [...prevItems, { id: product._id, product }];
      }

      setSlotItemMap(initSlotItemMap(updatedItems, 'id'));
      return updatedItems;
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        'group relative flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200',
        'hover:-translate-y-[1px] hover:shadow-md',
        isSelected
          ? 'border-secondary-accent bg-secondary-accent/5 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      {isSelected && (
        <div className="bg-secondary-accent absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm">
          <SvgIcon
            iconId={IconId.Check}
            size={{ width: 18, height: 18 }}
            className="fill-white"
          />
        </div>
      )}

      <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
        <img
          src={photos?.[0] || '/placeholder-image.png'}
          alt={name ? getProductName(name, language) : 'Product image'}
          className="h-full w-full object-contain p-2"
        />
      </div>

      <div className="min-w-0 flex-1 pr-10">
        <h3 className="line-clamp-2 text-sm font-semibold tracking-[0.02em] text-gray-900 uppercase md:text-base">
          {name && getProductName(name, language)}
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-gray-800">ID NR:</span>{' '}
          {idNumber || '—'}
        </p>

        <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
          {description?.[language] || 'No description available'}
        </p>
      </div>
    </button>
  );
};

export default ProductMenuItem;

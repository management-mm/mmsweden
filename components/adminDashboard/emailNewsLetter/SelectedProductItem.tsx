'use client';

import { type FC, useContext } from 'react';

import type { IProduct } from '@interfaces/IProduct';

import {
  SelectedItemsContext,
  SlotItemMapContext,
} from './EmailNewsLetterMain';

import SvgIcon from '@components/common/SvgIcon';

import { toggleSelectedProducts } from '@store/selectedProductsSlice';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getProductName from '@utils/getProductName';
import initSlotItemMap from '@utils/initSlotItemMap';

import { IconId } from '@enums/iconsSpriteId';

interface ISelectedProductItemProps {
  itemId: string;
  item: IProduct;
}

const SelectedProductItem: FC<ISelectedProductItemProps> = ({
  itemId,
  item,
}) => {
  const { name, description, idNumber, photos } = item;

  const { setItems } = useContext(SelectedItemsContext);
  const { setSlotItemMap } = useContext(SlotItemMapContext);

  const language = useCurrentLocale();
  const dispatch = useAppDispatch();
  const handleRemove = () => {
    dispatch(toggleSelectedProducts(item));

    setItems(prevItems => {
      const updatedItems = prevItems.filter(i => i.id !== String(itemId));

      setSlotItemMap(initSlotItemMap(updatedItems, 'id'));

      return updatedItems;
    });
  };
  return (
    <div className="relative min-h-[100px] w-full" data-swapy-item={itemId}>
      <img
        src={photos[0]}
        alt={`photo-${getProductName(name, language)}`}
        className="h-full w-full rounded object-cover"
      />
      <button
        type="button"
        data-swapy-no-drag
        className="absolute top-1 right-1 rounded-full border bg-white p-1"
        onClick={handleRemove}
      >
        <SvgIcon iconId={IconId.Trash} size={{ width: 16, height: 16 }} />
      </button>
      <h3 className="text-primary line-clamp-2 text-[16px] font-semibold uppercase">
        {name && getProductName(name, language)}
      </h3>
      <p className="text-secondary-accent mb-[4px] text-[14px] font-semibold">
        ID NR <span> {idNumber}</span>
      </p>
      <p className="text-desc line-clamp-2 text-[14px]">
        {description[language]}
      </p>
    </div>
  );
};

export default SelectedProductItem;

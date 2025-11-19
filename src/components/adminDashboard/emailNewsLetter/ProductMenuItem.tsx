import { type FC, useContext, useMemo } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import clsx from 'clsx';

import {
  SelectedItemsContext,
  SlotItemMapContext,
} from './EmailNewsLetterMain';

import { LanguageContextAdmin } from '@components/AdminSharedLayout';
import SvgIcon from '@components/common/SvgIcon';

import { toggleSelectedProducts } from '@store/selectedProductsSlice';
import { makeSelectIsProductSelected } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import getProductName from '@utils/getProductName';
import initSlotItemMap from '@utils/initSlotItemMap';

import { IconId } from '@enums/iconsSpriteId';

interface IProductMenuItemProps {
  product: IProduct;
}
const ProductMenuItem: FC<IProductMenuItemProps> = ({ product }) => {
  const { language } = useContext(LanguageContextAdmin);
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
    <div
      onClick={handleClick}
      className={clsx(
        'relative flex gap-[8px] rounded-[22px] p-[12px] hover:bg-gray-300',
        isSelected ? 'border-2 border-secondaryAccent' : ''
      )}
    >
      {isSelected && (
        <div
          className={clsx(
            'absolute right-[12px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-secondaryAccent'
          )}
        >
          <SvgIcon
            iconId={IconId.Check}
            size={{ width: 18, height: 18 }}
            className="fill-white"
          />
        </div>
      )}

      <img src={photos[0]} width={80} className="object-contain" />
      <div>
        <h3 className="line-clamp-2 text-[16px] font-semibold uppercase">
          {name && getProductName(name, language)}
        </h3>
        <p className="font-semibol mb-[4px] text-[14px]">
          ID NR <span> {idNumber}</span>
        </p>
        <p className="line-clamp-2 text-[14px]">{description[language]}</p>
      </div>
    </div>
  );
};

export default ProductMenuItem;

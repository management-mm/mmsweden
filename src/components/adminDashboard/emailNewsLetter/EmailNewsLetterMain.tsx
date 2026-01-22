import { type Dispatch, type SetStateAction, useState } from 'react';
import { createContext } from 'react';

import type { IProduct } from '@interfaces/IProduct';
import dayjs from 'dayjs';
import type { SlotItemMapArray } from 'swapy';

import ActionBtns from './ActionBtns';
import ProductsListMenu from './ProductsListMenu';
import SelectedProductsList from './SelectedProductsList';
import WeekPicker from './WeekPicker';

import Search from '@components/allProducts/Search';

import { selectSelectedProducts } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';

import { cn } from '@utils/cn';
import formatDateRange from '@utils/formatDateRange';
import initSlotItemMap from '@utils/initSlotItemMap';

export type Item = {
  id: string;
  product: IProduct;
};
interface SelectedItemsContextType {
  items: Item[];
  setItems: Dispatch<SetStateAction<Item[]>>;
}
interface SlotItemMapContextType {
  slotItemMap: SlotItemMapArray;
  setSlotItemMap: Dispatch<SetStateAction<SlotItemMapArray>>;
}
export const SelectedItemsContext = createContext<SelectedItemsContextType>({
  items: [],
  setItems: () => {},
});

export const SlotItemMapContext = createContext<SlotItemMapContextType>({
  slotItemMap: [],
  setSlotItemMap: () => {},
});

const EmailNewsLetterMain = () => {
  const selectedProducts = useAppSelector(selectSelectedProducts);
  const [dateRangeText, setDateRangeText] = useState<string>(
    formatDateRange(dayjs().subtract(7, 'day').toDate(), dayjs().toDate())
  );
  const [items, setItems] = useState<Item[]>(() =>
    selectedProducts.map((product, index) => ({
      id: String(index + 1),
      product,
    }))
  );
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    initSlotItemMap(items, 'id')
  );

  return (
    <SelectedItemsContext.Provider value={{ items, setItems }}>
      <SlotItemMapContext.Provider value={{ slotItemMap, setSlotItemMap }}>
        <div className={cn('container', 'lg:ml-0')}>
          <div className="mb-[24px] gap-[24px] pt-[30px] md:flex md:pt-[48px] lg:mb-[48px]">
            <div className="lg:pl-[60px]">
              <div className="mb-[24px]">
                <h2 className="mb-[24px] text-[18px]">Week range picker</h2>
                <WeekPicker setDateRangeText={setDateRangeText} />
              </div>
              <h2 className="mb-[24px] text-[18px]">Search Products</h2>
              <Search className="md:w-[500px]" />
              <ProductsListMenu />
            </div>
            <SelectedProductsList />
          </div>
          {selectedProducts.length !== 0 && (
            <ActionBtns dateRangeText={dateRangeText} />
          )}
        </div>
      </SlotItemMapContext.Provider>
    </SelectedItemsContext.Provider>
  );
};

export default EmailNewsLetterMain;

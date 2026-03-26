'use client';

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
        <section className="min-h-screen bg-gray-50 px-4 py-6 md:px-6 lg:px-8">
          <div className="mx-auto max-w-[1400px]">
            <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">
                  Email Newsletter Builder
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                  Choose a week range, search for products, and prepare your
                  newsletter content.
                </p>
              </div>

              <div className="mb-6 h-px bg-gray-200" />

              <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
                <div className="min-w-0 space-y-6">
                  <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <h2 className="text-base font-semibold text-gray-800">
                      Week range picker
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Selected period: {dateRangeText}
                    </p>

                    <div className="mt-4">
                      <WeekPicker setDateRangeText={setDateRangeText} />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <h2 className="text-base font-semibold text-gray-800">
                      Search Products
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Find products and add them to the newsletter list.
                    </p>

                    <div className="mt-4">
                      <Search className="w-full" />
                    </div>

                    <div className="mt-4">
                      <ProductsListMenu />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="mb-4">
                    <h2 className="text-base font-semibold text-gray-800">
                      Selected Products
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Organize the products that will appear in your newsletter.
                    </p>
                  </div>

                  <SelectedProductsList />
                </div>
              </div>

              {selectedProducts.length !== 0 && (
                <>
                  <div className="my-6 h-px bg-gray-200" />

                  <div className="flex justify-end">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <ActionBtns dateRangeText={dateRangeText} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </SlotItemMapContext.Provider>
    </SelectedItemsContext.Provider>
  );
};

export default EmailNewsLetterMain;

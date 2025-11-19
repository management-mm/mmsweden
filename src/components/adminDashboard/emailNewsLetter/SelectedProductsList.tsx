import { useContext, useEffect, useMemo, useRef } from 'react';

import clsx from 'clsx';
import { type Swapy, createSwapy } from 'swapy';

import {
  SelectedItemsContext,
  SlotItemMapContext,
} from './EmailNewsLetterMain';
import SelectedProductItem from './SelectedProductItem';

import { switchItems } from '@store/selectedProductsSlice';
import { selectSelectedProducts } from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import dynamicSwapy from '@utils/dynamicSwapy';
import toSlottedItems from '@utils/toSlottedItems';

const SelectedProductsList = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectSelectedProducts);
  const { items, setItems } = useContext(SelectedItemsContext);
  const { slotItemMap, setSlotItemMap } = useContext(SlotItemMapContext);

  const slottedItems = useMemo(
    () => toSlottedItems(items, 'id', slotItemMap),
    [items, slotItemMap]
  );
  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dynamicSwapy(swapyRef.current, items, 'id', slotItemMap, setSlotItemMap);
  }, [items]);

  useEffect(() => {
    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      autoScrollOnDrag: true,
      swapMode: 'drop',
    });

    swapyRef.current.onSwap(event => {
      const slots = event.newSlotItemMap.asArray;

      const toSlot = slots.findIndex(item => item.slot === event.toSlot);
      const fromSlot = slots.findIndex(item => item.slot === event.fromSlot);

      const filteredSlotItemMap = event.newSlotItemMap.asArray.filter(
        ({ item }) => items.some(i => i.id === item)
      );

      setSlotItemMap(
        items.length !== 0 ? filteredSlotItemMap : event.newSlotItemMap.asArray
      );
      setItems(prev => {
        const newItems = [...prev];
        const [moved] = newItems.splice(fromSlot, 1);
        newItems.splice(toSlot, 0, moved);
        return newItems;
      });

      if (products.length !== 0) {
        dispatch(
          switchItems({
            fromSlot,
            toSlot,
          })
        );
      }
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, [dispatch, products.length]);

  return (
    <section>
      {products.length !== 0 && (
        <div className="mb-[24px] flex shrink-0 items-center text-[18px] font-semibold md:text-[24px] md:leading-[0.8] lg:mb-[36px]">
        <h2 className="">Selected Products</h2>
        <span>&nbsp;({products.length})</span>
      </div>
      )}
      

      <div className="container" ref={containerRef}>
        <div className="flex flex-wrap gap-[16px]">
          {slottedItems.map(({ slotId, itemId, item }, index) => (
            <div
              key={slotId}
              data-swapy-slot={slotId}
              style={
                { '--slot-id': `"${index + 1} spot"` } as React.CSSProperties
              }
              className={clsx(
                'before:content-[var(--slot-id)]',
                Number(index) === 0 ? 'w-full' : 'w-[calc((100%-16px)/2)]'
              )}
            >
              {item && (
                <SelectedProductItem itemId={itemId} item={item.product} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SelectedProductsList;

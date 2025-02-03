import type { SlotItemMapArray, Swapy } from 'swapy';

function dynamicSwapy<Item>(
  swapy: Swapy | null,
  items: Array<Item>,
  idField: keyof Item,
  slotItemMap: SlotItemMapArray,
  setSlotItemMap: (slotItemMap: SlotItemMapArray) => void,
  removeItemOnly = false
) {
  const newItems: SlotItemMapArray = items
    .filter(
      item => !slotItemMap.some(slotItem => slotItem.item === item[idField])
    )
    .map(item => ({
      slot: item[idField] as string,
      item: item[idField] as string,
    }));

  let withoutRemovedItems: SlotItemMapArray;

  if (!removeItemOnly) {
    withoutRemovedItems = slotItemMap.filter(
      slotItem =>
        items.some(item => item[idField] === slotItem.item) || !slotItem.item
    );
  } else {
    withoutRemovedItems = slotItemMap.map(slotItem => {
      if (!items.some(item => item[idField] === slotItem.item)) {
        return { slot: slotItem.slot as string, item: '' };
      }
      return slotItem;
    });
  }

  const updatedSlotItemsMap: SlotItemMapArray = [
    ...withoutRemovedItems,
    ...newItems,
  ];

  setSlotItemMap(updatedSlotItemsMap);

  if (
    newItems.length > 0 ||
    withoutRemovedItems.length !== slotItemMap.length
  ) {
    requestAnimationFrame(() => {
      swapy?.update();
    });
  }
}

export default dynamicSwapy;

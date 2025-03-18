import type { SlotItemMapArray } from 'swapy';

function initSlotItemMap<Item>(
  items: Array<Item>,
  idField: keyof Item
): SlotItemMapArray {
  return items.map(item => ({
    item: item[idField] as string,
    slot: item[idField] as string,
  }));
}

export default initSlotItemMap;

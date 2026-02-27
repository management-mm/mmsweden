import { type SlotItemMapArray } from 'swapy';

export type SlottedItems<Item> = Array<{
  slotId: string;
  itemId: string;
  item: Item | null;
}>;

function toSlottedItems<Item>(
  items: Array<Item>,
  idField: keyof Item,
  slotItemMap: SlotItemMapArray
): SlottedItems<Item> {
  return slotItemMap.map(slotItem => ({
    slotId: slotItem.slot,
    itemId: slotItem.item,
    item:
      slotItem.item === ''
        ? null
        : items.find(item => slotItem.item === item[idField])!,
  }));
}

export default toSlottedItems;

import { type FC, useEffect, useMemo, useRef } from 'react';

import { type FormikValues, useFormikContext } from 'formik';
import { type SlotItemMapArray, type Swapy, createSwapy } from 'swapy';

import { type Item } from './PhotosAndVideo'

import SvgIcon from '@components/common/SvgIcon';

import dynamicSwapy from '@utils/dynamicSwapy';
import toSlottedItems from '@utils/toSlottedItems';

import { IconId } from '@enums/iconsSpriteId';

interface IPhotosListProps {
  editedAvatars: string[];
  setEditedAvatars: (avatars: string[]) => void;
  fileAvatars: (File | undefined)[];
  setFileAvatars: (files: (File | undefined)[]) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  slotItemMap: SlotItemMapArray;
  setSlotItemMap: React.Dispatch<React.SetStateAction<SlotItemMapArray>>;
  photoQueue: (string | File)[];
  setPhotoQueue: (items: (string | File)[]) => void;
}

const PhotosList: FC<IPhotosListProps> = ({
  editedAvatars,
  setEditedAvatars,
  fileAvatars,
  setFileAvatars,
  items,
  setItems,
  slotItemMap,
  setSlotItemMap,
  photoQueue,
  setPhotoQueue,
}) => {
  const { setFieldValue } = useFormikContext<FormikValues>();

  const slottedItems = useMemo(
    () => toSlottedItems(items, 'id', slotItemMap),
    [items, slotItemMap]
  );

  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const swapItems = <T,>(array: T[], index1: number, index2: number): T[] => {
    const newArray = [...array];
    [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
    return newArray;
  };

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

      if (editedAvatars.length !== 0) {
        const swappedFiles = swapItems(fileAvatars, toSlot, fromSlot);
        setFileAvatars(swappedFiles);
        const swapedPhotos = swapItems(editedAvatars, toSlot, fromSlot);
        setEditedAvatars(swapedPhotos);
        const swapedPhotoQueue = swapItems(photoQueue, toSlot, fromSlot);
        setPhotoQueue(swapedPhotoQueue);
      }
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, [fileAvatars, swapItems, editedAvatars, photoQueue]);

  useEffect(() => {
    setFieldValue(
      'photos',
      fileAvatars.filter(file => Boolean(file) !== false),
      false
    );
  }, [fileAvatars, setFieldValue]);

  useEffect(() => {
    setFieldValue('photoQueue', photoQueue, false);
  }, [photoQueue, setFieldValue]);

  const handleDelete = (itemId: string, slotId: string) => {
    const slotToDeleteId = slotItemMap.findIndex(item => item.slot === slotId);

    const updatedItems = items.filter(item => item.id !== itemId);

    const updatedEditedAvatars = editedAvatars.filter(
      (_, i) => i != slotToDeleteId
    );

    const updatedFileAvatars = fileAvatars.filter(
      (_, i) => i != slotToDeleteId
    );

    const updatedPhotoQueue = photoQueue.filter(
      (_: File | string, i: number) => i != slotToDeleteId
    );

    setItems(updatedItems);
    setEditedAvatars(updatedEditedAvatars);
    setFileAvatars(updatedFileAvatars);
    setSlotItemMap(
      slotItemMap.filter(({ item }) => updatedItems.some(i => i.id === item))
    );
    setPhotoQueue(updatedPhotoQueue);
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="flex flex-wrap gap-[16px]">
        {slottedItems.map(({ slotId, itemId, item }, index) => (
          <div
            key={slotId}
            data-swapy-slot={slotId}
            style={
              { '--slot-id': `"${index + 1} spot"` } as React.CSSProperties
            }
            className="w-[calc((100%-16px)/2)] before:content-[var(--slot-id)]"
          >
            {item && (
              <div className="relative" data-swapy-item={itemId} key={itemId}>
                <img
                  src={item.src}
                  alt={`photo-${item.id}`}
                  className="h-full w-full rounded object-cover"
                />
                <button
                  type="button"
                  data-swapy-no-drag
                  className="absolute right-1 top-1 rounded-full border bg-white p-1"
                  onClick={() => handleDelete(item.id, slotId)}
                >
                  <SvgIcon
                    iconId={IconId.Trash}
                    size={{ width: 16, height: 16 }}
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotosList;

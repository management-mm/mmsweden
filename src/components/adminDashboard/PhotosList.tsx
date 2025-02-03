import { useEffect, useMemo, useRef, useState, type FC, useCallback } from 'react';
import { useFormikContext, type FormikValues } from 'formik';
import { createSwapy, type SlotItemMapArray, type Swapy } from 'swapy';

import SvgIcon from '@components/common/SvgIcon';
import { IconId } from '@enums/iconsSpriteId';
import initSlotItemMap from '@utils/initSlotItemMap';
import dynamicSwapy from '@utils/dynamicSwapy';
import toSlottedItems from '@utils/toSlottedItems';

import type { Item } from './PhotosAndVideo';

interface IPhotosListProps {
  editedAvatars: string[];
  setEditedAvatars: (avatars: string[]) => void;
  fileAvatars: File[];
  setFileAvatars: (files: File[]) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
}

const PhotosList: FC<IPhotosListProps> = ({ 
  editedAvatars, 
  setEditedAvatars, 
  fileAvatars, 
  setFileAvatars, 
  items, 
  setItems 
}) => {
  const { setFieldValue } = useFormikContext<FormikValues>();

  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    initSlotItemMap(items, 'id')
  );

  const slottedItems = useMemo(() => toSlottedItems(items, 'id', slotItemMap), [items, slotItemMap])

  const swapyRef = useRef<Swapy | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const swapItems = useCallback(<T,>(array: T[], index1: number, index2: number): T[] => {
  const newArray = [...array];
  [newArray[index1], newArray[index2]] = [newArray[index2], newArray[index1]];
  return newArray;
}, []);

  useEffect(() => {
    dynamicSwapy(swapyRef.current, items, 'id', slotItemMap, setSlotItemMap);
  }, [items]);

  useEffect(() => {
    console.log("fileAvatars", fileAvatars)

    swapyRef.current = createSwapy(containerRef.current!, {
      manualSwap: true,
      autoScrollOnDrag: true,
      swapMode: 'drop',
    });

    swapyRef.current.onSwap((event) => {
      console.log(event.newSlotItemMap.asArray)
      setSlotItemMap(event.newSlotItemMap.asArray);
      if (editedAvatars.length !== 0) {
        const swappedFiles = swapItems(fileAvatars, Number(event.toSlot) - 1, Number(event.fromSlot) - 1);
        setFileAvatars(swappedFiles);
        const swapedPhotos = swapItems(editedAvatars, Number(event.toSlot) - 1, Number(event.fromSlot) - 1);
        setEditedAvatars(swapedPhotos)
      }
  
    });

    return () => {
      swapyRef.current?.destroy();
    };
  }, [fileAvatars, setFileAvatars, swapItems, editedAvatars, setEditedAvatars]);

  useEffect(() => {
    setFieldValue('photos', fileAvatars, false);
  }, [fileAvatars, setFieldValue]);

  return (
    <div className="container" ref={containerRef}>
      <div className="flex gap-[16px] flex-wrap">
        {slottedItems.map(({ slotId, itemId, item }, index) => (
          <div 
            key={slotId}
            data-swapy-slot={slotId}
            style={{ '--slot-id': `"${index+1} spot"` } as React.CSSProperties} 
            className="w-[calc((100%-16px)/2)] before:content-[var(--slot-id)]"
          >
            {item && (
              <div className="relative" data-swapy-item={itemId} key={itemId}>
                <img 
                  src={item.src} 
                  alt={`photo-${item.id}`} 
                  className="w-full h-full object-cover rounded" 
                />
                <button
                  type="button"
                  data-swapy-no-drag
                  className="absolute top-1 right-1 bg-white p-1 rounded-full border"
                  onClick={() => {
                    const updatedEditedAvatars = editedAvatars.filter((_, i) => {
  const correspondingItem = items[i];
  return correspondingItem && correspondingItem.id !== item.id;
                    });
                    

const updatedFileAvatars = fileAvatars.filter((_, i) => {
  const correspondingItem = items[i];
  return correspondingItem && correspondingItem.id !== item.id;
});
                    
                    setEditedAvatars(updatedEditedAvatars);
                    setFileAvatars(updatedFileAvatars);
                    const updatedItems = items.filter(i => i.id !== item.id);
                    setItems(updatedItems);
                    // setSlotItemMap(initSlotItemMap(updatedItems, 'id'));
                  }}
                >
                  <SvgIcon iconId={IconId.Trash} size={{ width: 16, height: 16 }} />
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

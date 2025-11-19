import { type ChangeEvent, type FC, useState } from 'react';

import type { SlotItemMapArray } from 'swapy';

import PhotosList from './PhotosList';
import UploadButtons from './UploadButtons';

import Desc from '../common/Desc';

import LabelTitle from '@components/common/LabelTitle';

import initSlotItemMap from '@utils/initSlotItemMap';

export type Item = {
  id: string;
  src: string;
};

interface IPhotoAndVideoProps {
  initialPhotos?: string[];
  initialVideo?: string;
}

const PhotosAndVideo: FC<IPhotoAndVideoProps> = ({
  initialPhotos = [],
  initialVideo = '',
}) => {
  const [editedAvatars, setEditedAvatars] = useState<string[]>(initialPhotos);
  const [photoQueue, setPhotoQueue] =
    useState<(string | File)[]>(initialPhotos);
  const [fileAvatars, setFileAvatars] = useState<(File | undefined)[]>(() => {
    return initialPhotos.map(() => undefined);
  });
  const [items, setItems] = useState<Item[]>(() =>
    editedAvatars.map((src, index) => ({ id: String(index + 1), src }))
  );
  const [slotItemMap, setSlotItemMap] = useState<SlotItemMapArray>(
    initSlotItemMap(items, 'id')
  );

  const handleChangePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 7) {
      alert('No more than 7 photos');
      e.target.value = '';
      return;
    }

    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newFileAvatars: File[] = [];

      const readFile = (file: File): Promise<string> => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = event => resolve(event.target?.result as string);
          reader.readAsDataURL(file);
        });
      };

      Promise.all(
        filesArray.map(file => {
          newFileAvatars.push(file);
          return readFile(file);
        })
      ).then(newEditedAvatars => {
        setEditedAvatars(prev => [...prev, ...newEditedAvatars]);

        const updatedItems = [
          ...items,
          ...newEditedAvatars.map((src, i) => ({
            id: String(items.length + i + 1),
            src,
          })),
        ];

        setItems(updatedItems);
        setSlotItemMap(initSlotItemMap(updatedItems, 'id'));

        setFileAvatars(prev => [...prev, ...newFileAvatars]);
        setPhotoQueue(prev => [...prev, ...newFileAvatars]);
      });

      e.target.value = '';
    }
  };

  return (
    <div>
      <div className="mb-[20px]">
        <LabelTitle title="Photos" />
        <Desc
          text="The first photo will be on the cover of the ad. Drag to change the
          order of the photos."
        />
        <PhotosList
          editedAvatars={editedAvatars}
          setEditedAvatars={setEditedAvatars}
          fileAvatars={fileAvatars}
          setFileAvatars={setFileAvatars}
          items={items}
          setItems={setItems}
          slotItemMap={slotItemMap}
          setSlotItemMap={setSlotItemMap}
          photoQueue={photoQueue}
          setPhotoQueue={setPhotoQueue}
        />
      </div>

      <UploadButtons
        initialVideo={initialVideo}
        editedAvatars={editedAvatars}
        handleChangePhoto={handleChangePhoto}
      />
    </div>
  );
};

export default PhotosAndVideo;

import { type ChangeEvent, type FC, useState } from 'react';

import type { SlotItemMapArray } from 'swapy';

import Desc from './Desc';
import PhotosList from './PhotosList';
import UploadButtons from './UploadButtons';

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
  // const base64toFile = (base64String, mimeType, fileName) => {
  //   const base64Data = base64String.replace(/^data:.+;base64,/, '');
  //   const byteCharacters = atob(base64Data);
  //   const byteNumbers = new Array(byteCharacters.length);

  //   for (let i = 0; i < byteCharacters.length; i++) {
  //     byteNumbers[i] = byteCharacters.charCodeAt(i);
  //   }

  //   const byteArray = new Uint8Array(byteNumbers);
  //   const blob = new Blob([byteArray], { type: mimeType });
  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = fileName;
  //   link.click();

  //   URL.revokeObjectURL(url);
  // };

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
      console.log(editedAvatars);
      const filesArray = Array.from(e.target.files);
      const newFileAvatars: File[] = [];
      const newEditedAvatars: string[] = [];

      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target?.result) {
            newEditedAvatars.push(event.target.result as string);
          }
          if (newEditedAvatars.length === filesArray.length) {
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
          }
        };
        reader.readAsDataURL(file);
        newFileAvatars.push(file);
      });

      setFileAvatars(prev => [...prev, ...newFileAvatars]);
      setPhotoQueue(prev => [...prev, ...newFileAvatars]);
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

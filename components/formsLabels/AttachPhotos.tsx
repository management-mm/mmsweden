import { type ChangeEvent, useState } from 'react';

import {
  ErrorMessage,
  Field,
  type FormikValues,
  useFormikContext,
} from 'formik';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import SvgIcon from '@components/common/SvgIcon';

import { Label } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const AttachPhotos = () => {
  const t = useTranslations();
  const [editedAvatars, setEditedAvatars] = useState<string[]>([]);
  const [fileAvatars, setFileAvatars] = useState<File[]>([]);
  const { setFieldValue } = useFormikContext<FormikValues>();

  const handleChangePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const filesArray = Array.from(e.target.files);

    const newEditedAvatarsPromises = filesArray.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = event => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };

        reader.onerror = () => reject(new Error('FileReader error'));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newEditedAvatarsPromises)
      .then(newEditedAvatars => {
        setEditedAvatars(prev => [...prev, ...newEditedAvatars]);

        setFileAvatars(prev => {
          const updatedFiles = [...prev, ...filesArray];
          setFieldValue('photos', updatedFiles, false);
          return updatedFiles;
        });
      })
      .catch(error => {
        console.error(error);
      });

    e.target.value = '';
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setEditedAvatars(prev =>
      prev.filter((_, index) => index !== indexToRemove)
    );

    setFileAvatars(prev => {
      const updatedFiles = prev.filter((_, index) => index !== indexToRemove);
      setFieldValue('photos', updatedFiles, false);
      return updatedFiles;
    });
  };

  return (
    <div className="font-openSans text-primary mb-[32px] flex flex-col items-start gap-[12px] text-[14px]">
      {editedAvatars.length > 0 ? (
        <div className="grid grid-cols-2 place-items-center gap-[10px] sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
          {editedAvatars.map((avatar, index) => (
            <div key={index} className="relative">
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className="absolute top-[-6px] right-[-6px] z-10 flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full bg-white shadow-md"
                aria-label={`Remove photo ${index + 1}`}
              >
                <SvgIcon
                  iconId={IconId.Close}
                  size={{ width: 10, height: 10 }}
                  className="fill-primary"
                />
              </button>

              <div className="relative h-[80px] w-[80px] overflow-hidden rounded-[4px]">
                <Image
                  src={avatar}
                  alt={`photo-${index}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          ))}

          <div>
            <label className="flex cursor-pointer items-center gap-[12px]">
              <Field
                type="file"
                name="photos"
                accept="image/*"
                className="sr-only"
                multiple
                onChange={handleChangePhoto}
                value=""
              />
              <SvgIcon
                iconId={IconId.Plus}
                size={{ width: 28, height: 28 }}
                className="fill-primary"
              />
              <ErrorMessage name="photos">
                {msg => <div className="mt-1 text-sm text-red-500">{msg}</div>}
              </ErrorMessage>
            </label>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-[12px]">
          <Field
            type="file"
            name="photos"
            accept="image/*"
            className="sr-only"
            multiple
            onChange={handleChangePhoto}
            value=""
          />
          <SvgIcon
            iconId={IconId.Clip}
            size={{ width: 24, height: 22 }}
            className="fill-primary"
          />
          {t(Label.AttachPhotos)}
        </label>
      )}
    </div>
  );
};

export default AttachPhotos;

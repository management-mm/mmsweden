import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Field, FieldArray } from 'formik';

import SvgIcon from '@components/common/SvgIcon';

import { Label } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const AttachPhotos = () => {
  const { t } = useTranslation();
  const [editedAvatars, setEditedAvatars] = useState([]);
  const [fileAvatars, setFileAvatars] = useState([]);

  const handleChangePhoto = e => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      const filePreviews = filesArray.map(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
          setEditedAvatars(prev => [...prev, e.target.result]);
        };
        reader.readAsDataURL(file);
        return file;
      });

      setFileAvatars(prev => [...prev, ...filePreviews]);
    }
  };

  return (
    <div className="mb-[32px] flex flex-col items-start gap-[12px] font-openSans text-[14px] text-primary">
      {editedAvatars.length > 0 ? (
        <div className="grid grid-cols-2 place-items-center gap-[10px] sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-12">
          {editedAvatars.map((avatar, index) => (
            <div className="relative">
              {/* <button 
                className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:w-full hover-h-full hover:bg-[linear-gradient(0deg,rgba(5,5,5,0.40)0%,rgba(5,5,5,0.40)100%)'
                onClick={() => {
                  setEditedAvatars(prev => prev.filter((_, fileIndex) => fileIndex !== index));

                }}
                type='button'>
                  <SvgIcon
                
                className=" fill-white transition-opacity duration-primary opacity-0 hover:opacity-100" 
                iconId={IconId.Cancel}
                size={{ width: 20, height: 20 }} />
              </button> */}

              <img
                key={index}
                src={avatar}
                alt={`photo-${index}`}
                className="h-[80px] w-full rounded-[4px] object-cover"
              />
            </div>
          ))}

          <div className="">
            <label className="flex cursor-pointer items-center gap-[12px]">
              <Field
                type="file"
                name="products"
                accept="image/*"
                className="sr-only"
                multiple
                onChange={handleChangePhoto}
              />
              <SvgIcon
                iconId={IconId.Plus}
                size={{ width: 40, height: 40 }}
                className="fill-primary"
              />
            </label>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer items-center gap-[12px]">
          <Field
            type="file"
            name="products"
            accept="image/*"
            className="sr-only"
            multiple
            onChange={handleChangePhoto}
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

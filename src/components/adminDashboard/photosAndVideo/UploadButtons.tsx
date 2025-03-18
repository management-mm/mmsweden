import { type ChangeEvent, type FC, useState } from 'react';

import { Field } from 'formik';

import InputFieldWithCheck from '../formsFields/InputFieldWithCheck';

import LabelTitle from '@components/common/LabelTitle';
import SvgIcon from '@components/common/SvgIcon';
import VideoPlayer from '@components/common/VideoPlayer';

import { IconId } from '@enums/iconsSpriteId';

interface IUploadButtonsProps {
  editedAvatars: string[];
  initialVideo: string;
  handleChangePhoto: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UploadButtons: FC<IUploadButtonsProps> = ({
  editedAvatars,
  initialVideo,
  handleChangePhoto,
}) => {
  const [inputValue, setInputValue] = useState(initialVideo);

  const handleCheck = (value: string | boolean) => {
    setInputValue(value as string);
  };

  return (
    <div>
      {editedAvatars.length !== 7 && (
        <label className="mb-[20px] flex items-center justify-center gap-[8px] rounded-[32px] border border-primary py-[10px]">
          <Field
            type="file"
            name="photos"
            accept="image/*"
            className="sr-only"
            multiple
            onChange={handleChangePhoto}
            value={''}
          />
          <SvgIcon
            iconId={IconId.Upload}
            size={{ width: 16, height: 16 }}
            className="fill-primary"
          />
          Upload images
        </label>
      )}
      <div className="flex flex-col gap-[20px]">
        <label>
          <LabelTitle title="Video" />
          <InputFieldWithCheck
            required={false}
            initialValue={initialVideo}
            name="video"
            placeholder="Enter link of the video"
            handleCheck={handleCheck}
          />
        </label>
        {inputValue && <VideoPlayer video={inputValue} />}
      </div>
    </div>
  );
};

export default UploadButtons;

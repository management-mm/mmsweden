import type { FC } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { filters } from '@enums/filters';
import { IconId } from '@enums/iconsSpriteId';

interface IAddNewCatManIndProps {
  itemName: filters.Category | filters.Industry | filters.Manufacturer | 'name';
  setIsClick: (value: boolean) => void;
  setFieldCount: React.Dispatch<React.SetStateAction<number>>;
}

const AddNewCatManInd: FC<IAddNewCatManIndProps> = ({
  itemName,
  setIsClick,
  setFieldCount,
}) => {
  return (
    <button
      type="button"
      onClick={() => {
        if (itemName === filters.Industry) {
          setFieldCount((prev: number) => prev + 1);
        } else {
          setIsClick(true);
        }
      }}
      className="flex items-center gap-[6px]"
    >
      <SvgIcon
        className="fill-secondaryAccent"
        iconId={IconId.Plus}
        size={{ width: 14, height: 14 }}
      />
      <span className="font-openSans text-[14px] text-secondaryAccent">
        Add new {itemName}
      </span>
    </button>
  );
};

export default AddNewCatManInd;

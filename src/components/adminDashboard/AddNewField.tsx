import type { FC } from 'react';

import SvgIcon from '@components/common/SvgIcon';

import { filters } from '@enums/filters';
import { IconId } from '@enums/iconsSpriteId';

interface IAddNewFieldProps {
  itemName:
    | filters.Category
    | filters.Industry
    | filters.Manufacturer
    | 'name'
    | 'description';
  setIsClick: (value: boolean) => void;
  setFieldCount: React.Dispatch<React.SetStateAction<number>>;
}

const AddNewField: FC<IAddNewFieldProps> = ({
  itemName,
  setIsClick,
  setFieldCount,
}) => {
  return (
    <button
      type="button"
      onClick={event => {
        event.preventDefault();
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
        {itemName === 'description' || itemName === 'name'
          ? 'Add input field to change'
          : 'Add new'}{' '}
        {itemName}
      </span>
    </button>
  );
};

export default AddNewField;

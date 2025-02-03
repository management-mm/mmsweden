import { nanoid } from 'nanoid';

import SvgIcon from '@components/common/SvgIcon';

import { IconId } from '@enums/iconsSpriteId';
import type { MultiLanguageString } from '@interfaces/IProduct';
import type { Dispatch, FC, SetStateAction } from 'react';

interface ICheckedCatManIndItemProps {
  checkedValue: MultiLanguageString | string
  checkedValuesArray?: (string | MultiLanguageString)[] | string
  setCheckedValue: Dispatch<SetStateAction<MultiLanguageString | string | (MultiLanguageString | string)[]>>
}

const CheckedCatManIndItem: FC<ICheckedCatManIndItemProps> = ({
  checkedValue,
  checkedValuesArray,
  setCheckedValue
}) => {
  return (
    <button
      type="button"
      key={nanoid()}
      onClick={e => {
        if (Array.isArray(checkedValuesArray)) {
          setCheckedValue(
            checkedValuesArray.filter(
              value => value !== e.currentTarget.textContent
            )
          );
          return;
        }
        setCheckedValue([""]);
      }}
      className="flex items-center gap-[8px] rounded-[32px] border border-primary bg-secondary px-[8px] py-[7px] text-[12px] text-primary"
    >
      {typeof checkedValue === 'object' ? checkedValue.en : checkedValue}
      <div className="flex h-[12px] w-[12px] items-center justify-center rounded-full bg-primary">
        <SvgIcon
          className="fill-[rgb(234,241,248)]"
          iconId={IconId.Reset}
          size={{ width: 6, height: 6 }}
        />
      </div>
    </button>
  );
};

export default CheckedCatManIndItem;

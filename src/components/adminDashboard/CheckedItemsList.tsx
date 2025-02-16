import type { Dispatch, FC, SetStateAction } from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';

import CheckedCatManIndItem from './CheckedCatManIndItem';

interface ICheckedItemsListProps {
  checkedValue: (string | MultiLanguageString)[] | string | MultiLanguageString;
  setCheckedValue: Dispatch<
    SetStateAction<
      MultiLanguageString | string | (MultiLanguageString | string)[]
    >
  >;
}

const CheckedItemsList: FC<ICheckedItemsListProps> = ({
  checkedValue,
  setCheckedValue,
}) => (
  <div className="mb-[20px] flex flex-wrap gap-[12px]">
    {Array.isArray(checkedValue) ? (
      checkedValue.map(value => (
        <CheckedCatManIndItem
          checkedValue={value}
          checkedValuesArray={checkedValue}
          setCheckedValue={setCheckedValue}
        />
      ))
    ) : (
      <CheckedCatManIndItem
        checkedValue={checkedValue}
        setCheckedValue={setCheckedValue}
      />
    )}
  </div>
);

export default CheckedItemsList;

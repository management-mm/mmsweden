import {
  type ChangeEvent,
  type Dispatch,
  type FC,
  type SetStateAction,
  useState,
} from 'react';

import type { ICategory } from '@interfaces/ICategory';
import type { IManufacturer } from '@interfaces/IManufacturer';
import type { MultiLanguageString } from '@interfaces/IProduct';
import { useFormikContext } from 'formik';

import AddNewCatManInd from './AddNewCatManInd';
import Block from './Block';
import CheckedItemsList from './CheckedItemsList';
import GroupedFilterItems from './GroupedFilterItems';
import InputFieldWithCheck from './InputFieldWithCheck';

import LabelTitle from '@components/common/LabelTitle';
import SearchFilter from '@components/common/SearchFilter';

import { filters } from '@enums/filters';

interface ICatManIndItemProps {
  itemName: filters.Category | filters.Manufacturer;
  items: ICategory[] | IManufacturer[];
  isLoading: boolean;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  initialValue: MultiLanguageString | string | (MultiLanguageString | string)[];
}

const CatManIndItem: FC<ICatManIndItemProps> = ({
  itemName,
  items,
  isLoading,
  keyword,
  setKeyword,
  initialValue,
}) => {
  const [isClick, setIsClick] = useState(false);
  const [checkedValue, setCheckedValue] = useState(initialValue);

  const { setFieldValue } = useFormikContext();

  const handleCheck = (value: string) => {
    setFieldValue(`${itemName}`, value, false);
    setCheckedValue(value);
  };

  const handleCheckedValue = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckedValue(event.target.value);
    setFieldValue(`${itemName}`, event.target.value, false);
  };

  return (
    <fieldset className="mb-[10px]">
      <Block title={itemName} intent="filter">
        {checkedValue && (
          <CheckedItemsList
            checkedValue={checkedValue}
            setCheckedValue={setCheckedValue}
          />
        )}

        <SearchFilter keyword={keyword} setKeyword={setKeyword} />

        <GroupedFilterItems
          items={items}
          itemName={itemName}
          isLoading={isLoading}
          handleCheckedValue={handleCheckedValue}
          checkedValue={checkedValue}
        />
        {isClick ? (
          <>
            <LabelTitle title={`Add new ${itemName}`} />
            <InputFieldWithCheck
              placeholder={`Enter ${itemName}`}
              name={itemName}
              title={`Enter ${itemName}`}
              handleCheck={handleCheck}
            />
          </>
        ) : (
          <AddNewCatManInd
            itemName={itemName}
            setIsClick={setIsClick}
            setFieldCount={() => {}}
          />
        )}
      </Block>
    </fieldset>
  );
};

export default CatManIndItem;

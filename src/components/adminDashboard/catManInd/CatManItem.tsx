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

import CheckedItemsList from './CheckedItemsList';
import GroupedFilterItems from './GroupedFilterItems';

import AddNewCatManInd from '../AddNewField';
import Block from '../Block';
import InputFieldWithCheck from '../formsFields/InputFieldWithCheck';

import LabelTitle from '@components/common/LabelTitle';
import SearchFilter from '@components/common/SearchFilter';

import { filters } from '@enums/filters';

interface ICatManItemProps {
  itemName: filters.Category | filters.Manufacturer;
  items: ICategory[] | IManufacturer[];
  isLoading: boolean;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  initialValue: MultiLanguageString | string | (MultiLanguageString | string)[];
}

const CatManItem: FC<ICatManItemProps> = ({
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

  const handleCheck = (value: string | boolean) => {
    setFieldValue(`${itemName}`, value, false);
    setCheckedValue(value as string);
  };

  const handleCheckedValue = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckedValue(
      event.target.value !== checkedValue ? event.target.value : ''
    );
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
              required={false}
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

export default CatManItem;

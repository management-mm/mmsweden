import { useState, type ChangeEvent, type Dispatch, type FC, type SetStateAction } from 'react';

import { useFormikContext } from 'formik';

import AddNewCatManInd from './AddNewCatManInd';
import Block from './Block';
import CheckedItemsList from './CheckedItemsList';
import GroupedFilterItems from './GroupedFilterItems';
import InputFieldWithCheck from './InputFieldWithCheck';

import LabelTitle from '@components/common/LabelTitle';
import SearchFilter from '@components/common/SearchFilter';
import type { IIndustry } from '@interfaces/IIndustry';
import { filters } from '@enums/filters';
import type { MultiLanguageString } from '@interfaces/IProduct';

interface IIndustryProps {
  items: IIndustry[]
  isLoading: boolean
  keyword: string
  setKeyword: Dispatch<SetStateAction<string>>
  initialValue: MultiLanguageString | string | (string | MultiLanguageString)[]
}

const Industry:FC<IIndustryProps> = ({ items, isLoading, keyword, setKeyword, initialValue }) => {
  const [checkedValue, setCheckedValue] = useState(
  Array.isArray(initialValue) ? initialValue : initialValue ? [initialValue] : []
);

  const [newFieldCount, setNewFieldCount] = useState(0);

  const { setFieldValue } = useFormikContext();

  const handleCheck = (value: string) => {
  if (value) {
    const newCheckedValue = [...checkedValue, value];
    setFieldValue('industries', newCheckedValue.toString(), false);
    setCheckedValue(newCheckedValue);
  }
};

const handleCheckedValue = (event: ChangeEvent<HTMLInputElement>) => {
  if (!checkedValue.includes(event.target.value)) {
    const newCheckedValue = [...checkedValue, event.target.value];
    setFieldValue('industries', newCheckedValue.toString(), false);
    setCheckedValue(newCheckedValue);
  }
};


  return (
    <fieldset className="mb-[10px]">
      <Block title={'industries'} intent="filter">
        {checkedValue && (
          <CheckedItemsList
  checkedValue={checkedValue}
  setCheckedValue={setCheckedValue as Dispatch<SetStateAction<string | MultiLanguageString | (string | MultiLanguageString)[]>>}
/>

        )}

        <SearchFilter keyword={keyword} setKeyword={setKeyword} />

        <GroupedFilterItems
          items={items}
          itemName={'industries'}
          isLoading={isLoading}
          handleCheckedValue={handleCheckedValue}
          checkedValue={checkedValue}
        />

        {newFieldCount === 0 ? (
          <AddNewCatManInd
            itemName={filters.Industry}
            setIsClick={() => {}}
            setFieldCount={setNewFieldCount}
          />
        ) : (
          Array.from({ length: newFieldCount }).map((_, index) => (
            <div key={index}>
              <LabelTitle title={'Add new industry'} />
              <InputFieldWithCheck
                placeholder={'Enter industry'}
                name="industries"
                required={false}
                handleCheck={handleCheck}
              />
              {index === newFieldCount - 1 && index <= 3 && (
                <AddNewCatManInd
                  itemName={filters.Industry}
                  setIsClick={() => {}}
                  setFieldCount={setNewFieldCount}
                />
              )}
            </div>
          ))
        )}
      </Block>
    </fieldset>
  );
};

export default Industry;

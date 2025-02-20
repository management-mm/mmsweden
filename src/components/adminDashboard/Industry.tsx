import {
  type ChangeEvent,
  type Dispatch,
  type FC,
  type SetStateAction,
  useState,
} from 'react';

import type { IIndustry } from '@interfaces/IIndustry';
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

interface IIndustryProps {
  items: IIndustry[];
  isLoading: boolean;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  initialValue: MultiLanguageString | string | (string | MultiLanguageString)[];
}

const Industry: FC<IIndustryProps> = ({
  items,
  isLoading,
  keyword,
  setKeyword,
  initialValue,
}) => {
  const [checkedValues, setCheckedValues] = useState(
  Array.isArray(initialValue)
    ? initialValue.map(value =>
        typeof value === 'object' && value !== null ? value.en : value
      )
    : typeof initialValue === 'object' && initialValue !== null
      ? [initialValue.en]
      : [initialValue]
);

  const [newFieldCount, setNewFieldCount] = useState(0);

  const { setFieldValue } = useFormikContext();

  const handleCheck = (value: string) => {
    console.log('array', checkedValues)
    if (value) {
      const newCheckedValue =checkedValues.includes(value) ? checkedValues.filter(checkedValue => checkedValue !== value) : [...checkedValues, value];
      setFieldValue('industries', newCheckedValue.toString(), false);
      setCheckedValues(newCheckedValue);
    }
  };

  const handleCheckedValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value) {
      console.log('array', checkedValues)
      const newCheckedValue = checkedValues.includes(event.target.value) ? checkedValues.filter(checkedValue => checkedValue !== event.target.value) : [...checkedValues, event.target.value];
      setFieldValue('industries', newCheckedValue.toString(), false);
      setCheckedValues(newCheckedValue);
    }
  };

  return (
    <fieldset className="mb-[10px]">
      <Block title={'industries'} intent="filter">
        {checkedValues && (
          <CheckedItemsList
            checkedValue={checkedValues}
            setCheckedValue={
              setCheckedValues as Dispatch<
                SetStateAction<
                  | string
                  | MultiLanguageString
                  | (string | MultiLanguageString)[]
                >
              >
            }
          />
        )}

        <SearchFilter keyword={keyword} setKeyword={setKeyword} />

        <GroupedFilterItems
          items={items}
          itemName={'industries'}
          isLoading={isLoading}
          handleCheckedValue={handleCheckedValue}
          checkedValue={checkedValues}
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

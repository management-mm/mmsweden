import { type ChangeEvent, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { Filter } from '@enums/i18nConstants';

interface IConditionItemProps {
  condition: 'used' | 'new'
}

const ConditionItem:FC<IConditionItemProps> = ({ condition }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const isItemSelected = (item: string) =>
    searchParams.getAll('condition').includes(item);

  const handleSelectedOption = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(searchParams => {
      if (!event.target.checked) {
        searchParams.delete('condition');
        return searchParams;
      }

      searchParams.set('condition', event.target.value);
      return searchParams;
    });
  };
  return (
    <div className="flex gap-[6px]">
      <input
        onChange={handleSelectedOption}
        className="peer h-[16px] w-[16px] appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-primary checked:after:bg-check-icon checked:after:bg-center checked:after:bg-no-repeat"
        type="checkbox"
        disabled={isItemSelected(condition === 'new' ? 'used' : 'new')}
        checked={isItemSelected(condition)}
        id={condition}
        name={'condition'}
        value={condition}
      />
      <label
        className="font-openSans text-[12px] capitalize peer-disabled:text-gray-400"
        htmlFor={condition}
      >
        {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
      </label>
    </div>
  );
};

export default ConditionItem;

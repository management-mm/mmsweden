import { type ChangeEvent, type FC } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter } from '@enums/i18nConstants';

interface IConditionItemProps {
  condition: 'used' | 'new';
}

const ConditionItem: FC<IConditionItemProps> = ({ condition }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();

  const isItemSelected = (item: string) =>
    searchParams.getAll('condition').includes(item);

  const handleSelectedOption = (event: ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!event.target.checked) {
      params.delete('condition');
    } else {
      params.set('condition', event.target.value);
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-[6px]">
      <input
        onChange={handleSelectedOption}
        className="peer checked:after:bg-primary checked:after:bg-check-icon h-[16px] w-[16px] appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-center checked:after:bg-no-repeat"
        type="checkbox"
        disabled={isItemSelected(condition === 'new' ? 'used' : 'new')}
        checked={isItemSelected(condition)}
        id={condition}
        name="condition"
        value={condition}
      />
      <label
        className="font-openSans text-[14px] capitalize peer-disabled:text-gray-400"
        htmlFor={condition}
      >
        {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
      </label>
    </div>
  );
};

export default ConditionItem;

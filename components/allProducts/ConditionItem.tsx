'use client';

import { type ChangeEvent, type FC, useId } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Filter } from '@enums/i18nConstants';

interface IConditionItemProps {
  condition: 'used' | 'new';
}

function createCleanSearchParams(searchParamsString: string): URLSearchParams {
  const sourceParams = new URLSearchParams(searchParamsString);
  const cleanParams = new URLSearchParams();
  const seenValues = new Set<string>();

  for (const [key, value] of sourceParams.entries()) {
    const normalizedKey = key.trim();
    const normalizedValue = value.trim();

    if (!normalizedKey || !normalizedValue) {
      continue;
    }

    const uniqueKey = `${normalizedKey}\u0000${normalizedValue}`;

    if (seenValues.has(uniqueKey)) {
      continue;
    }

    seenValues.add(uniqueKey);
    cleanParams.append(normalizedKey, normalizedValue);
  }

  return cleanParams;
}

const ConditionItem: FC<IConditionItemProps> = ({ condition }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const inputId = useId();

  const searchParamsString = searchParams.toString();

  const selectedCondition =
    searchParams.get('condition')?.trim().toLowerCase() ?? '';

  const isSelected = selectedCondition === condition;

  const handleSelectedOption = (event: ChangeEvent<HTMLInputElement>) => {
    const params = createCleanSearchParams(searchParamsString);

    /*
     * Every condition change starts from the first results page.
     */
    params.delete('page');
    params.delete('condition');

    if (event.target.checked) {
      params.set('condition', condition);
    }

    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, {
      scroll: false,
    });
  };

  return (
    <div className="flex gap-[6px]">
      <input
        onChange={handleSelectedOption}
        className="checked:after:bg-primary checked:after:bg-check-icon h-[16px] w-[16px] cursor-pointer appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-center checked:after:bg-no-repeat"
        type="checkbox"
        checked={isSelected}
        id={inputId}
        name="condition"
        value={condition}
      />

      <label
        className="font-openSans cursor-pointer text-[14px] capitalize"
        htmlFor={inputId}
      >
        {condition === 'new' ? t(Filter.New) : t(Filter.Used)}
      </label>
    </div>
  );
};

export default ConditionItem;

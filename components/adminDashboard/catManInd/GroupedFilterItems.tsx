'use client';

import { type ChangeEvent, type FC, useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';
import type { MultiLanguageString } from '@interfaces/IProduct';

import getFilterItemName from '@utils/getFilterItemName';

import type { filters } from '@enums/filters';

import { DEFAULT_LOCALE } from '@i18n/config';

type FilterItem = ICategory | IManufacturer | IIndustry;

interface IGroupedFilterItemsProps {
  items: FilterItem[];
  itemName: filters.Category | filters.Manufacturer | 'industries';
  isLoading: boolean;
  handleCheckedValue: (event: ChangeEvent<HTMLInputElement>) => void;
  checkedValue: (MultiLanguageString | string)[] | MultiLanguageString | string;
}

const GroupedFilterItems: FC<IGroupedFilterItemsProps> = ({
  items,
  itemName,
  isLoading,
  handleCheckedValue,
  checkedValue,
}) => {
  const [groupedFilters, setGroupedFilters] = useState<
    Record<string, FilterItem[]>
  >({});

  const isItemSelected = (item: string): boolean => {
    if (Array.isArray(checkedValue)) {
      if (typeof checkedValue[0] === 'object') {
        const enValues = (checkedValue as MultiLanguageString[]).map(
          value => value.en
        );
        return enValues.includes(item);
      }
      return (checkedValue as string[]).includes(item);
    }
    if (
      typeof checkedValue === 'object' &&
      checkedValue !== null &&
      'en' in checkedValue
    ) {
      return item === (checkedValue as MultiLanguageString).en;
    }
    return item === checkedValue;
  };

  useEffect(() => {
    const grouped = items.reduce<Record<string, FilterItem[]>>((acc, item) => {
      const characterKey = getFilterItemName(itemName, item, DEFAULT_LOCALE)
        .charAt(0)
        .toUpperCase();
      if (!acc[characterKey]) {
        acc[characterKey] = [];
      }
      acc[characterKey].push(item);
      return acc;
    }, {});

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const nameA = getFilterItemName(
          itemName,
          a,
          DEFAULT_LOCALE
        ).toLowerCase();
        const nameB = getFilterItemName(
          itemName,
          b,
          DEFAULT_LOCALE
        ).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );

    setGroupedFilters(sortedGrouped);
  }, [items, itemName]);

  return (
    <div className="mb-[14px] flex h-[350px] flex-col gap-[16px] overflow-y-scroll">
      {Object.entries(groupedFilters).map(([character, items]) => (
        <div key={character}>
          <p className="text-desc mb-4 text-[12px] font-semibold">
            {character?.toUpperCase()}
          </p>
          <div className="flex flex-col gap-[12px]">
            {items.map(item => (
              <SkeletonTheme
                key={item._id}
                baseColor="#E1E1E1"
                highlightColor="#F2F2F2"
              >
                <div className="flex items-center gap-[6px]">
                  {!isLoading ? (
                    <input
                      type="checkbox"
                      id={item._id}
                      checked={isItemSelected(
                        getFilterItemName(itemName, item, DEFAULT_LOCALE)
                      )}
                      name={itemName}
                      onChange={handleCheckedValue}
                      className="checked:after:bg-primary checked:after:bg-check-icon h-[16px] w-[16px] cursor-pointer appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-center checked:after:bg-no-repeat"
                      value={getFilterItemName(itemName, item, DEFAULT_LOCALE)}
                    />
                  ) : (
                    <Skeleton width={16} />
                  )}
                  <label
                    className="font-openSans text-[14px] capitalize"
                    htmlFor={item._id}
                  >
                    {getFilterItemName(itemName, item, DEFAULT_LOCALE)}
                  </label>
                </div>
              </SkeletonTheme>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GroupedFilterItems;

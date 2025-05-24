import { type FC, useContext, useEffect, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';

import Block from './Block';
import ChangeFilter from './forms/ChangeFilter';

import { LanguageContextAdmin } from '@components/AdminSharedLayout';
import { LanguageContext } from '@components/SharedLayout';

import getFilterItemName from '@utils/getFilterItemName';

import type { filters } from '@enums/filters';

type FilterItem = ICategory | IManufacturer | IIndustry;

interface IGroupedFilterItemsProps {
  items: FilterItem[];
  itemName: filters.Category | filters.Manufacturer | 'industries';
  isLoading: boolean;
}

const GroupedFilterItems: FC<IGroupedFilterItemsProps> = ({
  items,
  itemName,
  isLoading,
}) => {
  const isAdmin = window.location.pathname.includes('admin');
  const { language } = useContext(
    isAdmin ? LanguageContextAdmin : LanguageContext
  );
  const [groupedFilters, setGroupedFilters] = useState<
    Record<string, FilterItem[]>
  >({});

  useEffect(() => {
    const grouped = items.reduce<Record<string, FilterItem[]>>((acc, item) => {
      const characterKey = getFilterItemName(itemName, item, language)
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
        const nameA = getFilterItemName(itemName, a, language).toLowerCase();
        const nameB = getFilterItemName(itemName, b, language).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );

    setGroupedFilters(sortedGrouped);
  }, [items, itemName, language]);

  // useEffect(() => {
  //   if (options) {
  //     setVisibleItems(options.slice(0, pageSize));
  //   }
  // }, [options]);

  return (
    <div className="mb-[14px] flex h-[400px] flex-col gap-[16px] overflow-y-scroll scrollbar-none lg:scrollbar-thin">
      {Object.entries(groupedFilters).map(([character, items]) => (
        <div key={character}>
          <p className="mb-4 text-[12px] font-semibold text-desc">
            {character?.toUpperCase()}
          </p>
          <div className="flex flex-col gap-[12px]">
            {items.map(item => (
              <SkeletonTheme
                key={item._id}
                baseColor="#E1E1E1"
                highlightColor="#F2F2F2"
              >
                <div className="flex w-full justify-between">
                  {!isLoading ? (
                    <Block
                      title={getFilterItemName(itemName, item, language)}
                      intent={'filter'}
                    >
                      <ChangeFilter filterName={itemName} filterValue={item} />
                    </Block>
                  ) : (
                    <Skeleton width={16} />
                  )}
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

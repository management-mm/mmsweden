'use client';

import {
  type ChangeEvent,
  type FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';
import { LanguageContext } from 'app/providers';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { LanguageContextAdmin } from '@components/LanguageAdminProvider';
import SearchFilter from '@components/common/SearchFilter';
import SvgIcon from '@components/common/SvgIcon';

import getFilterItemName from '@utils/getFilterItemName';
import subtractSearchParam from '@utils/subtractSearchParam';

import { filters } from '@enums/filters';
import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';
import { LanguageKeys } from '@enums/languageKeys';

interface IFilterWrapperProps {
  filterName: string;
  items: ICategory[] | IManufacturer[] | IIndustry[];
  isLoading: boolean;
  keyword: string;
  setKeyword: (value: string) => void;
}

const FilterWrapper: FC<IFilterWrapperProps> = ({
  filterName,
  items,
  isLoading,
  keyword,
  setKeyword,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAdmin = pathname.startsWith('/admin');

  const { language } = useContext(
    isAdmin ? LanguageContextAdmin : LanguageContext
  );

  const [groupedFilters, setGroupedFilters] = useState<
    Record<string, (ICategory | IManufacturer | IIndustry)[]>
  >({});

  const [isOpen, setIsOpen] = useState(filterName === filters.Category);

  const { t } = useTranslation();

  const selectedValues = useMemo(() => {
    return searchParams.getAll(filterName);
  }, [searchParams, filterName]);

  const isItemSelected = (item: string) => selectedValues.includes(item);

  const updateSearchParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString());
    updater(params);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const handleSelectedOption = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const checked = event.target.checked;

    updateSearchParams(params => {
      if (!checked) {
        subtractSearchParam(params, value, filterName);
        return;
      }
      params.append(filterName, value);
    });
  };

  useEffect(() => {
    const grouped = items.reduce(
      (acc, item) => {
        const characterKey = getFilterItemName(filterName, item, language)
          .split('')[0]
          ?.toUpperCase();

        if (!characterKey) return acc;

        if (!acc[characterKey]) acc[characterKey] = [];
        acc[characterKey].push(item);

        return acc;
      },
      {} as Record<string, (ICategory | IManufacturer | IIndustry)[]>
    );

    Object.keys(grouped).forEach(key => {
      grouped[key].sort((a, b) => {
        const nameA = getFilterItemName(filterName, a, language).toLowerCase();
        const nameB = getFilterItemName(filterName, b, language).toLowerCase();
        return nameA.localeCompare(nameB);
      });
    });

    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );

    setGroupedFilters(sortedGrouped);
  }, [items, filterName, language]);

  return (
    <fieldset className="mb-[10px]">
      <div
        className="flex cursor-pointer items-center justify-between py-[10px]"
        onClick={() => setIsOpen(v => !v)}
      >
        <legend className="font-openSans text-title text-[14px] font-semibold">
          {filterName === filters.Category && t(Filter.Category)}
          {filterName === filters.Manufacturer && t(Filter.Manufacturer)}
          {filterName === filters.Industry && t(Filter.Industry)}
        </legend>

        <SvgIcon
          iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
          size={{ width: 10, height: 10 }}
        />
      </div>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[400px]' : 'max-h-0'
        )}
      >
        <SearchFilter keyword={keyword} setKeyword={setKeyword} />

        <div className="flex h-[350px] flex-col gap-[16px] overflow-y-scroll">
          {Object.entries(groupedFilters).map(([character, list]) => (
            <div key={character}>
              <p className="text-desc mb-4 text-[12px] font-semibold">
                {character.toUpperCase()}
              </p>

              <div className="flex flex-col gap-[12px]">
                {list.map(item => {
                  const valueEn = getFilterItemName(
                    filterName,
                    item,
                    LanguageKeys.EN
                  );

                  return (
                    <SkeletonTheme
                      key={item._id}
                      baseColor="#E1E1E1"
                      highlightColor="#F2F2F2"
                    >
                      <div className="flex gap-[6px]">
                        {!isLoading ? (
                          <input
                            onChange={handleSelectedOption}
                            type="checkbox"
                            checked={isItemSelected(valueEn)}
                            id={item._id}
                            name={filterName}
                            className="checked:after:bg-primary checked:after:bg-check-icon h-[16px] w-[16px] cursor-pointer appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-center checked:after:bg-no-repeat"
                            value={valueEn}
                          />
                        ) : (
                          <Skeleton width={16} />
                        )}

                        {!isLoading ? (
                          <label
                            className="font-openSans text-[14px] capitalize"
                            htmlFor={item._id}
                          >
                            {getFilterItemName(filterName, item, language)}
                          </label>
                        ) : (
                          <Skeleton width={150} />
                        )}
                      </div>
                    </SkeletonTheme>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </fieldset>
  );
};

export default FilterWrapper;

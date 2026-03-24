'use client';

import {
  type ChangeEvent,
  type FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Skeleton from 'react-loading-skeleton';

import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SearchFilter from '@components/common/SearchFilter';
import SvgIcon from '@components/common/SvgIcon';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getFilterItemName from '@utils/getFilterItemName';
import subtractSearchParam from '@utils/subtractSearchParam';

import { filters } from '@enums/filters';
import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

import { DEFAULT_LOCALE } from '@i18n/config';

interface IFilterWrapperProps {
  filterName: string;
  items: ICategory[] | IManufacturer[] | IIndustry[];
  isLoading: boolean;
  keyword: string;
  setKeyword: (value: string) => void;
}

const ITEMS_PER_LOAD = 30;

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
  const language = useCurrentLocale();
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(filterName === filters.Category);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const selectedValues = useMemo(() => {
    return searchParams.getAll(filterName);
  }, [searchParams, filterName]);

  const selectedValuesSet = useMemo(() => {
    return new Set(selectedValues);
  }, [selectedValues]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const nameA = getFilterItemName(filterName, a, language).toLowerCase();
      const nameB = getFilterItemName(filterName, b, language).toLowerCase();

      return nameA.localeCompare(nameB);
    });
  }, [items, filterName, language]);

  const visibleItems = useMemo(() => {
    return sortedItems.slice(0, visibleCount);
  }, [sortedItems, visibleCount]);

  const hasMore = visibleCount < sortedItems.length;

  const groupedFilters = useMemo(() => {
    const grouped = visibleItems.reduce(
      (acc, item) => {
        const characterKey = getFilterItemName(filterName, item, language)
          .charAt(0)
          ?.toUpperCase();

        if (!characterKey) return acc;

        if (!acc[characterKey]) acc[characterKey] = [];
        acc[characterKey].push(item);

        return acc;
      },
      {} as Record<string, (ICategory | IManufacturer | IIndustry)[]>
    );

    return Object.fromEntries(
      Object.entries(grouped).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
  }, [visibleItems, filterName, language]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [items, keyword, filterName]);

  useEffect(() => {
    if (!isOpen || !hasMore || isLoading) return;

    const root = scrollContainerRef.current;
    const target = loadMoreRef.current;

    if (!root || !target) return;

    const observer = new IntersectionObserver(
      entries => {
        const firstEntry = entries[0];

        if (firstEntry?.isIntersecting) {
          setVisibleCount(prev =>
            Math.min(prev + ITEMS_PER_LOAD, sortedItems.length)
          );
        }
      },
      {
        root,
        rootMargin: '0px 0px 120px 0px',
        threshold: 0.1,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, isOpen, sortedItems.length]);

  const title =
    filterName === filters.Category
      ? t(Filter.Category)
      : filterName === filters.Manufacturer
        ? t(Filter.Manufacturer)
        : t(Filter.Industry);

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

  return (
    <fieldset className="mb-[10px]">
      <button
        type="button"
        className="flex w-full items-center justify-between py-[10px]"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
      >
        <legend className="font-openSans text-title text-[14px] font-semibold">
          {title}
        </legend>

        <SvgIcon
          iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
          size={{ width: 10, height: 10 }}
        />
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-[400px]' : 'max-h-0'
        )}
      >
        <SearchFilter keyword={keyword} setKeyword={setKeyword} />

        <div
          ref={scrollContainerRef}
          className="flex h-[350px] flex-col gap-[16px] overflow-y-scroll"
        >
          {Object.entries(groupedFilters).map(([character, list]) => (
            <div key={character}>
              <p className="text-desc mb-4 text-[12px] font-semibold">
                {character}
              </p>

              <div className="flex flex-col gap-[12px]">
                {list.map(item => {
                  const valueEn = getFilterItemName(
                    filterName,
                    item,
                    DEFAULT_LOCALE
                  );

                  return (
                    <div key={item._id} className="flex gap-[6px]">
                      {!isLoading ? (
                        <input
                          onChange={handleSelectedOption}
                          type="checkbox"
                          checked={selectedValuesSet.has(valueEn)}
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
                  );
                })}
              </div>
            </div>
          ))}

          {!isLoading && hasMore && (
            <div ref={loadMoreRef} className="h-[1px]" />
          )}

          {isLoading && (
            <div className="flex flex-col gap-[12px]">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex gap-[6px]">
                  <Skeleton width={16} />
                  <Skeleton width={150} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default FilterWrapper;

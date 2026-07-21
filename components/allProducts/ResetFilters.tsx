'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { selectCategories, selectIndustries } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getFilterValueTranslation from '@utils/getFilterValueTranslation';

import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type FilterName = 'category' | 'industry' | 'manufacturer' | 'condition';

type ActiveFilter = {
  value: string;
  filterName: FilterName;
};

const FILTER_NAMES: readonly FilterName[] = [
  'category',
  'manufacturer',
  'industry',
  'condition',
];

function createCleanSearchParams(searchKey: string): URLSearchParams {
  const sourceParams = new URLSearchParams(searchKey);
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

function getActiveFilters(searchKey: string): ActiveFilter[] {
  const params = new URLSearchParams(searchKey);
  const uniqueFilters = new Map<string, ActiveFilter>();

  for (const filterName of FILTER_NAMES) {
    for (const rawValue of params.getAll(filterName)) {
      const value = rawValue.trim();

      if (!value) {
        continue;
      }

      const key = `${filterName}\u0000${value}`;

      uniqueFilters.set(key, {
        value,
        filterName,
      });
    }
  }

  return [...uniqueFilters.values()];
}

const ResetFilters = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const categories = useAppSelector(selectCategories);
  const industries = useAppSelector(selectIndustries);
  const locale = useCurrentLocale();

  const filtersToReset = useMemo(
    () => getActiveFilters(searchKey),
    [searchKey]
  );

  const replaceParams = (params: URLSearchParams) => {
    const queryString = params.toString();
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    router.replace(nextUrl, {
      scroll: false,
    });
  };

  const handleResetAll = () => {
    const params = createCleanSearchParams(searchKey);

    for (const filterName of FILTER_NAMES) {
      params.delete(filterName);
    }

    params.delete('page');

    replaceParams(params);
  };

  const handleRemoveOne = (filterName: FilterName, value: string) => {
    const params = createCleanSearchParams(searchKey);

    params.delete('page');

    const remainingValues = params
      .getAll(filterName)
      .map(currentValue => currentValue.trim())
      .filter(
        currentValue => currentValue.length > 0 && currentValue !== value
      );

    params.delete(filterName);

    for (const currentValue of [...new Set(remainingValues)]) {
      params.append(filterName, currentValue);
    }

    replaceParams(params);
  };

  return (
    <div className="mb-[22px] flex flex-wrap gap-[12px]">
      {filtersToReset.length > 0 && (
        <button
          type="button"
          onClick={handleResetAll}
          className="rounded-[32px] border border-[rgba(211,67,21,1)] bg-[rgba(211,67,21,.12)] px-[8px] py-[7px] text-[12px] text-[rgba(211,67,21,1)]"
        >
          {t(Filter.Reset)}
        </button>
      )}

      {filtersToReset.map(filter => {
        const label = getFilterValueTranslation(
          filter,
          categories,
          industries,
          locale
        );

        return (
          <button
            type="button"
            key={`${filter.filterName}:${filter.value}`}
            onClick={() => handleRemoveOne(filter.filterName, filter.value)}
            className="border-primary bg-secondary text-primary flex items-center gap-[8px] rounded-[32px] border px-[8px] py-[7px] text-[12px]"
            aria-label={`${t(Filter.Reset)}: ${label}`}
          >
            {label}

            <span
              className="bg-primary flex h-[12px] w-[12px] items-center justify-center rounded-full"
              aria-hidden="true"
            >
              <SvgIcon
                className="fill-[rgb(234,241,248)]"
                iconId={IconId.Reset}
                size={{ width: 6, height: 6 }}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ResetFilters;

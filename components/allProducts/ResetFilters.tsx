'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SvgIcon from '@components/common/SvgIcon';

import { selectCategories, selectIndustries } from '@store/selectors';

import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

import getFilterValueTranslation from '@utils/getFilterValueTranslation';
import subtractSearchParam from '@utils/subtractSearchParam';

import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type FilterName = 'category' | 'industry' | 'manufacturer' | 'condition';

const ResetFilters = () => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchKey = searchParams.toString();

  const categories = useAppSelector(selectCategories);
  const industries = useAppSelector(selectIndustries);

  const language = useCurrentLocale();

  const [filtersToReset, setFiltersToReset] = useState<
    { value: string; filterName: FilterName }[]
  >([]);

  const pushParams = (params: URLSearchParams) => {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    const getFilterParams = (filterName: FilterName) =>
      searchParams.getAll(filterName).map(param => ({
        value: param,
        filterName,
      }));

    const category = getFilterParams('category');
    const manufacturer = getFilterParams('manufacturer');
    const industry = getFilterParams('industry');
    const condition = getFilterParams('condition');

    const merged = [...category, ...manufacturer, ...industry, ...condition];
    const uniqMap = new Map<
      string,
      { value: string; filterName: FilterName }
    >();

    for (const f of merged) {
      uniqMap.set(`${f.filterName}:${f.value}`, f);
    }

    setFiltersToReset([...uniqMap.values()]);
  }, [searchKey, searchParams]);

  const handleResetAll = () => {
    const params = new URLSearchParams(searchKey);
    params.delete('category');
    params.delete('manufacturer');
    params.delete('industry');
    params.delete('condition');
    pushParams(params);
  };

  const handleRemoveOne = (filterName: FilterName, value: string) => {
    const params = new URLSearchParams(searchKey);
    subtractSearchParam(params, value, filterName);
    pushParams(params);
  };

  return (
    <div className="mb-[22px] flex flex-wrap gap-[12px]">
      <button
        onClick={handleResetAll}
        className="rounded-[32px] border border-[rgba(211,67,21,1)] bg-[rgba(211,67,21,.12)] px-[8px] py-[7px] text-[12px] text-[rgba(211,67,21,1)]"
      >
        {t(Filter.Reset)}
      </button>

      {filtersToReset.map(filter => (
        <button
          key={`${filter.filterName}:${filter.value}`}
          onClick={() => handleRemoveOne(filter.filterName, filter.value)}
          className="border-primary bg-secondary text-primary flex items-center gap-[8px] rounded-[32px] border px-[8px] py-[7px] text-[12px]"
        >
          {getFilterValueTranslation(filter, categories, industries, language)}

          <div className="bg-primary flex h-[12px] w-[12px] items-center justify-center rounded-full">
            <SvgIcon
              className="fill-[rgb(234,241,248)]"
              iconId={IconId.Reset}
              size={{ width: 6, height: 6 }}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

export default ResetFilters;

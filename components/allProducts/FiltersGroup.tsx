'use client';

import { type FC, useEffect, useState } from 'react';

import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import Condition from './Condition';
import FilterWrapper from './FilterWrapper';

import CategoriesMenu from '@components/header/CategoriesMenu';

import { fetchIndustries, fetchManufacturers } from '@store/filters/operations';
import {
  selectIndustries,
  selectIndustriesIsLoading,
  selectManufacturers,
  selectManufacturersIsLoading,
} from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import { useDebouncedValue } from '@hooks/useDebouncedValue';

import { filters } from '@enums/filters';

interface IFiltersGroupProps {
  className?: string;
}

const FiltersGroup: FC<IFiltersGroupProps> = ({ className }) => {
  const dispatch = useAppDispatch();

  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [industryKeyword, setIndustryKeyword] = useState('');

  const debouncedManufacturerKeyword = useDebouncedValue(
    manufacturerKeyword,
    300
  );
  const debouncedIndustryKeyword = useDebouncedValue(industryKeyword, 300);

  const locale = useCurrentLocale();

  const manufacturers: IManufacturer[] = useAppSelector(selectManufacturers);
  const industries: IIndustry[] = useAppSelector(selectIndustries);

  const manufacturersIsLoading = useAppSelector(selectManufacturersIsLoading);
  const industriesIsLoading = useAppSelector(selectIndustriesIsLoading);

  useEffect(() => {
    const shouldFetch =
      debouncedManufacturerKeyword.length > 0 || manufacturers.length === 0;

    if (!shouldFetch) return;

    dispatch(
      fetchManufacturers({
        keyword: debouncedManufacturerKeyword,
      })
    );
  }, [dispatch, debouncedManufacturerKeyword, manufacturers.length]);

  useEffect(() => {
    const shouldFetch =
      debouncedIndustryKeyword.length > 0 || industries.length === 0;

    if (!shouldFetch) return;

    dispatch(
      fetchIndustries({
        keyword: debouncedIndustryKeyword,
        lang: locale,
      })
    );
  }, [dispatch, debouncedIndustryKeyword, locale, industries.length]);

  return (
    <div className={className}>
      <CategoriesMenu mode="filters" />

      <FilterWrapper
        filterName={filters.Manufacturer}
        items={manufacturers}
        isLoading={manufacturersIsLoading}
        keyword={manufacturerKeyword}
        setKeyword={setManufacturerKeyword}
      />

      <FilterWrapper
        filterName={filters.Industry}
        items={industries}
        isLoading={industriesIsLoading}
        keyword={industryKeyword}
        setKeyword={setIndustryKeyword}
      />

      <Condition />
    </div>
  );
};

export default FiltersGroup;

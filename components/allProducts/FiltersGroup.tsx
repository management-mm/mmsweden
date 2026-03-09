'use client';

import { type FC, useEffect, useState } from 'react';

import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import Condition from './Condition';
import FilterWrapper from './FilterWrapper';

import {
  fetchCategories,
  fetchIndustries,
  fetchManufacturers,
} from '@store/filters/operations';

import {
  selectCategories,
  selectCategoriesIsLoading,
  selectIndustries,
  selectIndustriesIsLoading,
  selectManufacturers,
  selectManufacturersIsLoading,
} from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { filters } from '@enums/filters';
import { useCurrentLocale } from '@hooks/useCurrentLocale';

interface IFiltersGroupProps {
  className: string;
}
const FiltersGroup: FC<IFiltersGroupProps> = ({ className }) => {
  const dispatch = useAppDispatch();

  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [industryKeyword, setIndustryKeyword] = useState('');

  const language = useCurrentLocale();

  const categories: ICategory[] = useAppSelector(selectCategories);
  const manufacturers: IManufacturer[] = useAppSelector(selectManufacturers);
  const industries: IIndustry[] = useAppSelector(selectIndustries);

  const categoriesIsLoading = useAppSelector(selectCategoriesIsLoading);
  const manufacturersIsLoading = useAppSelector(selectManufacturersIsLoading);
  const industriesIsLoading = useAppSelector(selectIndustriesIsLoading);

  useEffect(() => {
    dispatch(fetchCategories({ keyword: categoryKeyword, lang: language }));
  }, [dispatch, categoryKeyword, language]);

  useEffect(() => {
    dispatch(fetchManufacturers({ keyword: manufacturerKeyword }));
  }, [dispatch, manufacturerKeyword]);

  useEffect(() => {
    dispatch(fetchIndustries({ keyword: industryKeyword, lang: language }));
  }, [dispatch, industryKeyword, language]);

  return (
    <div className={className}>
      <FilterWrapper
        filterName={filters.Category}
        items={categories}
        isLoading={categoriesIsLoading}
        keyword={categoryKeyword}
        setKeyword={setCategoryKeyword}
      />

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
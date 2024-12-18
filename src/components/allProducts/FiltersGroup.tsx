import { type FC, useContext, useEffect, useState } from 'react';

import type { ICategory } from 'interfaces/ICategory';
import type { IIndustry } from 'interfaces/IIndustry';
import type { IManufacturer } from 'interfaces/IManufacturer';

import Condition from './Condition';
import FilterWrapper from './FilterWrapper';

import { LanguageContext } from '@components/SharedLayout';

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

interface IFiltersGroupProps {
  className: string;
}

const FiltersGroup: FC<IFiltersGroupProps> = ({ className }) => {
  const dispatch = useAppDispatch();
  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [industryKeyword, setIndustryKeyword] = useState('');
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('LanguageContext must be used within a LanguageProvider');
  }

  const { language } = context;
  const categories: ICategory[] = useAppSelector(selectCategories);
  const manufacturers: IManufacturer[] = useAppSelector(selectManufacturers);
  const industries: IIndustry[] = useAppSelector(selectIndustries);
  const categoriesIsLoading = useAppSelector(selectCategoriesIsLoading);
  const manufacturersIsLoading = useAppSelector(selectManufacturersIsLoading);
  const industriesIsLoading = useAppSelector(selectIndustriesIsLoading);

  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        dispatch(fetchCategories({ keyword: categoryKeyword, lang: language }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingCategories();
  }, [dispatch, categoryKeyword, language]);

  useEffect(() => {
    const fetchingManufacturers = async () => {
      try {
        dispatch(fetchManufacturers({ keyword: manufacturerKeyword }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingManufacturers();
  }, [dispatch, manufacturerKeyword, language]);
  useEffect(() => {
    const fetchingIndustries = async () => {
      try {
        dispatch(fetchIndustries({ keyword: industryKeyword, lang: language }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingIndustries();
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

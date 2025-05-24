import { useEffect, useState } from 'react';

import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';

import Block from './Block';
import GroupedFilterItems from './GroupedFilterItems';

import SearchFilter from '@components/common/SearchFilter';

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

import { cn } from '@utils/cn';

import { filters } from '@enums/filters';
import { LanguageKeys } from '@enums/languageKeys';

const FiltersSettingsMain = () => {
  const dispatch = useAppDispatch();

  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [industryKeyword, setIndustryKeyword] = useState('');

  const categories: ICategory[] = useAppSelector(selectCategories);
  const manufacturers: IManufacturer[] = useAppSelector(selectManufacturers);
  const industries: IIndustry[] = useAppSelector(selectIndustries);
  const categoriesIsLoading = useAppSelector(selectCategoriesIsLoading);
  const manufacturersIsLoading = useAppSelector(selectManufacturersIsLoading);
  const industriesIsLoading = useAppSelector(selectIndustriesIsLoading);

  useEffect(() => {
    const fetchingCategories = async () => {
      try {
        dispatch(
          fetchCategories({ keyword: categoryKeyword, lang: LanguageKeys.EN })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingCategories();
  }, [dispatch, categoryKeyword]);

  useEffect(() => {
    const fetchingManufacturers = async () => {
      try {
        dispatch(fetchManufacturers({ keyword: manufacturerKeyword }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingManufacturers();
  }, [dispatch, manufacturerKeyword]);

  useEffect(() => {
    const fetchingIndustries = async () => {
      try {
        dispatch(
          fetchIndustries({ keyword: industryKeyword, lang: LanguageKeys.EN })
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchingIndustries();
  }, [dispatch, industryKeyword]);
  return (
    <div className={cn('container', 'lg:ml-0')}>
      <div className="gap-[24px] pt-[30px] md:flex md:pt-[48px] lg:mb-0">
        <Block title="Category" intent="main" className="mb-[20px]">
          <SearchFilter
            keyword={categoryKeyword}
            setKeyword={setCategoryKeyword}
          />
          <GroupedFilterItems
            items={categories}
            itemName={filters.Category}
            isLoading={categoriesIsLoading}
          />
        </Block>
        <div>
          <Block title="Manufacturer" intent="main" className="mb-[20px]">
            <SearchFilter
              keyword={manufacturerKeyword}
              setKeyword={setManufacturerKeyword}
            />
            <GroupedFilterItems
              items={manufacturers}
              itemName={filters.Manufacturer}
              isLoading={manufacturersIsLoading}
            />
          </Block>
          <Block title="Industry" intent="main" className="mb-[20px]">
            <SearchFilter
              keyword={industryKeyword}
              setKeyword={setIndustryKeyword}
            />
            <GroupedFilterItems
              items={industries}
              itemName={'industries'}
              isLoading={industriesIsLoading}
            />
          </Block>
        </div>
      </div>
    </div>
  );
};

export default FiltersSettingsMain;

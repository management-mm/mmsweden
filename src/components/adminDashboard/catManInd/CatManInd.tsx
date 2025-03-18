import { type FC, useEffect, useState } from 'react';

import type { ICategory } from '@interfaces/ICategory';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';
import type { MultiLanguageString } from '@interfaces/IProduct';

import CatManItem from './CatManItem';
import Industry from './Industry';

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
import { LanguageKeys } from '@enums/languageKeys';

interface ICatManIndProps {
  initialCategory?: string | MultiLanguageString;
  initialManufacturer?: string;
  initialIndustries?: (MultiLanguageString | string)[];
}

const CatManInd: FC<ICatManIndProps> = ({
  initialCategory = '',
  initialManufacturer = '',
  initialIndustries = [],
}) => {
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
    <>
      <CatManItem
        itemName={filters.Category}
        items={categories}
        isLoading={categoriesIsLoading}
        keyword={categoryKeyword}
        setKeyword={setCategoryKeyword}
        initialValue={initialCategory}
      />
      <CatManItem
        itemName={filters.Manufacturer}
        items={manufacturers}
        isLoading={manufacturersIsLoading}
        keyword={manufacturerKeyword}
        setKeyword={setManufacturerKeyword}
        initialValue={initialManufacturer}
      />
      <Industry
        items={industries}
        isLoading={industriesIsLoading}
        keyword={industryKeyword}
        setKeyword={setIndustryKeyword}
        initialValue={initialIndustries}
      />
    </>
  );
};

export default CatManInd;

'use client';

import { type FC, useEffect, useMemo, useState } from 'react';

import { getChildren, getTopLevel } from '@api/categoriesService';
import type { IIndustry } from '@interfaces/IIndustry';
import type { IManufacturer } from '@interfaces/IManufacturer';
import type { MultiLanguageString } from '@interfaces/IProduct';
import type { ISeoCategory } from '@interfaces/ISeoCategory';

import CatManItem from './CatManItem';
import CategoryItem from './CategoryItem';
import Industry from './Industry';

import { fetchIndustries, fetchManufacturers } from '@store/filters/operations';
import {
  selectIndustries,
  selectIndustriesIsLoading,
  selectManufacturers,
  selectManufacturersIsLoading,
} from '@store/selectors';

import { useAppDispatch } from '@hooks/useAppDispatch';
import { useAppSelector } from '@hooks/useAppSelector';

import { filters } from '@enums/filters';

import { DEFAULT_LOCALE } from '@i18n/config';

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

  const [categories, setCategories] = useState<ISeoCategory[]>([]);
  const [subcategoriesMap, setSubcategoriesMap] = useState<
    Record<string, ISeoCategory[]>
  >({});
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const [categoryKeyword, setCategoryKeyword] = useState('');
  const [manufacturerKeyword, setManufacturerKeyword] = useState('');
  const [industryKeyword, setIndustryKeyword] = useState('');

  const manufacturers: IManufacturer[] = useAppSelector(selectManufacturers);
  const industries: IIndustry[] = useAppSelector(selectIndustries);

  const manufacturersIsLoading = useAppSelector(selectManufacturersIsLoading);
  const industriesIsLoading = useAppSelector(selectIndustriesIsLoading);

  useEffect(() => {
    dispatch(fetchManufacturers({ keyword: manufacturerKeyword }));
  }, [dispatch, manufacturerKeyword]);

  useEffect(() => {
    dispatch(
      fetchIndustries({
        keyword: industryKeyword,
        lang: DEFAULT_LOCALE,
      })
    );
  }, [dispatch, industryKeyword]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getTopLevel();
        setCategories(data);

        const childrenResults = await Promise.all(
          data.map(async category => {
            const categoryId = String(category._id);
            const children = await getChildren(categoryId);

            return {
              categoryId,
              children,
            };
          })
        );

        const nextMap = childrenResults.reduce<Record<string, ISeoCategory[]>>(
          (acc, item) => {
            acc[item.categoryId] = item.children;
            return acc;
          },
          {}
        );

        setSubcategoriesMap(nextMap);
      } catch (error) {
        console.error('Failed to load categories/subcategories:', error);
      }
    };

    loadCategories();
  }, []);

  return (
    <>
      <CategoryItem
        categories={categories}
        subcategoriesMap={subcategoriesMap}
        keyword={categoryKeyword}
        setKeyword={setCategoryKeyword}
        initialValue={initialCategory}
        selectedParentId={selectedParentId}
        setSelectedParentId={setSelectedParentId}
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

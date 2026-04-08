'use client';

import {
  type Dispatch,
  type FC,
  type SetStateAction,
  useMemo,
  useState,
} from 'react';

import type { MultiLanguageString } from '@interfaces/IProduct';
import type { ISeoCategory } from '@interfaces/ISeoCategory';
import clsx from 'clsx';
import { useFormikContext } from 'formik';

import CheckedItemsList from './CheckedItemsList';

import Block from '../Block';

import SearchFilter from '@components/common/SearchFilter';
import SvgIcon from '@components/common/SvgIcon';

import { useCurrentLocale } from '@hooks/useCurrentLocale';

import { IconId } from '@enums/iconsSpriteId';

interface ICategoryItemProps {
  categories: ISeoCategory[];
  subcategoriesMap: Record<string, ISeoCategory[]>;
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
  initialValue: MultiLanguageString | string | (MultiLanguageString | string)[];
  selectedParentId: string | null;
  setSelectedParentId: Dispatch<SetStateAction<string | null>>;
}

interface IFormikValues {
  seoCategoryId: string;
  seoSubcategoryId: string;
  productCategoryId: string;
}

const CategoryItem: FC<ICategoryItemProps> = ({
  categories,
  subcategoriesMap,
  keyword,
  setKeyword,
  initialValue,
  selectedParentId,
  setSelectedParentId,
}) => {
  const [checkedValue, setCheckedValue] = useState(initialValue);
  const locale = useCurrentLocale();

  const { setFieldValue } = useFormikContext<IFormikValues>();

  const normalizedCheckedValue = useMemo(() => {
    if (Array.isArray(checkedValue)) {
      return checkedValue.length > 0 ? String(checkedValue[0]) : '';
    }

    if (
      typeof checkedValue === 'object' &&
      checkedValue !== null &&
      'en' in checkedValue
    ) {
      return String(checkedValue.en ?? '');
    }

    return String(checkedValue ?? '');
  }, [checkedValue]);

  const selectedSubcategory = useMemo(() => {
    if (!normalizedCheckedValue) return null;

    const allSubcategories = Object.values(subcategoriesMap).flat();

    return (
      allSubcategories.find(
        sub => String(sub._id) === normalizedCheckedValue
      ) ?? null
    );
  }, [normalizedCheckedValue, subcategoriesMap]);

  const selectedSubcategoryName = useMemo(() => {
    return selectedSubcategory?.name?.[locale] ?? '';
  }, [selectedSubcategory, locale]);

  const filteredData = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    return categories
      .map(category => {
        const categoryId = String(category._id);
        const categoryName = category.name[locale]?.toLowerCase() ?? '';
        const categorySubcategories = subcategoriesMap[categoryId] ?? [];

        if (!lowerKeyword) {
          return {
            category,
            matchedSubcategories: categorySubcategories,
          };
        }

        const categoryMatches = categoryName.includes(lowerKeyword);

        const matchedSubcategories = categorySubcategories.filter(sub =>
          sub.name[locale]?.toLowerCase().includes(lowerKeyword)
        );

        if (categoryMatches) {
          return {
            category,
            matchedSubcategories: categorySubcategories,
          };
        }

        if (matchedSubcategories.length > 0) {
          return {
            category,
            matchedSubcategories,
          };
        }

        return null;
      })
      .filter(Boolean) as {
      category: ISeoCategory;
      matchedSubcategories: ISeoCategory[];
    }[];
  }, [categories, subcategoriesMap, keyword, locale]);

  const handleCheckedValue = (
    subcategory: ISeoCategory,
    parentCategoryId: string
  ) => {
    const subcategoryId = String(subcategory._id);
    const isSameValue = subcategoryId === normalizedCheckedValue;

    if (isSameValue) {
      setCheckedValue('');
      setFieldValue('seoCategoryId', '', false);
      setFieldValue('seoSubcategoryId', '', false);
      setFieldValue('productCategoryId', '', false);
      return;
    }

    setCheckedValue(subcategoryId);
    setSelectedParentId(parentCategoryId);

    setFieldValue('seoCategoryId', parentCategoryId, false);
    setFieldValue('seoSubcategoryId', subcategoryId, false);
    setFieldValue(
      'productCategoryId',
      String(subcategory.productCategoryId ?? ''),
      false
    );
  };

  const handleResetCheckedValue = () => {
    setCheckedValue('');
    setFieldValue('seoCategoryId', '', false);
    setFieldValue('seoSubcategoryId', '', false);
    setFieldValue('productCategoryId', '', false);
  };

  const handleParentToggle = (parentId: string) => {
    setSelectedParentId(prev => (prev === parentId ? null : parentId));
  };

  const isSearching = keyword.trim().length > 0;

  return (
    <fieldset className="mb-[10px]">
      <Block title="Category" intent="filter">
        {normalizedCheckedValue && (
          <CheckedItemsList
            checkedValue={selectedSubcategoryName}
            setCheckedValue={handleResetCheckedValue}
          />
        )}

        <SearchFilter keyword={keyword} setKeyword={setKeyword} />

        <div className="flex flex-col">
          {filteredData.length > 0 ? (
            filteredData.map(({ category, matchedSubcategories }) => {
              const categoryId = String(category._id);
              const isActive = isSearching || categoryId === selectedParentId;

              return (
                <div
                  key={categoryId}
                  className="border-b border-[rgba(0,32,52,.12)]"
                >
                  <button
                    type="button"
                    onClick={() => handleParentToggle(categoryId)}
                    className={clsx(
                      'text-primary flex w-full items-center justify-between px-[16px] py-[18px] text-left uppercase transition-colors',
                      isActive
                        ? 'bg-secondary font-bold'
                        : 'bg-transperent hover:bg-secondary font-medium'
                    )}
                  >
                    <span>{category.name[locale]}</span>

                    <SvgIcon
                      iconId={IconId.ArrowRight}
                      size={{ width: 14, height: 14 }}
                      className={clsx(
                        'transition-transform',
                        isActive && 'rotate-90'
                      )}
                    />
                  </button>

                  {isActive && (
                    <div className="flex flex-col gap-[12px] px-[16px] pt-[4px] pb-[18px]">
                      {matchedSubcategories.length > 0 ? (
                        matchedSubcategories.map(subcategory => {
                          const subcategoryId = String(subcategory._id);
                          const checked =
                            normalizedCheckedValue === subcategoryId;

                          return (
                            <label
                              key={subcategoryId}
                              htmlFor={subcategoryId}
                              className="flex items-center gap-[10px]"
                            >
                              <input
                                type="checkbox"
                                id={subcategoryId}
                                name="seoSubcategoryId"
                                value={subcategoryId}
                                checked={checked}
                                onChange={() =>
                                  handleCheckedValue(subcategory, categoryId)
                                }
                                className="checked:after:bg-primary checked:after:bg-check-icon h-[16px] w-[16px] cursor-pointer appearance-none rounded-[4px] after:block after:h-[16px] after:w-[16px] after:rounded-[4px] after:border after:border-[rgba(0,32,52,.12)] checked:after:bg-center checked:after:bg-no-repeat"
                              />

                              <span className="font-openSans text-[14px] capitalize">
                                {subcategory.name[locale]}
                              </span>
                            </label>
                          );
                        })
                      ) : (
                        <p className="text-[14px] text-[rgba(0,32,52,.6)]">
                          No subcategories
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="px-[16px] py-[18px] text-[14px] text-[rgba(0,32,52,.6)]">
              Nothing found
            </p>
          )}
        </div>
      </Block>
    </fieldset>
  );
};

export default CategoryItem;

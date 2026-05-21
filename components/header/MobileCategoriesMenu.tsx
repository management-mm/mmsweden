'use client';

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import { ISeoCategory } from '@interfaces/ISeoCategory';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import MobileCategoriesMenuSkeleton from './MobileCategoriesMenuSkeleton';

import SearchFilter from '@components/common/SearchFilter';
import SvgIcon from '@components/common/SvgIcon';

import { Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

import { AppLocale } from '@i18n/config';

type Props = {
  categories: ISeoCategory[];
  subcategories: ISeoCategory[];
  subcategoriesMap: Record<string, ISeoCategory[]>;
  selectedParentId: string | null;
  setSelectedParentId: Dispatch<SetStateAction<string | null>>;
  locale: AppLocale;
  mode: 'filters' | 'header' | 'mobile';
  isCategoriesLoading?: boolean;
  isSubcategoriesLoading?: boolean;
};

export default function MobileCategoriesMenu({
  categories,
  subcategories,
  subcategoriesMap,
  selectedParentId,
  setSelectedParentId,
  locale,
  mode,
  isCategoriesLoading = false,
  isSubcategoriesLoading = false,
}: Props) {
  const t = useTranslations();
  const pathname = usePathname();

  const [keyword, setKeyword] = useState('');

  const { activeCategorySlug, activeSubcategorySlug } = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const allProductsIndex = segments.indexOf('all-products');

    if (allProductsIndex === -1) {
      return {
        activeCategorySlug: undefined,
        activeSubcategorySlug: undefined,
      };
    }

    return {
      activeCategorySlug: segments[allProductsIndex + 1],
      activeSubcategorySlug: segments[allProductsIndex + 2],
    };
  }, [pathname]);

  const activeCategory = useMemo(() => {
    return categories.find(category => category.slug === activeCategorySlug);
  }, [categories, activeCategorySlug]);

  useEffect(() => {
    if (!activeCategory) return;

    setSelectedParentId(String(activeCategory._id));
  }, [activeCategory, setSelectedParentId]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const isSearching = normalizedKeyword.length > 0;

  const filteredData = useMemo(() => {
    return categories
      .map(category => {
        const categoryId = String(category._id);
        const categoryName = category.name[locale]?.toLowerCase() ?? '';
        const categoryNameEn = category.name.en?.toLowerCase() ?? '';
        const categorySlug = category.slug?.toLowerCase() ?? '';

        const categorySubcategories =
          subcategoriesMap[categoryId] ??
          (categoryId === selectedParentId ? subcategories : []);

        if (!normalizedKeyword) {
          return {
            category,
            matchedSubcategories: categorySubcategories,
          };
        }

        const categoryMatches =
          categoryName.includes(normalizedKeyword) ||
          categoryNameEn.includes(normalizedKeyword) ||
          categorySlug.includes(normalizedKeyword);

        const matchedSubcategories = categorySubcategories.filter(
          subcategory => {
            const subcategoryName =
              subcategory.name[locale]?.toLowerCase() ?? '';
            const subcategoryNameEn = subcategory.name.en?.toLowerCase() ?? '';
            const subcategorySlug = subcategory.slug?.toLowerCase() ?? '';

            return (
              subcategoryName.includes(normalizedKeyword) ||
              subcategoryNameEn.includes(normalizedKeyword) ||
              subcategorySlug.includes(normalizedKeyword)
            );
          }
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
  }, [
    categories,
    subcategories,
    subcategoriesMap,
    selectedParentId,
    normalizedKeyword,
    locale,
  ]);

  const handleToggleCategory = (id: string) => {
    setSelectedParentId(prev => (prev === id ? null : id));
  };

  if (isCategoriesLoading) {
    return <MobileCategoriesMenuSkeleton mode={mode} />;
  }

  return (
    <div
      className={clsx(
        'w-full overflow-x-hidden',
        mode === 'filters' && 'h-[350px] overflow-y-auto',
        mode === 'mobile' && 'overflow-visible'
      )}
    >
      <SearchFilter keyword={keyword} setKeyword={setKeyword} />

      {filteredData.length > 0 ? (
        filteredData.map(({ category, matchedSubcategories }) => {
          const categoryId = String(category._id);
          const isOpen = isSearching || categoryId === selectedParentId;

          const isActiveCategory = category.slug === activeCategorySlug;
          const isActiveCategoryPage =
            isActiveCategory && !activeSubcategorySlug;

          return (
            <div key={categoryId} className="border-b border-slate-200">
              <button
                type="button"
                onClick={() => handleToggleCategory(categoryId)}
                className={clsx(
                  'flex w-full items-center justify-between py-[18px] pr-[24px] pl-[16px] text-start text-[12px] uppercase transition-colors',
                  isActiveCategory
                    ? 'bg-secondary text-primary font-bold'
                    : isOpen
                      ? 'bg-secondary/60 text-primary font-bold'
                      : 'text-primary bg-white font-medium'
                )}
              >
                <span className="min-w-0 flex-1 pr-[12px] break-words whitespace-normal">
                  {category.name[locale]}
                </span>

                <div
                  className={clsx(
                    'shrink-0 transition-transform duration-300 ease-in-out',
                    isOpen ? 'rotate-0' : 'rotate-45'
                  )}
                >
                  <SvgIcon
                    iconId={IconId.OpenClose}
                    size={{ width: 14, height: 14 }}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="overflow-x-hidden bg-white px-[16px] pb-[16px]">
                  <div className="flex flex-col">
                    {!isSearching && (
                      <Link
                        href={`/${locale}/all-products/${category.slug}`}
                        className={clsx(
                          'block rounded-[8px] py-[8px] pl-[16px] text-[14px] break-words whitespace-normal transition-colors',
                          isActiveCategoryPage
                            ? 'bg-secondary text-primary font-semibold'
                            : 'hover:bg-secondary'
                        )}
                      >
                        {t(Title.All)}
                      </Link>
                    )}

                    {isSubcategoriesLoading &&
                    categoryId === selectedParentId &&
                    !isSearching ? (
                      <div className="py-[8px] pl-[16px]">
                        <div className="space-y-[10px]">
                          <div className="h-[16px] w-[70%] animate-pulse rounded bg-slate-200" />
                          <div className="h-[16px] w-[55%] animate-pulse rounded bg-slate-200" />
                          <div className="h-[16px] w-[65%] animate-pulse rounded bg-slate-200" />
                        </div>
                      </div>
                    ) : matchedSubcategories.length > 0 ? (
                      matchedSubcategories.map(subcategory => {
                        const isActiveSubcategory =
                          isActiveCategory &&
                          subcategory.slug === activeSubcategorySlug;

                        return (
                          <Link
                            href={`/${locale}/all-products/${category.slug}/${subcategory.slug}`}
                            key={String(subcategory._id)}
                            className={clsx(
                              'block rounded-[8px] py-[8px] pl-[16px] text-[14px] break-words whitespace-normal transition-colors',
                              isActiveSubcategory
                                ? 'bg-primary text-secondary font-semibold'
                                : 'hover:bg-secondary'
                            )}
                          >
                            {subcategory.name[locale]}
                          </Link>
                        );
                      })
                    ) : (
                      <p className="px-[16px] py-[8px] text-[14px] text-[rgba(0,32,52,.6)]">
                        Nothing found
                      </p>
                    )}
                  </div>
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
  );
}

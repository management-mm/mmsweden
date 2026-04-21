'use client';

import { type RefObject, useEffect, useMemo, useState } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import DesktopCategoriesContentSkeleton from './DesktopCategoriesContentSkeleton';
import DesktopCategoriesMenuSkeleton from './DesktopCategoriesMenuSkeleton';
import MobileCategoriesMenu from './MobileCategoriesMenu';

import SvgIcon from '@components/common/SvgIcon';

import { useChildCategories } from '@hooks/queries/useChildCategories';
import { useTopLevelCategories } from '@hooks/queries/useTopLevelCategories';
import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useOutsideAlerter from '@hooks/useOutsideAlerter';
import useWindowWidth from '@hooks/useWindowWidth';

import { Filter, Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type Props = {
  mode?: 'filters' | 'header' | 'mobile';
  isOpenHeaderMenu?: boolean;
  onCloseHeaderMenu?: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
};

export default function CategoriesMenu({
  mode = 'header',
  isOpenHeaderMenu = false,
  onCloseHeaderMenu,
  triggerRef,
}: Props) {
  const locale = useCurrentLocale();
  const windowWidth = useWindowWidth();
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(mode === 'filters');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const isMobileMode = mode === 'mobile';
  const isMobileView = isMobileMode || windowWidth < 1178;
  const isHeaderMode = mode === 'header';
  const isFiltersMode = mode === 'filters';
  const isDesktopHeaderMenu = isHeaderMode && !isMobileView;

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useTopLevelCategories();

  const {
    data: subcategories = [],
    isLoading: isSubcategoriesLoading,
    error: subcategoriesError,
  } = useChildCategories(selectedParentId);

  useEffect(() => {
    if (selectedParentId || categories.length === 0) return;

    if (isDesktopHeaderMenu) {
      return;
    }

    setSelectedParentId(String(categories[0]._id));
  }, [categories, selectedParentId, isDesktopHeaderMenu]);

  useEffect(() => {
    if (isFiltersMode) {
      setIsOpen(true);
    }
  }, [isFiltersMode]);

  useEffect(() => {
    if (isDesktopHeaderMenu && !isOpenHeaderMenu) {
      setSelectedParentId(null);
    }
  }, [isDesktopHeaderMenu, isOpenHeaderMenu]);

  const outsideAlerterRef = useOutsideAlerter(
    () => {
      if (!isHeaderMode) return;
      if (!isOpenHeaderMenu) return;

      setSelectedParentId(null);
      onCloseHeaderMenu?.();
    },
    isHeaderMode && isOpenHeaderMenu,
    triggerRef ? [triggerRef] : []
  );

  const selectedParent = useMemo(
    () =>
      categories.find(category => String(category._id) === selectedParentId),
    [categories, selectedParentId]
  );

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId !== selectedParentId) {
      setSelectedParentId(categoryId);
    }
  };

  const mobileMenuContent = (
    <MobileCategoriesMenu
      categories={categories}
      subcategories={subcategories}
      selectedParentId={selectedParentId}
      setSelectedParentId={setSelectedParentId}
      locale={locale}
      mode={mode}
      isCategoriesLoading={isCategoriesLoading}
      isSubcategoriesLoading={isSubcategoriesLoading}
    />
  );

  if (categoriesError || subcategoriesError) {
    return <div>Failed to load categories</div>;
  }

  if (isHeaderMode && !isOpenHeaderMenu) {
    return null;
  }

  if (isFiltersMode) {
    return (
      <div className="mb-[10px]">
        <button
          type="button"
          className="flex w-full items-center justify-between py-[10px]"
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
        >
          <legend className="font-openSans text-title text-[14px] font-semibold">
            {t(Filter.Category)}
          </legend>

          <SvgIcon
            iconId={isOpen ? IconId.ArrowTop : IconId.ArrowDown}
            size={{ width: 10, height: 10 }}
          />
        </button>

        <div
          className={clsx(
            'overflow-hidden transition-all duration-500 ease-in-out',
            isOpen ? 'max-h-[1000px]' : 'max-h-0'
          )}
        >
          {mobileMenuContent}
        </div>
      </div>
    );
  }

  if (isMobileMode) {
    return <div className="w-full">{mobileMenuContent}</div>;
  }

  return (
    <div
      ref={outsideAlerterRef}
      className={clsx(
        isMobileView
          ? 'border-t-primary fixed top-[128px] right-0 bottom-0 left-0 z-50 border-t bg-white md:top-[164px]'
          : 'absolute top-[68px] left-[-190px] z-50'
      )}
    >
      {isMobileView ? (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {mobileMenuContent}
          </div>
        </div>
      ) : isCategoriesLoading ? (
        <div className="w-[420px] overflow-hidden rounded-[18px] border border-black/5 bg-white py-[14px] shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
          <DesktopCategoriesMenuSkeleton />
        </div>
      ) : (
        <div className="relative">
          <div className="w-[420px] overflow-hidden rounded-[18px] border border-black/5 bg-white py-[14px] shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
            {categories.map(category => {
              const categoryId = String(category._id);
              const isSelected = categoryId === selectedParentId;

              return (
                <button
                  key={categoryId}
                  type="button"
                  onClick={() => handleCategorySelect(categoryId)}
                  onMouseEnter={() => handleCategorySelect(categoryId)}
                  onFocus={() => handleCategorySelect(categoryId)}
                  className={clsx(
                    'text-primary flex w-full items-center justify-between px-[18px] py-[16px] text-start uppercase transition-all duration-200',
                    isSelected
                      ? 'bg-secondary font-bold'
                      : 'hover:bg-secondary bg-white font-medium'
                  )}
                >
                  <span className="min-w-0 flex-1 pr-[12px]">
                    {category.name[locale]}
                  </span>

                  <SvgIcon
                    iconId={IconId.ArrowRight}
                    size={{ width: 14, height: 14 }}
                    className={clsx(
                      'shrink-0 transition-transform duration-200',
                      isSelected && 'translate-x-1'
                    )}
                  />
                </button>
              );
            })}
          </div>

          {selectedParentId && (
            <div className="absolute top-0 left-[calc(100%+16px)] w-[460px] overflow-hidden rounded-[18px] border border-black/5 bg-white p-[24px] shadow-[0_18px_50px_rgba(15,23,42,0.14)]">
              {isSubcategoriesLoading ? (
                <DesktopCategoriesContentSkeleton />
              ) : (
                <div className="min-w-0">
                  <p className="mb-[24px] text-[24px] font-semibold">
                    {selectedParent?.name[locale]}
                  </p>

                  <div className="grid grid-cols-2 gap-x-[24px] gap-y-[2px]">
                    <div className="min-w-0">
                      <Link
                        href={`/${locale}/all-products/${selectedParent?.slug}`}
                        className="hover:bg-secondary block rounded-[8px] py-[8px] pl-[12px] break-words transition-colors duration-200"
                      >
                        {t(Title.All)}
                      </Link>

                      {subcategories.slice(0, 9).map(subcategory => (
                        <Link
                          href={`/${locale}/all-products/${selectedParent?.slug}/${subcategory.slug}`}
                          key={String(subcategory._id)}
                          className="hover:bg-secondary block rounded-[8px] py-[8px] pl-[12px] break-words transition-colors duration-200"
                        >
                          {subcategory.name[locale]}
                        </Link>
                      ))}
                    </div>

                    <div className="min-w-0">
                      {subcategories.slice(9).map(subcategory => (
                        <Link
                          href={`/${locale}/all-products/${selectedParent?.slug}/${subcategory.slug}`}
                          key={String(subcategory._id)}
                          className="hover:bg-secondary block rounded-[8px] py-[8px] pl-[12px] break-words transition-colors duration-200"
                        >
                          {subcategory.name[locale]}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

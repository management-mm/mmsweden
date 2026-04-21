'use client';

import { RefObject, useEffect, useMemo, useState } from 'react';

import { getChildren, getTopLevel } from '@api/categoriesService';
import { ISeoCategory } from '@interfaces/ISeoCategory';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import DesktopCategoriesContentSkeleton from './DesktopCategoriesContentSkeleton';
import DesktopCategoriesMenuSkeleton from './DesktopCategoriesMenuSkeleton';
import MobileCategoriesMenu from './MobileCategoriesMenu';

import SvgIcon from '@components/common/SvgIcon';

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
  const [categories, setCategories] = useState<ISeoCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISeoCategory[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);

  const isMobileMode = mode === 'mobile';
  const isMobileView = isMobileMode || windowWidth < 1178;
  const isHeaderMode = mode === 'header';
  const isFiltersMode = mode === 'filters';

  useEffect(() => {
    if (isFiltersMode) {
      setIsOpen(true);
    }
  }, [isFiltersMode]);

  const outsideAlerterRef = useOutsideAlerter(
    () => {
      if (!isHeaderMode) return;
      if (!isOpenHeaderMenu) return;

      onCloseHeaderMenu?.();
    },
    isHeaderMode && isOpenHeaderMenu,
    triggerRef ? [triggerRef] : []
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsCategoriesLoading(true);

        const data = await getTopLevel();
        setCategories(data);

        if (data.length > 0) {
          setSelectedParentId(String(data[0]._id));
        }
      } catch (error) {
        console.error('Failed to load top-level categories:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedParentId) {
      setSubcategories([]);
      return;
    }

    const loadSubcategories = async () => {
      try {
        setIsSubcategoriesLoading(true);

        const data = await getChildren(selectedParentId);
        setSubcategories(data);
      } catch (error) {
        console.error('Failed to load subcategories:', error);
      } finally {
        setIsSubcategoriesLoading(false);
      }
    };

    loadSubcategories();
  }, [selectedParentId]);

  const selectedParent = useMemo(
    () =>
      categories.find(category => String(category._id) === selectedParentId),
    [categories, selectedParentId]
  );

  const mobileMenuContent = (
    <MobileCategoriesMenu
      categories={categories}
      subcategories={subcategories}
      selectedParentId={selectedParentId}
      setSelectedParentId={setSelectedParentId}
      locale={locale}
      mode={mode}
      selectedParent={selectedParent}
      isLoading={isCategoriesLoading || isSubcategoriesLoading}
    />
  );

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
        'border-t-primary fixed top-[128px] right-0 bottom-0 left-0 z-50 border-t bg-white md:top-[164px]',
        isMobileView
          ? 'overflow-hidden'
          : 'overflow-x-hidden overflow-y-auto rounded-none py-[24px] lg:absolute lg:top-[68px] lg:right-auto lg:bottom-auto lg:left-[-190px] lg:h-auto lg:w-[min(1140px,calc(100vw-60px))] lg:overflow-visible lg:rounded-b-[22px]'
      )}
    >
      {isMobileView ? (
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {mobileMenuContent}
          </div>
        </div>
      ) : isCategoriesLoading ? (
        <DesktopCategoriesMenuSkeleton />
      ) : (
        <div className="flex gap-[32px] px-[20px] py-[24px] xl:gap-[40px]">
          <div className="border-r-secondary w-[340px] shrink-0 border-r pr-[24px] xl:w-[420px]">
            {categories.map(category => (
              <button
                key={String(category._id)}
                type="button"
                onClick={() => setSelectedParentId(String(category._id))}
                className={clsx(
                  'text-primary hover:bg-secondary flex w-full items-center justify-between py-[18px] pr-[20px] pl-[16px] text-start uppercase',
                  String(category._id) === selectedParentId
                    ? 'bg-secondary font-bold'
                    : 'bg-white font-medium'
                )}
              >
                <span className="min-w-0 flex-1 pr-[12px]">
                  {category.name[locale]}
                </span>

                <SvgIcon
                  iconId={IconId.ArrowRight}
                  size={{ width: 14, height: 14 }}
                />
              </button>
            ))}
          </div>

          {isSubcategoriesLoading ? (
            <DesktopCategoriesContentSkeleton />
          ) : (
            <div className="min-w-0 flex-1 pt-[24px]">
              <p className="mb-[32px] text-[24px] font-semibold">
                {selectedParent?.name[locale]}
              </p>

              <div className="grid grid-cols-2 gap-x-[18px]">
                <div className="min-w-0">
                  <Link
                    href={`/${locale}/all-products/${selectedParent?.slug}`}
                    key={String(selectedParentId)}
                    className="hover:bg-secondary block py-[8px] pl-[16px] break-words"
                  >
                    {t(Title.All)}
                  </Link>

                  {subcategories.slice(0, 9).map(subcategory => (
                    <Link
                      href={`/${locale}/all-products/${selectedParent?.slug}/${subcategory.slug}`}
                      key={String(subcategory._id)}
                      className="hover:bg-secondary block py-[8px] pl-[16px] break-words"
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
                      className="hover:bg-secondary block py-[8px] pl-[16px] break-words"
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
  );
}

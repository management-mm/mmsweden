'use client';

import { useEffect, useState } from 'react';

import { getChildren, getTopLevel } from '@api/categoriesService';
import { ISeoCategory } from '@interfaces/ISeoCategory';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import MobileCategoriesMenu from './MobileCategoriesMenu';

import SvgIcon from '@components/common/SvgIcon';

import { useCurrentLocale } from '@hooks/useCurrentLocale';
import useOutsideAlerter from '@hooks/useOutsideAlerter';
import useWindowWidth from '@hooks/useWindowWidth';

import { Filter, Title } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type Props = {
  mode?: 'filters' | 'header';
  isOpenHeaderMenu?: boolean;
  onCloseHeaderMenu?: () => void;
};

export default function CategoriesMenu({
  mode = 'header',
  isOpenHeaderMenu = false,
  onCloseHeaderMenu,
}: Props) {
  const language = useCurrentLocale();
  const windowWidth = useWindowWidth();
  const t = useTranslations();

  const [isOpen, setIsOpen] = useState(mode === 'filters');
  const [categories, setCategories] = useState<ISeoCategory[]>([]);
  const [subcategories, setSubcategories] = useState<ISeoCategory[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const isMobileView = windowWidth < 1178;

  const handleToggleMenu = () => {
    if (mode === 'filters') {
      setIsOpen(prev => !prev);
      return;
    }

    if (mode === 'header' && isOpenHeaderMenu) {
      onCloseHeaderMenu?.();
    }
  };

  useEffect(() => {
    if (mode === 'filters') {
      setIsOpen(true);
    }
  }, [mode]);

  const outsideAlerterRef = useOutsideAlerter(
    () => {
      if (mode !== 'header') return;
      if (!isOpenHeaderMenu) return;

      onCloseHeaderMenu?.();
    },
    mode === 'header' && isOpenHeaderMenu
  );

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getTopLevel();
        setCategories(data);

        if (data.length > 0) {
          setSelectedParentId(String(data[0]._id));
        }
      } catch (error) {
        console.error('Failed to load top-level categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (!selectedParentId) {
      setSubcategories([]);
      return;
    }

    setSubcategories([]);

    const loadSubcategories = async () => {
      try {
        const data = await getChildren(selectedParentId);
        setSubcategories(data);
      } catch (error) {
        console.error('Failed to load subcategories:', error);
      }
    };

    loadSubcategories();
  }, [selectedParentId]);

  const selectedParent = categories.find(
    category => String(category._id) === selectedParentId
  );

  const shouldShowMobileMenu = mode === 'filters' ? isOpen : isOpenHeaderMenu;

  if (mode === 'header' && !isOpenHeaderMenu) {
    return null;
  }

  return (
    <div
      ref={mode === 'header' ? outsideAlerterRef : null}
      className={clsx(
        mode === 'filters'
          ? 'mb-[10px]'
          : 'border-t-primary fixed top-[128px] right-0 bottom-0 left-0 z-50 overflow-x-hidden overflow-y-auto rounded-none border-t py-[24px]',
        mode === 'filters'
          ? 'static w-full'
          : 'bg-white lg:absolute lg:top-[68px] lg:right-auto lg:bottom-auto lg:left-[-190px] lg:h-auto lg:w-[min(1140px,calc(100vw-60px))] lg:overflow-visible lg:rounded-b-[22px]',
        'md:top-[164px]'
      )}
    >
      <div className="h-full lg:h-auto">
        {mode === 'filters' && (
          <button
            type="button"
            className="flex w-full items-center justify-between py-[10px]"
            onClick={handleToggleMenu}
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
        )}

        {isMobileView || mode === 'filters' ? (
          <div
            className={clsx(
              'overflow-hidden transition-all duration-500 ease-in-out',
              shouldShowMobileMenu ? 'max-h-[1000px]' : 'max-h-0',
              mode === 'header' && 'w-full max-w-full overflow-x-hidden'
            )}
          >
            <div
              className={clsx(
                mode === 'header' && 'w-full max-w-full overflow-x-hidden'
              )}
            >
              <MobileCategoriesMenu
                categories={categories}
                subcategories={subcategories}
                selectedParentId={selectedParentId}
                setSelectedParentId={setSelectedParentId}
                language={language}
                mode={mode}
                selectedParent={selectedParent}
              />
            </div>
          </div>
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
                    {category.name[language]}
                  </span>

                  <SvgIcon
                    iconId={IconId.ArrowRight}
                    size={{ width: 14, height: 14 }}
                  />
                </button>
              ))}
            </div>

            <div className="min-w-0 flex-1 pt-[24px]">
              <p className="mb-[32px] text-[24px] font-semibold">
                {selectedParent?.name[language]}
              </p>

              <div className="grid grid-cols-2 gap-x-[18px]">
                <div className="min-w-0">
                  <Link
                    href={`/all-products/${selectedParent?.slug}`}
                    key={String(selectedParentId)}
                    className="hover:bg-secondary block py-[8px] pl-[16px] break-words"
                  >
                    {t(Title.All)}
                  </Link>
                  {subcategories.slice(0, 9).map(subcategory => (
                    <Link
                      href={`/all-products/${selectedParent?.slug}/${subcategory.slug}`}
                      key={String(subcategory._id)}
                      className="hover:bg-secondary block py-[8px] pl-[16px] break-words"
                    >
                      {subcategory.name[language]}
                    </Link>
                  ))}
                </div>

                <div className="min-w-0">
                  {subcategories.slice(9).map(subcategory => (
                    <Link
                      href={`/all-products/${selectedParent?.slug}/${subcategory.slug}`}
                      key={String(subcategory._id)}
                      className="hover:bg-secondary block py-[8px] pl-[16px] break-words"
                    >
                      {subcategory.name[language]}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import BurgerMenu from './BurgerMenu';
import CategoriesBurgerMenu from './CategoriesBurgerMenu';
import CategoriesMenu from './CategoriesMenu';
import PriceQuoteBtn from './PriceQuoteBtn';
import ProductsListMenu from './ProductsListMenu';

import { Logo } from '@components/common/Logo';
import SvgIcon from '@components/common/SvgIcon';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

import { Button, Placeholder } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

type MobileHeaderProps = {
  toggleMobileMenu: () => void;
};

export default function MobileHeader({ toggleMobileMenu }: MobileHeaderProps) {
  const [isOpenCategories, setIsOpenCategories] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get('keyword') || ''
  );

  const t = useTranslations();

  const toggleCategoriesMenu = () => {
    setIsSearchActive(false);
    setIsOpenCategories(prev => !prev);
  };
  useEffect(() => {
    if (!isSearchActive) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('keyword');

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [isSearchActive]);
  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('keyword', value);
    } else {
      params.delete('keyword');
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="py-3 lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="shrink-0">
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelect />
          <div className="flex-1">
            <PriceQuoteBtn />
          </div>
          <BurgerMenu handleToggleMobileMenu={toggleMobileMenu} />
        </div>
      </div>

      <div className="mt-3">
        <div className="relative flex w-full items-center gap-2">
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={toggleCategoriesMenu}
              aria-expanded={isOpenCategories}
              aria-label="Toggle categories menu"
              className={clsx(
                'flex h-[44px] items-center justify-center rounded-full border border-slate-300 bg-white text-[15px] font-medium text-[#163A5F] transition-all duration-300 ease-in-out hover:bg-slate-50',
                isSearchActive ? 'px-3' : 'px-5'
              )}
            >
              <CategoriesBurgerMenu isOpen={isOpenCategories} />

              <span
                className={clsx(
                  'overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out',
                  isSearchActive
                    ? 'ml-0 max-w-0 opacity-0'
                    : 'ml-2 max-w-[120px] opacity-100'
                )}
              >
                {t(Button.Categories)}
              </span>
            </button>

            {isOpenCategories && (
              <CategoriesMenu
                mode="header"
                isOpenHeaderMenu={isOpenCategories}
                onCloseHeaderMenu={() => setIsOpenCategories(false)}
              />
            )}
          </div>
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t(Placeholder.Search)}
              value={searchValue}
              onChange={e => handleSearchChange(e.target.value)}
              onFocus={() => {
                setIsSearchActive(true);
                setIsOpenCategories(false);
              }}
              className="h-[44px] w-full rounded-full border border-slate-300 bg-white pr-14 pl-5 text-[14px] text-[#163A5F] outline-none placeholder:text-slate-400 focus:border-[#0B5CAB]"
            />

            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                setIsSearchActive(true);
                setIsOpenCategories(false);
              }}
              className="absolute top-1/2 right-[6px] flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0B5CAB] text-white"
            >
              <SvgIcon
                iconId={IconId.Search}
                size={{ width: 16, height: 16 }}
                className="fill-secondary"
              />
            </button>
            <div className="">
              <ProductsListMenu className="absolute left-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

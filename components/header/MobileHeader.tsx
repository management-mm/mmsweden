'use client';

import { useEffect, useRef, useState } from 'react';

import clsx from 'clsx';

import BurgerMenu from './BurgerMenu';
import CategoriesBurgerMenu from './CategoriesBurgerMenu';
import CategoriesMenu from './CategoriesMenu';
import HeaderSearch from './HeaderSearch';
import PriceQuoteBtn from './PriceQuoteBtn';

import { Logo } from '@components/common/Logo';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

import useSearchKeyword from '@hooks/useSearchKeyword';
import useWindowWidth from '@hooks/useWindowWidth';

import { Button } from '@enums/i18nConstants';

type MobileHeaderProps = {
  toggleMobileMenu: () => void;
};

const SEARCH_DEBOUNCE_MS = 400;

export default function MobileHeader({ toggleMobileMenu }: MobileHeaderProps) {
  const [isOpenCategories, setIsOpenCategories] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < 1178;

  const categoriesTriggerRef = useRef<HTMLButtonElement | null>(null);

  const { searchValue, setSearchValue, clearSearch } = useSearchKeyword({
    debounceMs: SEARCH_DEBOUNCE_MS,
    enabled: isMobile,
  });

  useEffect(() => {
    if (isOpenCategories) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpenCategories]);

  const toggleCategoriesMenu = () => {
    setIsSearchActive(false);
    clearSearch();
    setIsOpenCategories(prev => !prev);
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
              ref={categoriesTriggerRef}
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
                {Button.Categories}
              </span>
            </button>

            {isOpenCategories && (
              <CategoriesMenu
                mode="header"
                isOpenHeaderMenu={isOpenCategories}
                onCloseHeaderMenu={() => setIsOpenCategories(false)}
                triggerRef={categoriesTriggerRef}
              />
            )}
          </div>

          <div className="relative w-full">
            <HeaderSearch
              value={searchValue}
              onChange={setSearchValue}
              onFocus={() => {
                setIsSearchActive(true);
                setIsOpenCategories(false);
              }}
              onSearchClick={() => {
                setIsSearchActive(true);
                setIsOpenCategories(false);
              }}
              wrapperClassName="relative w-full"
              inputClassName="h-[44px] w-full rounded-full border border-slate-300 bg-white pr-14 pl-5 text-[14px] text-[#163A5F] outline-none placeholder:text-slate-400 focus:border-[#0B5CAB]"
              buttonClassName="absolute top-1/2 right-[6px] flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0B5CAB] text-white"
              productsMenuClassName="absolute left-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import CategoriesBurgerMenu from './CategoriesBurgerMenu';
import CategoriesMenu from './CategoriesMenu';
import MobileHeader from './MobileHeader';
import PriceQuoteBtn from './PriceQuoteBtn';
import ProductsListMenu from './ProductsListMenu';

import { Logo } from '@components/common/Logo';
import MobileMenu from '@components/common/MobileMenu';
import Navbar from '@components/common/Navbar';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

import { Button, Placeholder } from '@enums/i18nConstants';
import SvgIcon from '@components/common/SvgIcon';
import { IconId } from '@enums/iconsSpriteId';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategories, setIsOpenCategories] = useState(false);

  const t = useTranslations();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get('keyword') || ''
  );

  const toggleCategoriesMenu = () => {
    setIsOpenCategories(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setIsOpen(prev => !prev);
  };

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
    <header className="relative z-30 border-b border-slate-200 bg-white">
      <div className="bg-primary hidden border-b border-slate-200 lg:block">
        <div className="container">
          <div className="flex h-[35px] items-center justify-between">
            <div />
            <div className="flex items-center gap-6">
              <Navbar intent="header" />
              <div className="flex items-center gap-3">
                <LanguageSelect />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="container">
          <div className="flex-wrap-no-warap flex h-[90px] items-center gap-6 py-4 max-lg:hidden">
            <div className="shrink-0">
              <Logo />
            </div>

            <div className="relative">
              <button
                onClick={toggleCategoriesMenu}
                className="flex h-[48px] items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-5 text-[15px] font-medium text-[#163A5F] transition hover:bg-slate-50"
              >
                <CategoriesBurgerMenu isOpen={isOpenCategories} />
                {t(Button.Categories)}
              </button>
              {isOpenCategories && (
                <CategoriesMenu
                  mode="header"
                  isOpenHeaderMenu={isOpenCategories}
                  onCloseHeaderMenu={() => setIsOpenCategories(false)}
                />
              )}
            </div>

            <div className="w-full">
              <div className="relative mx-auto w-full max-w-[620px]">
                <input
                  type="text"
                  value={searchValue}
                  onChange={e => handleSearchChange(e.target.value)}
                  placeholder={t(Placeholder.Search)}
                  className="h-[48px] w-full rounded-full border border-slate-300 bg-white pr-14 pl-6 text-[14px] text-[#163A5F] transition outline-none placeholder:text-slate-400 focus:border-[#0B5CAB]"
                />

                <button
                  type="button"
                  aria-label="Search"
                  className="absolute top-1/2 right-[6px] flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0B5CAB] text-white transition hover:bg-[#094b8a]"
                >
                  <SvgIcon iconId={IconId.Search} size={{width: 16, height: 16}} className='fill-secondary'/>
                </button>

                <div className="">
                  <ProductsListMenu className="absolute" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <PriceQuoteBtn />
            </div>
          </div>

          <MobileHeader toggleMobileMenu={toggleMobileMenu} />
        </div>
      </div>

      <MobileMenu
        direction="right"
        isOpen={isOpen}
        handleToggleMenu={toggleMobileMenu}
      >
        <div className="flex items-center justify-center">
          <Navbar intent="mobileMenu" />
        </div>
      </MobileMenu>
    </header>
  );
};

export default Header;

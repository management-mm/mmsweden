'use client';

import React, { memo } from 'react';

import BurgerMenu from './BurgerMenu';
import MobileSearchBar from './MobileSearchBar';
import PriceQuoteBtn from './PriceQuoteBtn';

import { Logo } from '@components/common/Logo';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

type MobileHeaderProps = {
  openMobileMenu: () => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  clearSearch: () => void;
  commitSearch: () => void;
};

function MobileHeader({
  openMobileMenu,
  searchValue,
  setSearchValue,
  clearSearch,
  commitSearch,
}: MobileHeaderProps) {
  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="shrink-0">
          <Logo />
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelect />
          <div className="flex-1">
            <PriceQuoteBtn />
          </div>
          <BurgerMenu handleToggleMobileMenu={openMobileMenu} />
        </div>
      </div>

      <MobileSearchBar
        value={searchValue}
        onChange={setSearchValue}
        clearSearch={clearSearch}
        onSearchClick={commitSearch}
      />
    </div>
  );
}

export default memo(MobileHeader);

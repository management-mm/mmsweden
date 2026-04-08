'use client';

import BurgerMenu from './BurgerMenu';
import MobileSearchBar from './MobileSearchBar';
import PriceQuoteBtn from './PriceQuoteBtn';

import { Logo } from '@components/common/Logo';
import LanguageSelect from '@components/common/languageSelector/LanguageSelect';

type MobileHeaderProps = {
  toggleMobileMenu: () => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  clearSearch: () => void;
};

export default function MobileHeader({
  toggleMobileMenu,
  searchValue,
  setSearchValue,
  clearSearch,
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
          <BurgerMenu handleToggleMobileMenu={toggleMobileMenu} />
        </div>
      </div>

      <MobileSearchBar
        value={searchValue}
        onChange={setSearchValue}
        clearSearch={clearSearch}
      />
    </div>
  );
}

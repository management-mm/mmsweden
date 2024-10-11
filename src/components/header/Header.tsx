import { useState } from 'react';

import BurgerMenu from './BurgerMenu';
import LanguageSelect from './LanguageSelect';
import PriceQuoteBtn from './PriceQuoteBtn';

import { Logo } from '@components/common/Logo';
import MobileMenu from '@components/common/MobileMenu';
import Navbar from '@components/common/Navbar';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="py-[8px] md:py-[14px]">
      <div className="container flex items-center justify-between">
        <Logo />
        <Navbar intent="header" />

        <div className="flex items-center gap-[32px]">
          <LanguageSelect />
          <PriceQuoteBtn />
          <BurgerMenu handleToggleMobileMenu={toggleMobileMenu} />
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

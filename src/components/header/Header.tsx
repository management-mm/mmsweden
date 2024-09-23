import { useState } from 'react';

import BurgerMenu from './BurgerMenu';
import LanguageSelect from './LanguageSelect';
import MobileMenu from './MobileMenu';
import PriceQuoteBtn from './PriceQuoteBtn';

import { Logo } from '@components/common/Logo';
import Navbar from '@components/common/Navbar';

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="py-[12px] md:py-[28px]">
      <div className="container flex items-center justify-between">
        <Logo />
        <Navbar intent="header" />

        <div className="flex items-center gap-[32px]">
          <LanguageSelect />
          <PriceQuoteBtn />
          <BurgerMenu handleToggleMobileMenu={toggleMobileMenu} />
        </div>

        <MobileMenu handleToggleMobileMenu={toggleMobileMenu} isOpen={isOpen} />
      </div>
    </header>
  );
};

export default Header;

'use client';

import { useState } from 'react';

import MobileHeader from './MobileHeader';

import MobileMenu from '@components/common/MobileMenu';
import Navbar from '@components/common/Navbar';

import useMediaQuery from '@hooks/useMediaQuery';
import useSearchKeyword from '@hooks/useSearchKeyword';

const MobileHeaderShell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const { searchValue, setSearchValue, clearSearch, commitSearch } =
    useSearchKeyword({
      enabled: isMobile,
      debounceMs: 400,
    });

  const toggleMobileMenu = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="lg:hidden">
      <div className="container">
        <MobileHeader
          toggleMobileMenu={toggleMobileMenu}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          clearSearch={clearSearch}
          commitSearch={commitSearch}
        />
      </div>

      <MobileMenu
        direction="right"
        isOpen={isOpen}
        handleToggleMenu={toggleMobileMenu}
      >
        <div className="container">
          <div className="flex items-center justify-center">
            <Navbar intent="mobileMenu" />
          </div>
        </div>
      </MobileMenu>
    </div>
  );
};

export default MobileHeaderShell;

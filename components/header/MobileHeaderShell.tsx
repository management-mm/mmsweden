'use client';

import { useCallback, useState } from 'react';

import dynamic from 'next/dynamic';

import MobileHeader from './MobileHeader';

import useSearchKeyword from '@hooks/useSearchKeyword';

const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'), {
  ssr: false,
});

const MobileHeaderShell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { searchValue, setSearchValue, clearSearch, commitSearch } =
    useSearchKeyword({
      enabled: true,
    });

  const openMobileMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="lg:hidden">
      <div className="container">
        <MobileHeader
          openMobileMenu={openMobileMenu}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          clearSearch={clearSearch}
          commitSearch={commitSearch}
        />
      </div>

      {isOpen ? (
        <MobileMenuDrawer isOpen={isOpen} onClose={closeMobileMenu} />
      ) : null}
    </div>
  );
};

export default MobileHeaderShell;

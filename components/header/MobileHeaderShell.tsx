'use client';

import { useCallback, useState } from 'react';

import type { CategoryNavigationNode } from '@lib/serverCategoryNavigation';
import dynamic from 'next/dynamic';

import MobileHeader from './MobileHeader';
import SearchKeywordUrlSync from './SearchKeywordUrlSync';

import useSearchKeyword from '@hooks/useSearchKeyword';

const MobileMenuDrawer = dynamic(() => import('./MobileMenuDrawer'), {
  ssr: false,
});

const MobileHeaderShell = ({
  categories,
}: {
  categories: CategoryNavigationNode[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const {
    searchValue,
    setSearchValue,
    clearSearch,
    commitSearch,
    syncFromUrl,
  } = useSearchKeyword({
    enabled: true,
    syncOnChange: false,
  });

  const openMobileMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="lg:hidden">
      <SearchKeywordUrlSync onKeywordChange={syncFromUrl} />
      <div className="container">
        <MobileHeader
          categories={categories}
          openMobileMenu={openMobileMenu}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          clearSearch={clearSearch}
          commitSearch={commitSearch}
        />
      </div>

      {isOpen && <MobileMenuDrawer isOpen={isOpen} onClose={closeMobileMenu} />}
    </div>
  );
};

export default MobileHeaderShell;

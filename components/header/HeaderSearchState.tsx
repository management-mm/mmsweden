'use client';

import DesktopHeader from './DesktopHeader';
import MobileHeaderShell from './MobileHeaderShell';

import useSearchKeyword from '@hooks/useSearchKeyword';

const HeaderSearchState = () => {
  const { searchValue, setSearchValue, clearSearch } = useSearchKeyword();

  return (
    <>
      <DesktopHeader
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <MobileHeaderShell
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        clearSearch={clearSearch}
      />
    </>
  );
};

export default HeaderSearchState;

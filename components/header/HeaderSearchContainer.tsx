'use client';

import HeaderSearch from './HeaderSearch';

import useMediaQuery from '@hooks/useMediaQuery';
import useSearchKeyword from '@hooks/useSearchKeyword';

const HeaderSearchContainer = () => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const { searchValue, setSearchValue, commitSearch } = useSearchKeyword({
    enabled: isDesktop,
    debounceMs: 400,
  });

  return (
    <HeaderSearch
      value={searchValue}
      onChange={setSearchValue}
      onSearchClick={commitSearch}
      wrapperClassName="relative mx-auto w-full max-w-[620px]"
      inputClassName="h-[48px] w-full rounded-full border border-slate-300 bg-white pr-14 pl-6 text-[14px] text-[#163A5F] transition outline-none placeholder:text-slate-400 focus:border-[#0B5CAB]"
      buttonClassName="absolute top-1/2 right-[6px] flex h-[36px] w-[36px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0B5CAB] text-white transition hover:bg-[#094b8a]"
      productsMenuClassName="absolute"
    />
  );
};

export default HeaderSearchContainer;

'use client';

import { useState } from 'react';

import HeaderSearch from './HeaderSearch';
import MobileCategoriesButton from './MobileCategoriesButton';

type Props = {
  value: string;
  onChange: (value: string) => void;
  clearSearch: () => void;
  onSearchClick: () => void;
};

const MobileSearchBar = ({
  value,
  onChange,
  clearSearch,
  onSearchClick,
}: Props) => {
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
    <div className="mt-3">
      <div className="relative flex w-full items-center gap-2">
        <MobileCategoriesButton
          isSearchActive={isSearchActive}
          onToggleBeforeOpen={() => {
            setIsSearchActive(false);
            clearSearch();
          }}
        />

        <div className="relative w-full">
          <HeaderSearch
            value={value}
            onChange={onChange}
            onFocus={() => {
              setIsSearchActive(true);
            }}
            onBlur={() => {
              if (!value.trim()) {
                setIsSearchActive(false);
              }
            }}
            onSearchClick={() => {
              setIsSearchActive(true);
              onSearchClick();
            }}
            wrapperClassName="relative w-full"
            inputClassName="h-[44px] w-full rounded-full border border-slate-300 bg-white pr-14 pl-5 text-[14px] text-[#163A5F] outline-none placeholder:text-slate-400 focus:border-[#0B5CAB]"
            buttonClassName="absolute top-1/2 right-[6px] flex h-[32px] w-[32px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0B5CAB] text-white"
            productsMenuClassName="absolute left-0"
          />
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar;

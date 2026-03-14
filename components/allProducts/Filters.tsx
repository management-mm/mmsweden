'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import FiltersGroup from './FiltersGroup';
import FoundProducts from './FoundProducts';

import MobileMenu from '@components/common/MobileMenu';
import SvgIcon from '@components/common/SvgIcon';

import { filters } from '@enums/filters';
import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const Filters = () => {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  const handleToggleFilters = () => {
    setIsOpen(prev => !prev);
  };

  const activeFiltersCount =
    searchParams.getAll(filters.Category).length +
    searchParams.getAll(filters.Manufacturer).length +
    searchParams.getAll(filters.Industry).length +
    searchParams.getAll(filters.Condition).length;

  return (
    <>
      <div className="mb-[22px] flex justify-between md:gap-[22px] lg:gap-0">
        <button
          type="button"
          className="flex items-center gap-[8px]"
          onClick={handleToggleFilters}
        >
          <SvgIcon iconId={IconId.Filter} size={{ width: 14, height: 14 }} />

          <h2 className="font-openSans text-[12px]">
            {t(Filter.Filters)}
            <span> ({activeFiltersCount})</span>
          </h2>
        </button>

        <FoundProducts />
      </div>

      <MobileMenu
        direction="left"
        isOpen={isOpen}
        handleToggleMenu={handleToggleFilters}
      >
        <FiltersGroup className="px-[28px] lg:px-0" />
      </MobileMenu>

      <FiltersGroup className="hidden lg:block" />
    </>
  );
};

export default Filters;

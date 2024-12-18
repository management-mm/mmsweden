import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import FiltersGroup from './FiltersGroup';
import FoundProducts from './FoundProducts';

import MobileMenu from '@components/common/MobileMenu';
import SvgIcon from '@components/common/SvgIcon';

import useWindowWidth from '@hooks/useWindowWidth';

import { filters } from '@enums/filters';
import { Filter } from '@enums/i18nConstants';
import { IconId } from '@enums/iconsSpriteId';

const Filters = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const windowWidth = useWindowWidth();

  const handleToogleFilters = () => {
    setIsOpen(!isOpen);
  };

  const filtersCount = () =>
    searchParams.getAll(filters.Category).length +
    searchParams.getAll(filters.Manufacturer).length +
    searchParams.getAll(filters.Industry).length +
    searchParams.getAll(filters.Condition).length;

  return (
    <>
      <div className="mb-[22px] flex justify-between md:gap-[22px] lg:gap-0">
        <button
          className="flex cursor-default items-center gap-[8px]"
          onClick={windowWidth < 1178 ? handleToogleFilters : undefined}
        >
          <SvgIcon iconId={IconId.Filter} size={{ width: 14, height: 14 }} />

          <h2 className="cursor-default font-openSans text-[12px]">
            {t(Filter.Filters)}
            <span> ({filtersCount()})</span>
          </h2>
        </button>

        <FoundProducts />
      </div>
      <MobileMenu
        direction={'left'}
        isOpen={isOpen}
        handleToggleMenu={handleToogleFilters}
      >
        <FiltersGroup className="px-[28px]" />
      </MobileMenu>
      <FiltersGroup className="hidden lg:block" />
    </>
  );
};

export default Filters;

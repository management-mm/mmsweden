import clsx from 'clsx';

import FiltersAndSearch from '@components/allProducts/FiltersAndSearch';
import ProductsList from '@components/allProducts/ProductsList';
import Breadcrumb from '@components/common/Breadcrumb';

import useWindowWidth from '@hooks/useWindowWidth';

const AllProducts = () => {
  const isAdmin = window.location.pathname.includes('admin');
  const windowWidth = useWindowWidth();

  return (
    <div
      className={clsx(
        'container',
        'pt-[12px] md:pt-[22px]',
        isAdmin && 'lg:ml-0'
      )}
    >
      {!isAdmin && <Breadcrumb />}
      <div className="flex flex-col justify-between lg:flex-row lg:justify-start lg:gap-[30px]">
        {(!isAdmin || windowWidth < 1178) && <FiltersAndSearch />}

        <ProductsList />
        {isAdmin && windowWidth > 1178 && <FiltersAndSearch />}
      </div>
    </div>
  );
};

export default AllProducts;

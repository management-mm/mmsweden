import FiltersAndSearch from '@components/allProducts/FiltersAndSearch';
import ProductsList from '@components/allProducts/ProductsList';
import Breadcrumb from '@components/common/Breadcrumb';

import { useAuth } from '@hooks/useAuth';
import useWindowWidth from '@hooks/useWindowWidth';

import { cn } from '@utils/cn';

const AllProducts = () => {
  const { isLoggedIn } = useAuth();
  const windowWidth = useWindowWidth();

  return (
    <div className={cn('container', 'pt-[12px] md:pt-[22px] lg:ml-0')}>
      {!isLoggedIn && <Breadcrumb />}
      <div className="flex flex-col justify-between lg:flex-row lg:justify-start lg:gap-[30px]">
        {(!isLoggedIn || windowWidth < 1178) && <FiltersAndSearch />}

        <ProductsList />
        {(isLoggedIn && windowWidth > 1178) && <FiltersAndSearch />}
      </div>
    </div>
  );
};

export default AllProducts;

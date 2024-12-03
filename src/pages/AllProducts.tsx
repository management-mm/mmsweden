import FiltersAndSearch from '@components/allProducts/FiltersAndSearch';
import ProductsList from '@components/allProducts/ProductsList';
import Breadcrumb from '@components/common/Breadcrumb';

import { cn } from '@utils/cn';

const AllProducts = () => {
  return (
    <div className={cn('container', 'pt-[12px] md:pt-[22px]')}>
      <Breadcrumb />
      <div className="flex flex-col justify-between lg:flex-row lg:justify-start lg:gap-[30px]">
        <FiltersAndSearch />

        <ProductsList />
      </div>
    </div>
  );
};

export default AllProducts;

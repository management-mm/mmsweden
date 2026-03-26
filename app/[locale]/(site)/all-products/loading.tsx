import Skeleton from 'react-loading-skeleton';

import ProductsListSkeleton from '@components/allProducts/ProductsListSkeleton';

const Loading = () => {
  return (
    <div className="container pt-[12px] md:pt-[22px]">
      <div className="flex flex-col lg:flex-row lg:justify-start lg:gap-[30px]">
        <div className="hidden shrink-0 lg:block">
          <div className="border-secondary w-[300px] rounded-[4px] border p-[16px]">
            <div className="mb-[16px]">
              <Skeleton height={22} width="45%" />
            </div>
            <div className="mb-[16px]">
              <Skeleton height={40} />
            </div>
            <div className="space-y-[12px]">
              <Skeleton height={16} width="70%" />
              <Skeleton height={16} width="82%" />
              <Skeleton height={16} width="62%" />
              <Skeleton height={16} width="75%" />
            </div>
          </div>
        </div>

        <ProductsListSkeleton locale="en" />
      </div>
    </div>
  );
};

export default Loading;

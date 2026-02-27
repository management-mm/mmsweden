'use client';

import { Suspense, lazy } from 'react';

import clsx from 'clsx';

import FiltersAndSearch from '@components/allProducts/FiltersAndSearch';
import Breadcrumb from '@components/common/Breadcrumb';
import Loader from '@components/common/loaders/Loader';

import useWindowWidth from '@hooks/useWindowWidth';

const ProductsList = lazy(() => import('@components/allProducts/ProductsList'));

type Props = {
  mode?: 'public' | 'admin';
};

const AllProductsView = ({ mode = 'public' }: Props) => {
  const isAdmin = mode === 'admin';
  const windowWidth = useWindowWidth();

  return (
    <div
      className={clsx(
        'container',
        'pt-[12px] md:pt-[22px]',
        isAdmin && 'lg:mx-0'
      )}
    >
      {!isAdmin && <Breadcrumb />}

      <div className="flex flex-col justify-between lg:flex-row lg:justify-start lg:gap-[30px]">
        {(!isAdmin || windowWidth < 1178) && <FiltersAndSearch />}

        <Suspense fallback={<Loader />}>
          <ProductsList />
        </Suspense>

        {isAdmin && windowWidth > 1178 && <FiltersAndSearch />}
      </div>
    </div>
  );
};

export default AllProductsView;
